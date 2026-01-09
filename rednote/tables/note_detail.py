from typing import Literal, TypedDict, List, Dict, Any

ImageInfo = TypedDict("ImageInfo", {
    "url": str,
    "image_scene": Literal["WB_PRV", "WB_DFT"]
})

ImageListItem = TypedDict("ImageListItem", {
    "trace_id": str,
    "url_default": str,
    "live_photo": bool,
    "width": int,
    "url": str,
    "info_list": List[ImageInfo],
    "url_pre": str,
    "stream": Dict[str, Any],
    "file_id": str,
    "height": int
})

ShareInfo = TypedDict("ShareInfo", {
    "un_share": bool
})

InteractInfoDetail = TypedDict("InteractInfoDetail", {
    "liked": bool,
    "liked_count": str,
    "collected": bool,
    "collected_count": str,
    "comment_count": str,
    "share_count": str,
    "followed": bool,
    "relation": Literal["none"]
})

VideoImage = TypedDict("VideoImage", {
    "thumbnail_fileid": str
})

VideoCapa = TypedDict("VideoCapa", {
    "duration": int
})

VideoInfo = TypedDict("VideoInfo", {
    "biz_name": int,
    "biz_id": str,
    "duration": int,
    "md5": str,
    "hdr_type": int,
    "drm_type": int,
    "stream_types": List[int]
})

StreamItem = TypedDict("StreamItem", {
    "video_duration": int,
    "audio_channels": int,
    "width": int,
    "audio_duration": int,
    "avg_bitrate": int,
    "backup_urls": List[str],
    "hdr_type": int,
    "stream_desc": str,
    "psnr": float,
    "weight": int,
    "fps": int,
    "video_bitrate": int,
    "audio_codec": str,
    "audio_bitrate": int,
    "volume": int,
    "rotate": int,
    "master_url": str,
    "quality_type": str,
    "size": int,
    "duration": int,
    "vmaf": int,
    "ssim": float,
    "format": str,
    "default_stream": int,
    "height": int,
    "video_codec": str,
    "stream_type": int
})

VideoStream = TypedDict("VideoStream", {
    "av1": List[StreamItem],
    "h264": List[StreamItem],
    "h265": List[StreamItem],
    "h266": List[StreamItem],
})

VideoMedia = TypedDict("VideoMedia", {
    "video_id": int,
    "video": VideoInfo,
    "stream": VideoStream
})

VideoDetail = TypedDict("VideoDetail", {
    "image": VideoImage,
    "capa": VideoCapa,
    "media": VideoMedia
})

Tag = TypedDict("Tag", {
    "id": str,
    "name": str,
    "type": Literal["topic"]
})

UserDetail = TypedDict("UserDetail", {
    "user_id": str,
    "nickname": str,
    "avatar": str,
    "xsec_token": str
})

NoteCard = TypedDict("NoteCard", {
    "type": Literal["video"],
    "title": str,
    "desc": str,
    "user": UserDetail,
    "image_list": List[ImageListItem],
    "share_info": ShareInfo,
    "note_id": str,
    "interact_info": InteractInfoDetail,
    "video": VideoDetail,
    "tag_list": List[Tag],
    "at_user_list": List[Any],
    "time": int,
    "last_update_time": int
})

NoteDetail = TypedDict("NoteDetail", {
    "id": str,
    "model_type": Literal["note"],
    "note_card": NoteCard
})
