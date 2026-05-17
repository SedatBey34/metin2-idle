import type { Item, ItemRarity, ItemType } from '../types';
import { RARITY_MULTIPLIERS } from './lootService';

const WEAPON_NAMES = ['Sword', 'Blade', 'Glaive', 'Dagger', 'Bow'];
const ARMOR_NAMES = ['Plate Armor', 'Suit', 'Vest', 'Robes'];
const HELMET_NAMES = ['Helmet', 'Hood', 'Cap', 'Sallet'];
const SHIELD_NAMES = ['Kite Shield', 'Buckler', 'Tower Shield', 'Pentagon Shield'];
const BRACELET_NAMES = ['Silver Bracelet', 'Gold Bracelet', 'Crystal Bracelet'];
const ACCESSORY_NAMES = ['Necklace', 'Earrings', 'Ring', 'Pendant'];

export const generateItemDrop = (stageLevel: number, rarity: ItemRarity): Item => {
  const typeRoll = Math.random();
  let type: ItemType = 'Weapon';
  let nameStr = WEAPON_NAMES[Math.floor(Math.random() * WEAPON_NAMES.length)];
  
  if (typeRoll > 0.83) {
    type = 'Armor';
    nameStr = ARMOR_NAMES[Math.floor(Math.random() * ARMOR_NAMES.length)];
  } else if (typeRoll > 0.66) {
    type = 'Helmet';
    nameStr = HELMET_NAMES[Math.floor(Math.random() * HELMET_NAMES.length)];
  } else if (typeRoll > 0.50) {
    type = 'Shield';
    nameStr = SHIELD_NAMES[Math.floor(Math.random() * SHIELD_NAMES.length)];
  } else if (typeRoll > 0.33) {
    type = 'Bracelet';
    nameStr = BRACELET_NAMES[Math.floor(Math.random() * BRACELET_NAMES.length)];
  } else if (typeRoll > 0.16) {
    type = 'Accessory';
    nameStr = ACCESSORY_NAMES[Math.floor(Math.random() * ACCESSORY_NAMES.length)];
  }

  const multiplier = RARITY_MULTIPLIERS[rarity] || 1;

  let baseBonus = 0;
  const stats: NonNullable<Item['stats']> = {};

  if (type === 'Weapon') {
    baseBonus = Math.floor((10 + stageLevel * 2) * multiplier);
    stats.attack = baseBonus;
    stats.critChance = 0.01 + (stageLevel * 0.001) * multiplier; // 1% + level
  } else if (type === 'Armor') {
    baseBonus = Math.floor((50 + stageLevel * 10) * multiplier);
    stats.maxHp = baseBonus;
    stats.defense = Math.floor((5 + stageLevel * 1) * multiplier);
  } else if (type === 'Helmet') {
    baseBonus = Math.floor((20 + stageLevel * 5) * multiplier);
    stats.maxHp = baseBonus;
    stats.defense = Math.floor((2 + stageLevel * 0.5) * multiplier);
  } else if (type === 'Shield') {
    baseBonus = Math.floor((10 + stageLevel * 2) * multiplier);
    stats.defense = baseBonus;
    stats.blockChance = 0.02 + (stageLevel * 0.002) * multiplier; // 2% + level
  } else if (type === 'Bracelet') {
    baseBonus = Math.floor((5 + stageLevel * 1) * multiplier);
    stats.defense = baseBonus;
    stats.blockChance = 0.01 + (stageLevel * 0.001) * multiplier;
  } else if (type === 'Accessory') {
    baseBonus = Math.floor((1 + stageLevel * 0.5) * multiplier);
    stats.hpRegen = baseBonus;
    stats.critDamage = 0.05 + (stageLevel * 0.005) * multiplier; // 5% + level
  }

  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: `${rarity} ${nameStr}`,
    type,
    rarity,
    level: stageLevel,
    upgradeLevel: 0,
    baseBonus,
    stats,
  };
};

export const getUpgradeBonus = (baseValue: number, upgradeLevel: number): number => {
  if (baseValue === undefined) return 0;
  return Number((baseValue * Math.pow(1.15, upgradeLevel)).toFixed(3));
};
