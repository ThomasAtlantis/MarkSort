import type { NoteWithDetail, Category, Tag } from '../types';

// Load notes data from JSON file (assumes data is exported to public/notes.json)
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

// Extract all unique tags from notes
export function extractAllTags(notes: NoteWithDetail[]): Tag[] {
  const tagMap = new Map<string, Tag>();
  
  notes.forEach(note => {
    if (note.detail?.note_card.tag_list) {
      note.detail.note_card.tag_list.forEach(tag => {
        if (!tagMap.has(tag.id)) {
          tagMap.set(tag.id, tag);
        }
      });
    }
  });
  
  return Array.from(tagMap.values());
}

// Generate categories based on tags
export function generateCategories(notes: NoteWithDetail[]): Category[] {
  const tags = extractAllTags(notes);
  
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

// Filter notes by category
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

// Generate original note URL
export function getNoteUrl(noteId: string, xsecToken: string): string {
  const params = new URLSearchParams({ xsec_token: xsecToken });
  return `https://www.xiaohongshu.com/explore/${noteId}?${params.toString()}`;
}

// Get cover image URL (prefer url_default, fallback to url_pre)
export function getCoverImageUrl(note: NoteWithDetail): string {
  if (note.detail?.note_card.image_list && note.detail.note_card.image_list.length > 0) {
    return note.detail.note_card.image_list[0].url_default || note.detail.note_card.image_list[0].url_pre;
  }
  if (note.cover) {
    return note.cover.url_default || note.cover.url_pre;
  }
  return '';
}

// Get first available video URL from note detail
export function getVideoUrl(note: NoteWithDetail): string | null {
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
