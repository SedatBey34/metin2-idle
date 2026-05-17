import React from 'react';

export type FilterCategory = 'Tümü' | 'Silahlar' | 'Zırhlar' | 'Kalkanlar' | 'Takılar';

interface InventoryFilterProps {
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
}

export const InventoryFilter: React.FC<InventoryFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters: FilterCategory[] = ['Tümü', 'Silahlar', 'Zırhlar', 'Kalkanlar', 'Takılar'];

  return (
    <div className="flex border-b border-metin-border bg-metin-dark/50 text-xs shrink-0 mt-2">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex-1 py-2 font-cinzel transition-colors ${
            activeFilter === filter 
              ? 'text-metin-gold border-b-2 border-metin-gold bg-metin-panel' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
