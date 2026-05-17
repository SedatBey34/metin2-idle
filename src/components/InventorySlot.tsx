import React from 'react';
import { getUpgradeBonus } from '../game/items';
import { useInventoryStore } from '../store/inventoryStore';
import type { Item } from '../types';

interface InventorySlotProps {
  item: Item;
  isEquipped?: boolean;
}

export const InventorySlot: React.FC<InventorySlotProps> = ({ item, isEquipped = false }) => {
  const { equipItem, unequipItem, sellItem } = useInventoryStore();

  const rarityColors: Record<Item['rarity'], string> = {
    Common: 'text-gray-300 border-gray-600',
    Uncommon: 'text-green-400 border-green-800',
    Rare: 'text-blue-400 border-blue-800',
    Epic: 'text-purple-400 border-purple-800',
    Legendary: 'text-orange-500 border-orange-600 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]',
    Mythic: 'text-red-500 border-red-700 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]',
    Godlike: 'text-yellow-300 border-yellow-500 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse',
  };

  const bgColors: Record<Item['rarity'], string> = {
    Common: 'bg-gray-800/50',
    Uncommon: 'bg-green-900/30',
    Rare: 'bg-blue-900/30',
    Epic: 'bg-purple-900/30',
    Legendary: 'bg-orange-900/30',
    Mythic: 'bg-red-900/30',
    Godlike: 'bg-yellow-900/30',
  };

  return (
    <div className={`p-2 rounded border ${rarityColors[item.rarity]} ${bgColors[item.rarity]} flex flex-col gap-1 text-sm relative group w-full h-full min-h-[90px]`}>
      <div className="font-bold truncate" title={item.name}>{item.name} {item.upgradeLevel > 0 && `+${item.upgradeLevel}`}</div>
      <div className="text-xs text-gray-400">Lvl {item.level} {item.type}</div>
      <div className="text-metin-gold font-bold flex flex-col text-[11px] leading-tight mt-1 flex-1">
        {item.stats?.attack ? <div>ATK: +{getUpgradeBonus(item.stats.attack, item.upgradeLevel)}</div> : null}
        {item.stats?.maxHp ? <div>HP: +{getUpgradeBonus(item.stats.maxHp, item.upgradeLevel)}</div> : null}
        {item.stats?.defense ? <div>DEF: +{getUpgradeBonus(item.stats.defense, item.upgradeLevel)}</div> : null}
        {item.stats?.hpRegen ? <div>Regen: +{getUpgradeBonus(item.stats.hpRegen, item.upgradeLevel)}/s</div> : null}
        {item.stats?.critChance ? <div>Crit: +{(item.stats.critChance * Math.pow(1.05, item.upgradeLevel) * 100).toFixed(1)}%</div> : null}
        {item.stats?.critDamage ? <div>Crit Dmg: +{((item.stats.critDamage * Math.pow(1.05, item.upgradeLevel)) * 100).toFixed(0)}%</div> : null}
        {item.stats?.blockChance ? <div>Block: +{(item.stats.blockChance * Math.pow(1.05, item.upgradeLevel) * 100).toFixed(1)}%</div> : null}
        {!item.stats && item.baseBonus ? <div>Stat: +{getUpgradeBonus(item.baseBonus, item.upgradeLevel)}</div> : null}
      </div>

      <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded">
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
