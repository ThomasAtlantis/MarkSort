import { useState, useEffect } from 'react';
import type { UnifiedItem, Category } from './types';
import {
  loadUnifiedItems,
  generateCategories,
  filterItemsByCategory
} from './services/dataService';
import CategoryNav from './components/CategoryNav';
import NoteCard from './components/NoteCard';
import './App.css';

function App() {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const loadedItems = await loadUnifiedItems();
        setItems(loadedItems);

        const generatedCategories = generateCategories(loadedItems);
        setCategories(generatedCategories);

        setError(null);
      } catch (err) {
        console.error('Failed to load items:', err);
        setError('加载数据失败，请确保数据文件存在');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const activeCategory = categories.find(cat => cat.id === activeCategoryId) || categories[0];
  const filteredItems = activeCategory
    ? filterItemsByCategory(items, activeCategory)
    : items;

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
            请确保在 <code>public/</code> 目录中有有效的数据文件（rednote.json, bilibili.json等）
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
            <span className="title-icon">🏛️</span>
            MarkSort
          </h1>
          <p className="app-subtitle">共 {items.length} 条内容</p>
        </div>
      </header>

      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategoryId}
          items={items}
          onCategoryChange={setActiveCategoryId}
        />
      )}

      <main className="app-main">
        <div className="notes-container">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>该分类下暂无内容</p>
            </div>
          ) : (
            <>
              <div className="notes-grid">
                {filteredItems.map((item) => (
                  <NoteCard key={`${item.platform}-${item.id}`} item={item} />
                ))}
              </div>
              <div className="notes-footer">
                <p>显示 {filteredItems.length} / {items.length} 条内容</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
