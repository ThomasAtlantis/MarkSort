import type { NoteWithDetail, Category, Tag, UnifiedItem, Platform } from '../types';

// Bilibili data types
interface BilibiliMedia {
  id: number;
  type: number;
  title: string;
  cover: string;
  intro: string;
  page: number;
  duration: number;
  upper: {
    mid: number;
    name: string;
    face: string;
    jump_link: string;
  };
  cnt_info: {
    collect: number;
    play: number;
    danmaku?: number;
    view_text_1?: string;
  };
  link: string;
  bv_id: string;
  bvid: string;
  fav_time: number;
  [key: string]: any;
}

// Helper functions (need to be defined before they're used)

// Get cover image URL (prefer url_default, fallback to url_pre)
function getCoverImageUrl(note: NoteWithDetail): string {
  if (note.detail?.note_card.image_list && note.detail.note_card.image_list.length > 0) {
    return note.detail.note_card.image_list[0].url_default || note.detail.note_card.image_list[0].url_pre;
  }
  if (note.cover) {
    return note.cover.url_default || note.cover.url_pre;
  }
  return '';
}

// Get first available video URL from note detail
function getVideoUrl(note: NoteWithDetail): string | null {
  if (!note.detail?.note_card.video?.media?.stream) {
    return null;
  }

  const stream = note.detail.note_card.video.media.stream;
  
  // Try different codecs in order: h264, h265, av1, h266
  const codecOrder: Array<keyof typeof stream> = ['h264', 'h265', 'av1', 'h266'];
  
  for (const codec of codecOrder) {
    const streamItems = stream[codec];
    if (streamItems && streamItems.length > 0) {
      // Get the first stream item's master_url
      const firstUrl = streamItems[0]?.master_url;
      if (firstUrl) {
        return firstUrl;
      }
    }
  }
  
  // If no URL found in preferred codecs, try any available codec
  for (const codec in stream) {
    const streamItems = stream[codec as keyof typeof stream];
    if (Array.isArray(streamItems) && streamItems.length > 0) {
      const firstUrl = streamItems[0]?.master_url;
      if (firstUrl) {
        return firstUrl;
      }
    }
  }
  
  return null;
}

// Generate original note URL
function getNoteUrl(noteId: string, xsecToken: string): string {
  const params = new URLSearchParams({ xsec_token: xsecToken });
  return `https://www.xiaohongshu.com/explore/${noteId}?${params.toString()}`;
}

// Convert Xiaohongshu note to UnifiedItem
function convertXiaohongshuNote(note: NoteWithDetail): UnifiedItem {
  const title = note.detail?.note_card.title || note.display_title;
  const description = note.detail?.note_card.desc || '';
  const coverUrl = getCoverImageUrl(note);
  const author = note.detail?.note_card.user || note.user;
  const tags = note.detail?.note_card.tag_list || [];
  const interactInfo = note.detail?.note_card.interact_info || note.interact_info;
  const videoUrl = getVideoUrl(note);
  const noteUrl = getNoteUrl(note.note_id, note.xsec_token);

  return {
    platform: 'xiaohongshu',
    id: note.note_id,
    title,
    description,
    cover: coverUrl,
    author: {
      name: author.nickname,
      avatar: author.avatar,
    },
    url: noteUrl,
    tags,
    interactInfo: {
      liked_count: interactInfo.liked_count,
      collected_count: note.detail?.note_card.interact_info?.collected_count,
      comment_count: note.detail?.note_card.interact_info?.comment_count,
    },
    videoUrl,
    originalData: note,
  };
}

