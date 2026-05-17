import { create } from 'zustand';
import type { Artifact } from '../types';
import { calculateArtifactCost } from '../game/math';
import { usePlayerStore } from './playerStore';

export const ARTIFACT_DEFINITIONS: Omit<Artifact, 'level'>[] = [
  { id: 'dmg_boost', name: 'Sword of War', description: '+10% Base Damage per level', maxLevel: 20, baseCost: 10, costMultiplier: 1.5, effectPerLevel: 0.1 },
  { id: 'gold_boost', name: 'Thief\'s Glove', description: '+5% Gold Drops per level', maxLevel: 50, baseCost: 5, costMultiplier: 1.3, effectPerLevel: 0.05 },
  { id: 'exp_boost', name: 'Wisdom Ring', description: '+5% EXP gain per level', maxLevel: 50, baseCost: 15, costMultiplier: 1.4, effectPerLevel: 0.05 },
];

interface ArtifactStore {
  artifacts: Record<string, number>; // id -> level
  upgradeArtifact: (id: string) => boolean;
  getMultiplier: (id: string) => number;
  loadData: (data: Partial<ArtifactStore>) => void;
}

export const useArtifactStore = create<ArtifactStore>((set, get) => ({
  artifacts: {},

  upgradeArtifact: (id: string) => {
    const def = ARTIFACT_DEFINITIONS.find(a => a.id === id);
    if (!def) return false;

    const currentLevel = get().artifacts[id] || 0;
    if (currentLevel >= def.maxLevel) return false;

    const cost = calculateArtifactCost(def.baseCost, def.costMultiplier, currentLevel);
    const playerStones = usePlayerStore.getState().spiritStones;

    if (playerStones < cost) return false;

    usePlayerStore.getState().addSpiritStones(-cost);
    set((state) => ({
      artifacts: {
        ...state.artifacts,
        [id]: currentLevel + 1
      }
    }));
    return true;
  },

  getMultiplier: (id: string) => {
    const level = get().artifacts[id] || 0;
    const def = ARTIFACT_DEFINITIONS.find(a => a.id === id);
    if (!def) return 1;
    // Base is 1 + (level * effect)
    return 1 + (level * def.effectPerLevel);
  },

  loadData: (data) => set((state) => ({ ...state, ...data })),
}));
