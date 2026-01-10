from typing import Literal, TypedDict

InfoList = TypedDict("InfoList", {
    "image_scene": Literal["WB_PRV", "WB_DFT"],
    "url": str
})

Cover = TypedDict("Cover", {
    "height": int,
    "width": int,
    "info_list": InfoList,
    "url_pre": str,
    "url_default": str
})

User = TypedDict("User", {
    "user_id": str,
    "nickname": str,
    "avatar": str,
    "xsec_token": str
})

InteractInfo = TypedDict("InteractInfo", {
    "liked": bool,
    "liked_count": str
})

Note = TypedDict("Note", {
    "display_title": str,
    "type": Literal["video"],
    "cover": Cover,
    "user": User,
    "interact_info": InteractInfo,
    "xsec_token": str,
    "note_id": str
})