import { create } from 'zustand';
import type { EnemyInfo, BossTier } from '../types';
import { generateEnemy } from '../game/math';
import { usePlayerStore } from './playerStore';
import { useInventoryStore } from './inventoryStore';
import { rollLootRarity } from '../game/lootService';

interface CombatStore {
  currentStage: number;
  highestStage: number;
  killsInStage: number;
  isRespawning: boolean;
  enemy: EnemyInfo | null;
  initializeEnemy: () => void;
  dealDamage: (amount: number, isClick?: boolean) => void;
  nextStage: () => void;
  previousStage: () => void;
  resetForRebirth: () => void;
  setRespawning: (val: boolean) => void;
  resetStageKills: () => void;
  loadData: (data: Partial<CombatStore>) => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  currentStage: 1,
  highestStage: 1,
  killsInStage: 0,
  isRespawning: false,
  enemy: null,

  initializeEnemy: () => {
    const { currentStage, killsInStage } = get();
    let bossTier: BossTier = 'None';
    
    // 10th enemy is a boss
    if (killsInStage === 9) {
      if (currentStage % 50 === 0) bossTier = 'Major';
      else if (currentStage % 25 === 0) bossTier = 'Medium';
      else if (currentStage % 10 === 0) bossTier = 'Mini';
      else bossTier = 'Normal';
    }
    
    set({ enemy: generateEnemy(currentStage, bossTier) });
  },

  dealDamage: (amount: number) => {
    const { enemy, currentStage, highestStage, killsInStage } = get();
    if (!enemy || get().isRespawning) return;

    const newHp = enemy.currentHp - amount;
    
    if (newHp <= 0) {
      // Enemy dies
      usePlayerStore.getState().addGold(enemy.goldDrop);
      usePlayerStore.getState().addExp(enemy.expDrop);
      
      // Check for item drop
      const rarity = rollLootRarity(enemy.isBoss, enemy.bossTier);
      if (rarity) {
         useInventoryStore.getState().rollDrop(currentStage, rarity);
      }

      let nextKills = killsInStage + 1;
      let nextStage = currentStage;
      let nextHighest = highestStage;

      if (enemy.isBoss) {
        // Boss defeated! Advance to next stage if we're on highest
        if (currentStage === highestStage) {
          nextHighest = currentStage + 1;
        }
        // Auto progress to next stage
        nextStage = currentStage + 1;
        nextKills = 0;
      }

      set({ 
        currentStage: nextStage, 
        killsInStage: nextKills, 
        highestStage: nextHighest 
      });
      
      get().initializeEnemy();
    } else {
      set({ enemy: { ...enemy, currentHp: newHp } });
    }
  },

  nextStage: () => {
    const { currentStage, highestStage } = get();
    if (currentStage < highestStage) {
      set({ currentStage: currentStage + 1, killsInStage: 0 });
      get().initializeEnemy();
    }
  },

  previousStage: () => {
    const { currentStage } = get();
    if (currentStage > 1) {
      set({ currentStage: currentStage - 1, killsInStage: 0 });
      get().initializeEnemy();
    }
  },

  resetForRebirth: () => {
    set({ currentStage: 1, highestStage: 1, killsInStage: 0 });
    get().initializeEnemy();
  },

  setRespawning: (val) => set({ isRespawning: val }),
  resetStageKills: () => set({ killsInStage: 0 }),

  loadData: (data) => set((state) => ({ ...state, ...data })),
}));
