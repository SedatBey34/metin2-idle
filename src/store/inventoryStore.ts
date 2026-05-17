import { create } from 'zustand';
import type { Item, ItemType, ItemRarity } from '../types';
import { generateItemDrop } from '../game/items';
import { calculateUpgradeCost, calculateUpgradeChance } from '../game/math';
import { usePlayerStore } from './playerStore';

interface InventoryStore {
  items: Item[];
  equipped: Record<ItemType, Item | null>;
  rollDrop: (stageLevel: number, rarity: ItemRarity) => void;
  equipItem: (id: string) => void;
  unequipItem: (type: ItemType) => void;
  sellItem: (id: string) => void;
  upgradeItem: (id: string) => { success: boolean; message: string };
  resetForRebirth: () => void;
  loadData: (data: Partial<InventoryStore>) => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  equipped: {
    Weapon: null,
    Armor: null,
    Helmet: null,
  },

  rollDrop: (stageLevel: number, rarity: ItemRarity) => {
    const newItem = generateItemDrop(stageLevel, rarity);
    set((state) => ({ items: [...state.items, newItem] }));
  },

  equipItem: (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    set((state) => {
      const currentEquipped = state.equipped[item.type];
      const newItems = state.items.filter((i) => i.id !== id);
      if (currentEquipped) {
        newItems.push(currentEquipped);
      }
      return {
        items: newItems,
        equipped: { ...state.equipped, [item.type]: item },
      };
    });
  },

  unequipItem: (type: ItemType) => {
    set((state) => {
      const item = state.equipped[type];
      if (!item) return state;
      return {
        items: [...state.items, item],
        equipped: { ...state.equipped, [type]: null },
      };
    });
  },

  sellItem: (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    
    // Sell price calculation based on level and rarity
    const baseValue = item.level * 10;
    const rarityMultiplier = item.rarity === 'Legendary' ? 10 : item.rarity === 'Epic' ? 5 : item.rarity === 'Rare' ? 2 : 1;
    const sellValue = baseValue * rarityMultiplier * (item.upgradeLevel + 1);

    usePlayerStore.getState().addGold(sellValue);
    
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  upgradeItem: (id: string) => {
    const itemIndex = get().items.findIndex((i) => i.id === id);
    const item = get().items[itemIndex];
    if (!item) return { success: false, message: 'Item not found.' };
    
    if (item.upgradeLevel >= 9) {
      return { success: false, message: 'Item is at max level.' };
    }

    const cost = calculateUpgradeCost(item.level, item.upgradeLevel);
    const playerGold = usePlayerStore.getState().gold;

    if (playerGold < cost) {
      return { success: false, message: 'Not enough gold.' };
    }

    usePlayerStore.getState().addGold(-cost);

    const chance = calculateUpgradeChance(item.upgradeLevel);
    const roll = Math.random();

    if (roll <= chance) {
      // Success
      const newItem = { ...item, upgradeLevel: item.upgradeLevel + 1 };
      const newItems = [...get().items];
      newItems[itemIndex] = newItem;
      set({ items: newItems });
      return { success: true, message: `Upgrade successful! ${item.name} is now +${newItem.upgradeLevel}` };
    } else {
      // Failure (item destroyed)
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
      return { success: false, message: `Upgrade failed! ${item.name} was destroyed.` };
    }
  },

  resetForRebirth: () => {
    set({
      items: [],
      equipped: { Weapon: null, Armor: null, Helmet: null },
    });
  },

  loadData: (data) => set((state) => ({ ...state, ...data })),
}));
