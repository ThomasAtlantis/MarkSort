from typing import Any, List, TypedDict

FavItem = TypedDict("FavItem", {
    "id": int,
    "fid": int,
    "mid": int,
    "attr": int,
    "title": str,
    "fav_state": int,
    "media_count": int,
})

FavList = TypedDict("FavList", {
    "count": int,
    "list": List[FavItem],
    "season": Any
})