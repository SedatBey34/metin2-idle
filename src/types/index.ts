export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  spiritStones: number;
  baseDamage: number;
  clickDamage: number;
  autoDamage: number;
  maxHp: number;
  currentHp: number;
}

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Godlike';
export type ItemType = 'Weapon' | 'Armor' | 'Helmet';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  upgradeLevel: number; // +0 to +9
  baseBonus: number; // e.g., damage for weapon, hp for armor
}

export type BossTier = 'None' | 'Normal' | 'Mini' | 'Medium' | 'Major';

export interface EnemyInfo {
  id: string;
  name: string;
  level: number;
  isBoss: boolean;
  bossTier: BossTier;
  maxHp: number;
  currentHp: number;
  damage: number;
  goldDrop: number;
  expDrop: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  costMultiplier: number;
  baseCost: number;
  effectPerLevel: number;
}
