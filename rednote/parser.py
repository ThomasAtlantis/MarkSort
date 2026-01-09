import urllib.parse
from .tables.note_detail import NoteDetail


class NoteDetailParser:

    def __init__(self, note_detail: NoteDetail):
        self.note_detail = note_detail

    def to_description(self) -> str:
        title = self.note_detail['note_card']['title']
        description = self.note_detail['note_card']['desc']
        author = self.note_detail['note_card']['user']['nickname']
        images = [x['url_default'] for x in self.note_detail['note_card']['image_list']]
        return f"标题：{title}\n简介：{description}\n图片：{'\n'.join(images)}"
    
    def extract_urls(self, xsec_token: str) -> dict:
        note_url = f"https://www.xiaohongshu.com/explore/{self.note_detail['note_card']['note_id']}?" + urllib.parse.urlencode({'xsec_token': xsec_token})
        stream = self.note_detail['note_card']['video']['media']['stream']
        video_urls = [item['master_url'] for codec in stream for item in stream[codec]]
        return {
            "note_url": note_url,
            "video_url": video_urls
        }
