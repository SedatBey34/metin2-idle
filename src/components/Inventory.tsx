import React from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import type { Item, ItemType, ItemRarity } from '../types';
import { getUpgradeBonus } from '../game/items';

export const Inventory: React.FC = () => {
  const { items, equipped, equipItem, unequipItem, sellItem } = useInventoryStore();

  const renderItem = (item: Item, isEquipped = false) => {
    const rarityColors: Record<ItemRarity, string> = {
      Common: 'text-gray-300 border-gray-600',
      Uncommon: 'text-green-400 border-green-800',
      Rare: 'text-blue-400 border-blue-800',
      Epic: 'text-purple-400 border-purple-800',
      Legendary: 'text-orange-500 border-orange-600 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]',
      Mythic: 'text-red-500 border-red-700 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]',
      Godlike: 'text-yellow-300 border-yellow-500 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse',
    };

    const bgColors: Record<ItemRarity, string> = {
      Common: 'bg-gray-800/50',
      Uncommon: 'bg-green-900/30',
      Rare: 'bg-blue-900/30',
      Epic: 'bg-purple-900/30',
      Legendary: 'bg-orange-900/30',
      Mythic: 'bg-red-900/30',
      Godlike: 'bg-yellow-900/30',
    };

    return (
      <div key={item.id} className={`p-2 rounded border ${rarityColors[item.rarity]} ${bgColors[item.rarity]} flex flex-col gap-1 text-sm relative group`}>
        <div className="font-bold truncate" title={item.name}>{item.name} {item.upgradeLevel > 0 && `+${item.upgradeLevel}`}</div>
        <div className="text-xs text-gray-400">Lvl {item.level} {item.type}</div>
        <div className="text-metin-gold font-bold">
          {item.type === 'Weapon' ? 'DMG' : 'HP'}: +{getUpgradeBonus(item)}
        </div>
        
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEquipped ? (
            <button onClick={() => unequipItem(item.type)} className="btn-primary text-xs py-1 px-2">Unequip</button>
          ) : (
            <>
              <button onClick={() => equipItem(item.id)} className="btn-primary text-xs py-1 px-2">Equip</button>
              <button onClick={() => sellItem(item.id)} className="btn-primary text-xs py-1 px-2 bg-yellow-700 hover:bg-yellow-600">Sell</button>
            </>
          )}
        </div>
      </div>
    );
  };

  const types: ItemType[] = ['Weapon', 'Armor', 'Helmet'];

  return (
    <div className="panel p-4 flex flex-col gap-4 h-full">
      <div className="panel-header text-xl">Equipment & Inventory</div>
      
      <div className="grid grid-cols-3 gap-2">
        {types.map(type => (
          <div key={type} className="border border-dashed border-gray-600 rounded p-2 min-h-[100px] flex flex-col">
            <div className="text-xs text-center text-gray-500 mb-1">{type}</div>
            {equipped[type] ? renderItem(equipped[type]!, true) : <div className="flex-1 flex items-center justify-center text-gray-700 text-xs">Empty</div>}
          </div>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <h3 className="text-metin-gold mb-2 border-b border-metin-border pb-1">Bag ({items.length}/50)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map(i => renderItem(i))}
        </div>
        {items.length === 0 && <div className="text-center text-gray-500 py-4 text-sm">Inventory is empty. Defeat enemies for a chance to find loot.</div>}
      </div>
    </div>
  );
};
