import { create } from 'zustand';
import { calculateNextLevelExp } from '../game/math';
import type { PlayerStats } from '../types';

interface PlayerStore extends PlayerStats {
  addGold: (amount: number) => void;
  addExp: (amount: number) => void;
  addSpiritStones: (amount: number) => void;
  updateStats: (stats: {
    clickDamage: number;
    autoDamage: number;
    maxHp: number;
    hpRegen: number;
    defense: number;
    critChance: number;
    critDamage: number;
    blockChance: number;
  }) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  applyDeathPenalty: () => void;
  resetForRebirth: () => void;
  loadData: (data: Partial<PlayerStats>) => void;
}

const initialState: PlayerStats = {
  level: 1,
  exp: 0,
  maxExp: calculateNextLevelExp(1),
  gold: 0,
  spiritStones: 0,
  baseDamage: 1,
  clickDamage: 1,
  autoDamage: 0,
  maxHp: 100,
  currentHp: 100,
  hpRegen: 1,
  defense: 0,
  critChance: 0.05,
  critDamage: 1.5,
  blockChance: 0,
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  ...initialState,
  
  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
  
  addExp: (amount) => {
    set((state) => {
      let newExp = state.exp + amount;
      let newLevel = state.level;
      let newMaxExp = state.maxExp;
      
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = calculateNextLevelExp(newLevel);
      }
      let hpUpdate = {};
      if (newLevel > state.level) {
        hpUpdate = { currentHp: state.maxHp };
      }
      
      return { exp: newExp, level: newLevel, maxExp: newMaxExp, ...hpUpdate };
    });
  },
  
  addSpiritStones: (amount) => set((state) => ({ spiritStones: state.spiritStones + amount })),
  
  updateStats: (stats) => set((state) => {
    const hpRatio = state.currentHp / state.maxHp;
    const newCurrentHp = state.currentHp === 0 ? 0 : Math.max(1, Math.floor(stats.maxHp * hpRatio));
    return { ...stats, currentHp: newCurrentHp };
  }),

  takeDamage: (amount) => set((state) => ({
    currentHp: Math.max(0, state.currentHp - amount)
  })),

  heal: (amount) => set((state) => ({
    currentHp: Math.min(state.maxHp, state.currentHp + amount)
  })),

  applyDeathPenalty: () => set((state) => {
    const expPenalty = Math.floor(state.exp * 0.1);
    const goldPenalty = Math.floor(state.gold * 0.1);
    return {
      exp: Math.max(0, state.exp - expPenalty),
      gold: Math.max(0, state.gold - goldPenalty),
      currentHp: state.maxHp
    };
  }),
  
  resetForRebirth: () => set((state) => ({
    ...initialState,
    spiritStones: state.spiritStones, // Keep spirit stones
    level: 1,
    exp: 0,
    gold: 0,
    maxExp: calculateNextLevelExp(1),
  })),

  loadData: (data) => set((state) => ({ ...state, ...data })),
}));
