import type { EnemyInfo, BossTier } from '../types';

export const calculateEnemyHp = (level: number, bossTier: BossTier): number => {
  const base = 10;
  let multiplier = 1;
  if (bossTier === 'Mini') multiplier = 5;
  if (bossTier === 'Medium') multiplier = 15;
  if (bossTier === 'Major') multiplier = 50;
  // Exponential scaling for HP
  return Math.floor(base * Math.pow(1.15, level - 1) * multiplier);
};

export const calculateEnemyDamage = (level: number, bossTier: BossTier): number => {
  const base = 2; // base damage
  let multiplier = 1;
  if (bossTier === 'Mini') multiplier = 3;
  if (bossTier === 'Medium') multiplier = 8;
  if (bossTier === 'Major') multiplier = 20;
  return Math.floor(base * Math.pow(1.1, level - 1) * multiplier);
};

export const calculateEnemyGold = (level: number, bossTier: BossTier): number => {
  const base = 2;
  const multiplier = bossTier !== 'None' ? 10 : 1;
  return Math.floor(base * Math.pow(1.1, level - 1) * multiplier);
};

export const calculateEnemyExp = (level: number, bossTier: BossTier): number => {
  const base = 5;
  const multiplier = bossTier !== 'None' ? 10 : 1;
  return Math.floor(base * Math.pow(1.08, level - 1) * multiplier);
};

export const calculateNextLevelExp = (currentLevel: number): number => {
  const base = 50;
  return Math.floor(base * Math.pow(1.2, currentLevel - 1));
};

export const calculateUpgradeCost = (itemLevel: number, upgradeLevel: number): number => {
  const base = 100;
  return Math.floor(base * Math.pow(1.5, itemLevel) * Math.pow(2, upgradeLevel));
};

export const calculateUpgradeChance = (upgradeLevel: number): number => {
  // +0 -> +1: 100%, +8 -> +9: 20%
  const chances = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
  return chances[upgradeLevel] || 0;
};

export const generateEnemy = (level: number, bossTier: BossTier = 'None'): EnemyInfo => {
  const isBoss = bossTier !== 'None';
  const hp = calculateEnemyHp(level, bossTier);
  const dmg = calculateEnemyDamage(level, bossTier);
  return {
    id: `enemy_${level}_${Date.now()}`,
    name: isBoss ? `${bossTier !== 'Normal' ? bossTier + ' ' : ''}Boss Lvl ${level}` : `Wild Dog Lvl ${level}`,
    level,
    isBoss,
    bossTier,
    maxHp: hp,
    currentHp: hp,
    damage: dmg,
    goldDrop: calculateEnemyGold(level, bossTier),
    expDrop: calculateEnemyExp(level, bossTier),
  };
};

export const calculateArtifactCost = (baseCost: number, multiplier: number, currentLevel: number): number => {
  return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
}
