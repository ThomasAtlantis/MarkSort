import urllib.parse
from typing import Any, Callable, TypedDict, cast
from xhshow import Xhshow
from rnet import Client, Impersonate
from .tables import Note, NoteDetail
from bs4 import BeautifulSoup


xhshow_client = Xhshow()
rnet_client = Client(impersonate=Impersonate.Chrome137, verify=False)

class StaticVariable:
    
    __slots__ = ("func",)

    def __init__(self, func: Callable) -> None:
        self.func = func
        
    def init(self, name: str, value: Any):
        statics = self.func.__func__
        if value is not None:
            setattr(statics, name, value)
        value = getattr(statics, name, "")
        setattr(statics, name, value)
        return value

    def set(self, name: str, value: Any):
        statics = self.func.__func__
        setattr(statics, name, value)
        return value

class RedNoteAPI:

    uri_map = {
        ("GET", "marks"): "/api/sns/web/v2/note/collect/page",
        ("POST", "feed"): "/api/sns/web/v1/feed"
    }

    Cookies = TypedDict("Cookies", {
        "a1": str, "webId": str, "web_session": str
    })

    def __init__(self, cookies: Cookies, user_id: str):
        self.host = "https://edith.xiaohongshu.com"
        self.xsecappid = "xhs-pc-web"
        self.user_id = user_id
        self.cookies = cast(dict, cookies)
    
    async def get_feed_legacy(self, note_id: str, xsec_token: str) -> dict:
        url = f"https://www.xiaohongshu.com/explore/{note_id}?" + urllib.parse.urlencode({'xsec_token': xsec_token})
        response = await rnet_client.get(url=url, cookies=self.cookies)
        result = await response.text()
        soup = BeautifulSoup(result, "html.parser")
        soup = soup.find_all("div", id="noteContainer")[0]
        username = soup.find_all("span", class_="username")[0].text.strip()
        note = soup.find_all("div", class_="note-content")[0]
        title = note.find_all("div", class_="title")[0].text.strip()
        note_text = note.find_all("span", class_="note-text")[0]
        note_text = note_text.find_all("span")[0]
        description = note_text.text.strip()
        tags = ' '.join([x.text.strip() for x in note.find_all("a", class_="tag")])
        return {
            "title": title,
            "author": username,
            "description": description,
            "tags": tags
        }

    async def get_feed(self, note_id: str, xsec_token: str) -> NoteDetail:
        uri = self.uri_map[("POST", "feed")]
        data = {
            'source_note_id': note_id,
            'image_formats': ['jpg', 'webp', 'avif'],
            'extra': { 'need_body_topic': '1' },
            'xsec_source': 'pc_user',
            'xsec_token': xsec_token,
        }
        response = await rnet_client.post(
            url=urllib.parse.urljoin(self.host, uri),
            json=data, cookies=self.cookies, 
            headers=xhshow_client.sign_headers_post(
                uri=uri, cookies=self.cookies, payload=data
            )
        )
        result = await response.json()
        if not result['success']:
            raise Exception(f"Error {result['code']}: {result['msg']}")
        return result['data']['items'][0]
    
    async def get_marks(self, num: int, cursor: str|None = None) -> tuple[list[Note], bool]:
        uri = self.uri_map[("GET", "marks")]
        statics = StaticVariable(self.get_marks)
        cursor_ = statics.init("_cursor", cursor)
        params = {
            "num": num,
            "cursor": cursor_,
            "user_id": self.user_id,
            "image_formats": "jpg,webp,avif",
            "xsec_token": "",
            "xsec_source": ""
        }
        res = await rnet_client.get(
            url=xhshow_client.build_url(
                base_url=urllib.parse.urljoin(self.host, uri),
                params=params
            ), 
            cookies=self.cookies, 
            headers=xhshow_client.sign_headers_get(
                uri=uri,
                cookies=self.cookies,
                params=params,
                xsec_appid=self.xsecappid
            )
        )
        res = await res.json()
        if not res['success']:
            raise Exception(f"Error {res['code']}: {res['msg']}")
        statics.set("_cursor", res['data']['cursor'])
        has_more = res['data']['has_more']
        return res['data']['notes'], has_more


    async def download_video(self, url: str, note_id: str):
        response = await rnet_client.get(url=url, cookies=self.cookies)
        file_name = f"{note_id}.{url.split('.')[-1]}"
        with open(file_name, "wb") as f:
            f.write(await response.bytes())
        return file_name