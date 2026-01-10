import asyncio
import json
from pathlib import Path
from marksort.rednote.api import RedNoteAPI


CURSOR_LOCK_PATH = "cursor.lock"
BATCH_SIZE = 20

async def export_notes(
    cookies: RedNoteAPI.Cookies, 
    user_id: str, 
    output_file: str, 
    cursor: str | None = None,
    max_notes: int | None = None
):
    if cursor is None:
        if Path(CURSOR_LOCK_PATH).exists():
            with open(CURSOR_LOCK_PATH, "r") as f:
                cursor = f.read()
        else:
            cursor = None

    notes_data = []
    count, has_more = 0, True
    api = RedNoteAPI(cookies, user_id)

    while has_more and (not max_notes or count < max_notes):
        num_notes = min(BATCH_SIZE, max_notes - count) if max_notes else BATCH_SIZE
        notes, has_more, cursor = await api.get_marks(num=num_notes, cursor=cursor)
        if not notes: break
        
        for note in notes:
            try:
                detail = await api.get_feed(note['note_id'], note['xsec_token'])                
                note_with_detail = { **note, 'detail': detail }
                notes_data.append(note_with_detail)
                count += 1                    
                print(f"Note {count}: {note.get('display_title', 'Untitled')}")
            except Exception as e:
                print(f"Error dealing with note `{note.get('note_id', 'unknown')}`: {e}")
                notes_data.append(note)
                continue
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(notes_data, f, ensure_ascii=False, indent=2)
    
    if cursor:
        with open(CURSOR_LOCK_PATH, 'w', encoding='utf-8') as f:
            f.write(cursor)
    print(f"\nExported {len(notes_data)} notes to {output_file}")
