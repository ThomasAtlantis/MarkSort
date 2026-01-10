from typing import TypedDict, cast
import urllib.parse
from rnet import Client, Impersonate
from .tables.fav_detail import FavDetail
from .tables.fav_list import FavList


rnet_client = Client(impersonate=Impersonate.Chrome137, verify=False)

class BilibiliAPI:

    uri_map = {
        ("GET", "marks"): "/x/v3/fav/resource/list",
        ("GET", "marks_list"): "/x/v3/fav/folder/created/list-all",
    }

    Cookies = TypedDict("Cookies", {
        "SESSDATA": str,
    })

    def __init__(self, cookies: Cookies, up_mid: str, web_location: str):
        self.host = "https://api.bilibili.com"
        self.cookies = cast(dict, cookies)
        self.up_mid = up_mid
        self.web_location = web_location

    async def get_marks_list(self) -> FavList:
        uri = self.uri_map[("GET", "marks_list")]
        params = {
            "up_mid": self.up_mid,
            "web_location": self.web_location,
        }
        url = urllib.parse.urljoin(self.host, uri)
        url += "?" + urllib.parse.urlencode(params)
        response = await rnet_client.get(url, cookies=self.cookies)
        results = await response.json()
        if results["code"] != 0:
            raise Exception(results["message"])
        return results["data"]

    async def get_marks(
        self, 
        collection_id: str|int, 
        page: int = 1, 
        page_size: int = 40
    ) -> tuple[FavDetail, bool]:
        if isinstance(collection_id, int):
            collection_id = str(collection_id)
        uri = self.uri_map[("GET", "marks")]
        params = {
            "media_id": collection_id,
            "pn": page,
            "ps": page_size,
            "keyword": "",
            "order": "mtime",
            "type": "0",
            "tid": "0",
            "platform": "web",
            "web_location": self.web_location,
        }
        url = urllib.parse.urljoin(self.host, uri)
        url += "?" + urllib.parse.urlencode(params)
        response = await rnet_client.get(url, cookies=self.cookies)
        results = await response.json()
        if results["code"] != 0:
            raise Exception(results["message"])
        data: FavDetail = results["data"]
        return data, data["has_more"]

    @staticmethod
    async def export(
        cookies: Cookies, 
        up_mid: str, 
        web_location: str
    ):
        api = BilibiliAPI(cookies, up_mid, web_location)
        response = await api.get_marks_list()
        fav_data = []
        count = 0
        for fav_idx, fav_list in enumerate(response["list"]):
            print(f"Fav List {fav_idx}: {fav_list['title']}")
            has_more, page = True, 1
            while has_more:
                fav_detail, has_more = await api.get_marks(fav_list["id"], page)
                fav_data.extend(fav_detail["medias"])
                page += 1
            count += 1
        return fav_data
            