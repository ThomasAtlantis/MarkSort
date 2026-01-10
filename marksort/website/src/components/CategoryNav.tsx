import type { Category, NoteWithDetail } from '../types';
import './CategoryNav.css';
import { filterNotesByCategory } from '../services/dataService';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  notes: NoteWithDetail[];
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryNav({ 
  categories, 
  activeCategoryId, 
  notes,
  onCategoryChange 
}: CategoryNavProps) {
  const getNoteCount = (category: Category): number => {
    if (category.id === 'all') {
      return notes.length;
    }
    return filterNotesByCategory(notes, category).length;
  };

  return (
    <nav className="category-nav">
      <div className="category-nav-container">
        {categories.map(category => {
          const count = getNoteCount(category);
          return (
            <button
              key={category.id}
              className={`category-button ${activeCategoryId === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
              {count > 0 && (
                <span className="category-count">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
