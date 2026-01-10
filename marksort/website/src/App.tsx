import { useState, useEffect } from 'react';
import type { NoteWithDetail, Category } from './types';
import { 
  loadNotes, 
  generateCategories, 
  filterNotesByCategory 
} from './services/dataService';
import CategoryNav from './components/CategoryNav';
import NoteCard from './components/NoteCard';
import './App.css';

function App() {
  const [notes, setNotes] = useState<NoteWithDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const loadedNotes = await loadNotes();
        setNotes(loadedNotes);
        
        const generatedCategories = generateCategories(loadedNotes);
        setCategories(generatedCategories);
        
        setError(null);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setError('加载数据失败，请确保数据文件存在');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const activeCategory = categories.find(cat => cat.id === activeCategoryId) || categories[0];
  const filteredNotes = activeCategory 
    ? filterNotesByCategory(notes, activeCategory)
    : notes;

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <p>{error}</p>
          <p className="error-hint">
            请确保在 <code>public/notes.json</code> 中有有效的笔记数据
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">📕</span>
            小红书动态分类展示
          </h1>
          <p className="app-subtitle">共 {notes.length} 条动态</p>
        </div>
      </header>

      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategoryId}
          notes={notes}
          onCategoryChange={setActiveCategoryId}
        />
      )}

      <main className="app-main">
        <div className="notes-container">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <p>该分类下暂无动态</p>
            </div>
          ) : (
            <>
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.note_id} note={note} />
                ))}
              </div>
              <div className="notes-footer">
                <p>显示 {filteredNotes.length} / {notes.length} 条动态</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
