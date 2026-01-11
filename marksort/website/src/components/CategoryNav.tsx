import type { Category, UnifiedItem } from '../types';
import './CategoryNav.css';
import { filterItemsByCategory } from '../services/dataService';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  items: UnifiedItem[];
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryNav({ 
  categories, 
  activeCategoryId, 
  items,
  onCategoryChange 
}: CategoryNavProps) {
  const getItemCount = (category: Category): number => {
    if (category.id === 'all') {
      return items.length;
    }
    return filterItemsByCategory(items, category).length;
  };

  return (
    <nav className="category-nav">
      <div className="category-nav-container">
        {categories.map(category => {
          const count = getItemCount(category);
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
