import type { Item, ItemRarity, ItemType } from '../types';
import { RARITY_MULTIPLIERS } from './lootService';

const WEAPON_NAMES = ['Sword', 'Blade', 'Glaive', 'Dagger', 'Bow'];
const ARMOR_NAMES = ['Plate Armor', 'Suit', 'Vest', 'Robes'];
const HELMET_NAMES = ['Helmet', 'Hood', 'Cap', 'Sallet'];

export const generateItemDrop = (stageLevel: number, rarity: ItemRarity): Item => {
  const typeRoll = Math.random();
  let type: ItemType = 'Weapon';
  let nameStr = WEAPON_NAMES[Math.floor(Math.random() * WEAPON_NAMES.length)];
  
  if (typeRoll > 0.66) {
    type = 'Armor';
    nameStr = ARMOR_NAMES[Math.floor(Math.random() * ARMOR_NAMES.length)];
  } else if (typeRoll > 0.33) {
    type = 'Helmet';
    nameStr = HELMET_NAMES[Math.floor(Math.random() * HELMET_NAMES.length)];
  }

  const multiplier = RARITY_MULTIPLIERS[rarity] || 1;

  let baseBonus = 0;
  if (type === 'Weapon') {
    baseBonus = Math.floor((10 + stageLevel * 2) * multiplier);
  } else if (type === 'Armor') {
    baseBonus = Math.floor((50 + stageLevel * 10) * multiplier);
  } else if (type === 'Helmet') {
    baseBonus = Math.floor((20 + stageLevel * 5) * multiplier);
  }

  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: `${rarity} ${nameStr}`,
    type,
    rarity,
    level: stageLevel,
    upgradeLevel: 0,
    baseBonus,
  };
};

export const getUpgradeBonus = (item: Item): number => {
  // Upgrade level increases stats by +10% per level exponentially, or linear? Metin2 scaling is exponential at higher levels.
  return Math.floor(item.baseBonus * Math.pow(1.15, item.upgradeLevel));
};
