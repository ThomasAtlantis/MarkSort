// TypeScript types matching Python TypedDict definitions

export type ImageScene = "WB_PRV" | "WB_DFT";

export interface InfoList {
  image_scene: ImageScene;
  url: string;
}

export interface Cover {
  height: number;
  width: number;
  info_list: InfoList[];
  url_pre: string;
  url_default: string;
}

export interface User {
  user_id: string;
  nickname: string;
  avatar: string;
  xsec_token: string;
}

export interface InteractInfo {
  liked: boolean;
  liked_count: string;
}

export interface Note {
  display_title: string;
  type: "video";
  cover: Cover;
  user: User;
  interact_info: InteractInfo;
  xsec_token: string;
  note_id: string;
}

export interface ImageInfo {
  url: string;
  image_scene: ImageScene;
}

export interface ImageListItem {
  trace_id: string;
  url_default: string;
  live_photo: boolean;
  width: number;
  url: string;
  info_list: ImageInfo[];
  url_pre: string;
  stream: Record<string, any>;
  file_id: string;
  height: number;
}

export interface ShareInfo {
  un_share: boolean;
}

export interface InteractInfoDetail {
  liked: boolean;
  liked_count: string;
  collected: boolean;
  collected_count: string;
  comment_count: string;
  share_count: string;
  followed: boolean;
  relation: "none";
}

export interface VideoImage {
  thumbnail_fileid: string;
}

export interface VideoCapa {
  duration: number;
}

export interface VideoInfo {
  biz_name: number;
  biz_id: string;
  duration: number;
  md5: string;
  hdr_type: number;
  drm_type: number;
  stream_types: number[];
}

export interface StreamItem {
  video_duration: number;
  audio_channels: number;
  width: number;
  audio_duration: number;
  avg_bitrate: number;
  backup_urls: string[];
  hdr_type: number;
  stream_desc: string;
  psnr: number;
  weight: number;
  fps: number;
  video_bitrate: number;
  audio_codec: string;
  audio_bitrate: number;
  volume: number;
  rotate: number;
  master_url: string;
  quality_type: string;
  size: number;
  duration: number;
  vmaf: number;
  ssim: number;
  format: string;
  default_stream: number;
  height: number;
  video_codec: string;
  stream_type: number;
}

export interface VideoStream {
  av1?: StreamItem[];
  h264?: StreamItem[];
  h265?: StreamItem[];
  h266?: StreamItem[];
}

export interface VideoMedia {
  video_id: number;
  video: VideoInfo;
  stream: VideoStream;
}

export interface VideoDetail {
  image: VideoImage;
  capa: VideoCapa;
  media: VideoMedia;
}

export interface Tag {
  id: string;
  name: string;
  type: "topic";
}

export interface UserDetail {
  user_id: string;
  nickname: string;
  avatar: string;
  xsec_token: string;
}

export interface NoteCard {
  type: "video";
  title: string;
  desc: string;
  user: UserDetail;
  image_list: ImageListItem[];
  share_info: ShareInfo;
  note_id: string;
  interact_info: InteractInfoDetail;
  video: VideoDetail;
  tag_list: Tag[];
  at_user_list: any[];
  time: number;
  last_update_time: number;
}

export interface NoteDetail {
  id: string;
  model_type: "note";
  note_card: NoteCard;
}

// Extended note with detail information for display
export interface NoteWithDetail extends Note {
  detail?: NoteDetail;
}

// Category type
export interface Category {
  id: string;
  name: string;
  tagIds: string[];
}