// Convert Bilibili media to UnifiedItem
function convertBilibiliMedia(media: BilibiliMedia): UnifiedItem {
  const videoUrl = `https://www.bilibili.com/video/${media.bvid}`;
  // Extract filename from cover URL (JavaScript doesn't support negative indexing like Python)
  const coverFilename = media.cover ? media.cover.split('/').pop() || '' : '';
  const coverUrl = coverFilename ? `/images/${coverFilename}` : '';
  
  // Extract bilibili player parameters for iframe embedding
  const bilibiliPlayerParams = media.ugc?.first_cid ? {
    aid: media.id,
    bvid: media.bvid,
    cid: media.ugc.first_cid,
    page: media.page || 1,
  } : undefined;
  
  return {
    platform: 'bilibili',
    id: media.bvid || String(media.id),
    title: media.title,
    description: media.intro || '',
    cover: coverUrl,
    author: {
      name: media.upper.name,
      avatar: `/images/${media.upper.face.split('/').pop() || ''}`,
    },
    url: videoUrl,
    tags: [], // Bilibili media doesn't have tags in the current structure
    interactInfo: {
      collected_count: String(media.cnt_info.collect || 0),
      play_count: media.cnt_info.view_text_1 || String(media.cnt_info.play || 0),
    },
    duration: media.duration,
    bilibiliPlayerParams,
    originalData: media,
  };
}

// Load notes data from JSON file (legacy function, kept for compatibility)
export async function loadNotes(): Promise<NoteWithDetail[]> {
  try {
    const response = await fetch('/notes.json');
    if (!response.ok) {
      throw new Error('Failed to load notes data');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    // Return empty array or sample data for development
    return [];
  }
}

// Load unified items from all platforms
export async function loadUnifiedItems(): Promise<UnifiedItem[]> {
  const items: UnifiedItem[] = [];
  
  try {
    // Load Xiaohongshu data (rednote.json or notes.json)
    try {
      const response = await fetch('/rednote.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const notes: NoteWithDetail[] = data;
          items.push(...notes.map(convertXiaohongshuNote));
        }
      }
    } catch (error) {
      console.warn('Failed to load rednote.json:', error);
    }

    // Try loading from notes.json as fallback
    if (items.length === 0) {
      try {
        const notes = await loadNotes();
        items.push(...notes.map(convertXiaohongshuNote));
      } catch (error) {
        console.warn('Failed to load notes.json:', error);
      }
    }
  } catch (error) {
    console.warn('Error loading Xiaohongshu data:', error);
  }

  // Load Bilibili data
  try {
    const response = await fetch('/bilibili.json');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const mediaList: BilibiliMedia[] = data;
        items.push(...mediaList.map(convertBilibiliMedia));
      }
    }
  } catch (error) {
    console.warn('Error loading Bilibili data:', error);
  }

  return items;
}

// Extract all unique tags from unified items
export function extractAllTags(items: UnifiedItem[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  
  items.forEach(item => {
    item.tags.forEach(tag => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, tag);
      }
    });
  });
  
  return Array.from(tagMap.values());
}

// Generate categories based on tags
export function generateCategories(items: UnifiedItem[]): Category[] {
  const tags = extractAllTags(items);
  
  // Create a category for each tag
  const categories: Category[] = tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    tagIds: [tag.id]
  }));
  
  // Add an "All" category
  categories.unshift({
    id: 'all',
    name: '全部',
    tagIds: []
  });
  
  return categories;
}

// Filter unified items by category
export function filterItemsByCategory(
  items: UnifiedItem[], 
  category: Category
): UnifiedItem[] {
  if (category.id === 'all') {
    return items;
  }
  
  return items.filter(item => {
    // Items without tags (like Bilibili) will appear in "全部" category only
    if (item.tags.length === 0) {
      return false;
    }
    
    const itemTagIds = item.tags.map(tag => tag.id);
    return category.tagIds.some(tagId => itemTagIds.includes(tagId));
  });
}

// Get platform display name
export function getPlatformName(platform: Platform): string {
  const names: Record<Platform, string> = {
    xiaohongshu: '小红书',
    bilibili: 'B站',
  };
  return names[platform];
}

// Legacy function for backward compatibility
export function filterNotesByCategory(
  notes: NoteWithDetail[], 
  category: Category
): NoteWithDetail[] {
  if (category.id === 'all') {
    return notes;
  }
  
  return notes.filter(note => {
    if (!note.detail?.note_card.tag_list) {
      return false;
    }
    
    const noteTagIds = note.detail.note_card.tag_list.map(tag => tag.id);
    return category.tagIds.some(tagId => noteTagIds.includes(tagId));
  });
}
