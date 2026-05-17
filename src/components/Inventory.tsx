import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import type { ItemType } from '../types';
import { InventorySlot } from './InventorySlot';
import { InventoryFilter, type FilterCategory } from './InventoryFilter';

export const Inventory: React.FC = () => {
  const { items, equipped } = useInventoryStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Tümü');

  const types: ItemType[] = ['Weapon', 'Armor', 'Helmet', 'Shield', 'Bracelet', 'Accessory'];

  // Filter Logic
  const getFilteredItems = () => {
    switch (activeFilter) {
      case 'Silahlar':
        return items.filter(item => item.type === 'Weapon');
      case 'Zırhlar':
        return items.filter(item => item.type === 'Armor' || item.type === 'Helmet');
      case 'Kalkanlar':
        return items.filter(item => item.type === 'Shield');
      case 'Takılar':
        return items.filter(item => item.type === 'Bracelet' || item.type === 'Accessory');
      case 'Tümü':
      default:
        return items;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="panel p-4 flex flex-col gap-4 h-full min-h-0">
      <div className="panel-header text-xl shrink-0">Equipment & Inventory</div>

      <div className="grid grid-cols-3 gap-2 shrink-0">
        {types.map(type => (
          <div key={type} className="border border-dashed border-gray-600 rounded p-2 min-h-[100px] flex flex-col">
            <div className="text-xs text-center text-gray-500 mb-1">{type}</div>
            {equipped[type] ? <InventorySlot item={equipped[type]!} isEquipped={true} /> : <div className="flex-1 flex items-center justify-center text-gray-700 text-xs">Empty</div>}
          </div>
        ))}
      </div>

      <InventoryFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <h3 className="text-metin-gold mb-2 border-b border-metin-border pb-1">Bag ({items.length}/50)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredItems.map(item => (
            <InventorySlot key={item.id} item={item} />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 py-4 text-sm">
            {items.length === 0 ? 'Inventory is empty. Defeat enemies for a chance to find loot.' : 'No items match the selected filter.'}
          </div>
        )}
      </div>
    </div>
  );
};
