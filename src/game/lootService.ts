import type { ItemRarity, BossTier } from '../types';

export const RARITY_MULTIPLIERS: Record<ItemRarity, number> = {
  Common: 1.0,
  Uncommon: 1.2,
  Rare: 1.5,
  Epic: 3.0,
  Legendary: 5.0,
  Mythic: 10.0,
  Godlike: 25.0,
};

export const rollLootRarity = (isBoss: boolean, bossTier: BossTier): ItemRarity | null => {
  const rand = Math.random();

  if (!isBoss) {
    // Normal Enemies ONLY drop Common, Uncommon, and Rare.
    if (rand < 0.05) return 'Rare';
    if (rand < 0.20) return 'Uncommon';
    if (rand < 0.50) return 'Common';
    return null;
  } else {
    // Bosses drop Rare, Epic, Legendary, Mythic, and Godlike.
    let mythicChance = 0.005;
    let godlikeChance = 0.001;
    let legChance = 0.05;
    let epicChance = 0.20;

    if (bossTier === 'Major') {
      mythicChance = 0.02;
      godlikeChance = 0.005;
      legChance = 0.10;
    } else if (bossTier === 'Medium') {
      mythicChance = 0.01;
      godlikeChance = 0.002;
    }

    if (rand < godlikeChance) return 'Godlike';
    if (rand < mythicChance) return 'Mythic';
    if (rand < legChance) return 'Legendary';
    if (rand < epicChance) return 'Epic';
    // Very high base chance to at least drop a Rare for Bosses
    if (rand < 0.80) return 'Rare';
    return null;
  }
};
