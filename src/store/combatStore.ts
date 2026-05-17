import { create } from 'zustand';
import type { EnemyInfo } from '../types';
import { generateEnemy, getEnemyTier } from '../game/math';
import { usePlayerStore } from './playerStore';
import { useInventoryStore } from './inventoryStore';
import { attemptBossDrop } from '../game/items';

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
    const { currentStage } = get();
    // Aşamaya göre Boss olup olmadığına doğrudan karar veriyoruz
    const bossTier = getEnemyTier(currentStage);

    set({ enemy: generateEnemy(currentStage, bossTier) });
  },

  dealDamage: (amount: number, _isClick: boolean = false) => {
    const { enemy, currentStage, highestStage, killsInStage } = get();
    if (!enemy || get().isRespawning) return;

    let finalAmount = amount;

    // Apply crit
    const playerStats = usePlayerStore.getState();
    const isCrit = Math.random() < playerStats.critChance;
    if (isCrit) {
      finalAmount = Math.floor(amount * playerStats.critDamage);
    }

    const newHp = enemy.currentHp - finalAmount;

    if (newHp <= 0) {
      // Enemy dies
      usePlayerStore.getState().addGold(enemy.goldDrop);
      usePlayerStore.getState().addExp(enemy.expDrop);

      // Şanslı Boss Drop Kontrolü
      const rarity = attemptBossDrop(enemy.bossTier);
      if (rarity) {
        useInventoryStore.getState().rollDrop(currentStage, rarity);
      }

      // Boss aşamasındaysak 1, normal aşamadaysak 10 kill gerekiyor
      const requiredKills = enemy.bossTier !== 'None' ? 1 : 10;
      let nextKills = killsInStage + 1;
      let nextStage = currentStage;
      let nextHighest = highestStage;

      if (enemy.isBoss) {
        // Heal player for 25% of max HP on boss kill
        const maxHp = usePlayerStore.getState().maxHp;
        usePlayerStore.getState().heal(Math.floor(maxHp * 0.25));
      }

      // Gerekli öldürme sayısına ulaşıldıysa stage atla
      if (nextKills >= requiredKills) {
        if (currentStage === highestStage) {
          nextHighest = currentStage + 1;
        }
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