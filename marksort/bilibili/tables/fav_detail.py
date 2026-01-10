from typing import Any, List, Optional, TypedDict

InfoUpper = TypedDict("InfoUpper", {
    "mid": int,
    "name": str,
    "face": str,
    "followed": bool,
    "vip_type": int,
    "vip_statue": int,
})

MediaUpper = TypedDict("MediaUpper", {
    "mid": int,
    "name": str,
    "face": str,
    "jump_link": str,
})

InfoCntInfo = TypedDict("InfoCntInfo", {
    "collect": int,
    "play": int,
    "thumb_up": int,
    "share": int,
})

MediaCntInfo = TypedDict("MediaCntInfo", {
    "collect": int,
    "play": int,
    "danmaku": int,
    "vt": int,
    "play_switch": int,
    "reply": int,
    "view_text_1": str,
})

Ugc = TypedDict("Ugc", {
    "first_cid": int,
})

FavInfo = TypedDict("FavInfo", {
    "id": int,
    "fid": int,
    "mid": int,
    "attr": int,
    "title": str,
    "cover": str,
    "upper": InfoUpper,
    "cover_type": int,
    "cnt_info": InfoCntInfo,
    "type": int,
    "intro": str,
    "ctime": int,
    "mtime": int,
    "state": int,
    "fav_state": int,
    "like_state": int,
    "media_count": int,
    "is_top": bool,
})

Media = TypedDict("Media", {
    "id": int,
    "type": int,
    "title": str,
    "cover": str,
    "intro": str,
    "page": int,
    "duration": int,
    "upper": MediaUpper,
    "attr": int,
    "cnt_info": MediaCntInfo,
    "link": str,
    "ctime": int,
    "pubtime": int,
    "fav_time": int,
    "bv_id": str,
    "bvid": str,
    "season": Optional[Any],
    "ogv": Optional[Any],
    "ugc": Ugc,
    "media_list_link": str,
})

FavDetail = TypedDict("FavDetail", {
    "info": FavInfo,
    "medias": List[Media],
    "has_more": bool,
    "ttl": int,
})
