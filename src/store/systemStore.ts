import { create } from 'zustand';
import { usePlayerStore } from './playerStore';
import { useCombatStore } from './combatStore';
import { useInventoryStore } from './inventoryStore';
import { useArtifactStore } from './artifactStore';
import { getUpgradeBonus } from '../game/items';

const SAVE_KEY = 'irlemvp_save_data';

interface SystemStore {
  lastTick: number;
  tickRate: number;
  gameLoopActive: boolean;
  startGameLoop: () => void;
  stopGameLoop: () => void;
  tick: () => void;
  saveData: () => void;
  loadData: () => void;
  calculateOfflineProgress: (timeDiff: number) => void;
  performRebirth: () => void;
  recalculatePlayerStats: () => void;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  lastTick: Date.now(),
  tickRate: 1000, // 1 second per tick for auto damage
  gameLoopActive: false,

  startGameLoop: () => {
    if (get().gameLoopActive) return;
    set({ gameLoopActive: true, lastTick: Date.now() });
    get().tick();
  },

  stopGameLoop: () => {
    set({ gameLoopActive: false });
  },

  tick: () => {
    if (!get().gameLoopActive) return;
    const now = Date.now();
    const dt = now - get().lastTick;

    if (dt >= get().tickRate) {
      const ticks = Math.floor(dt / get().tickRate);
      
      const isRespawning = useCombatStore.getState().isRespawning;
      
      if (!isRespawning) {
        // Apply auto damage to enemy
        const autoDps = usePlayerStore.getState().autoDamage;
        if (autoDps > 0) {
          useCombatStore.getState().dealDamage(autoDps * ticks, false);
        }

        // Apply enemy damage to player
        const enemy = useCombatStore.getState().enemy;
        if (enemy && enemy.currentHp > 0) {
          const playerStats = usePlayerStore.getState();
          
          // HP Regeneration
          if (playerStats.currentHp < playerStats.maxHp && playerStats.currentHp > 0) {
            playerStats.heal(playerStats.hpRegen * ticks);
          }

          // Damage calculation with block and defense
          let finalDamage = 0;
          const isBlocked = Math.random() < Math.min(playerStats.blockChance, 0.75); // Cap block at 75%

          if (!isBlocked) {
            finalDamage = Math.max(1, enemy.damage - playerStats.defense);
            playerStats.takeDamage(finalDamage * ticks);
          }
          
          if (usePlayerStore.getState().currentHp <= 0) {
            useCombatStore.getState().setRespawning(true);
            usePlayerStore.getState().applyDeathPenalty();
            useCombatStore.getState().resetStageKills();
            
            setTimeout(() => {
              useCombatStore.getState().setRespawning(false);
              useCombatStore.getState().initializeEnemy();
            }, 3000);
          }
        }
      }

      set({ lastTick: now - (dt % get().tickRate) });
    }

    requestAnimationFrame(get().tick);
  },

  recalculatePlayerStats: () => {
    const { level } = usePlayerStore.getState();
    const { equipped } = useInventoryStore.getState();
    const { getMultiplier } = useArtifactStore.getState();

    let baseDmg = 5 + level * 2;
    let baseHp = 100 + level * 20;
    // Base regen scaling with level
    let baseRegen = 1 + Math.floor(level * 0.5);
    let baseDef = Math.floor(level * 0.5);
    let baseCritChance = 0.05;
    let baseCritDamage = 1.5;
    let baseBlock = 0;

    Object.values(equipped).forEach((item) => {
      if (item && item.stats) {
        if (item.stats.attack) baseDmg += getUpgradeBonus(item.stats.attack, item.upgradeLevel);
        if (item.stats.maxHp) baseHp += getUpgradeBonus(item.stats.maxHp, item.upgradeLevel);
        if (item.stats.defense) baseDef += getUpgradeBonus(item.stats.defense, item.upgradeLevel);
        if (item.stats.hpRegen) baseRegen += getUpgradeBonus(item.stats.hpRegen, item.upgradeLevel);
        if (item.stats.critChance) baseCritChance += (item.stats.critChance * Math.pow(1.05, item.upgradeLevel));
        if (item.stats.critDamage) baseCritDamage += (item.stats.critDamage * Math.pow(1.05, item.upgradeLevel));
        if (item.stats.blockChance) baseBlock += (item.stats.blockChance * Math.pow(1.05, item.upgradeLevel));
      } else if (item && item.baseBonus) { // Fallback for old save logic
        if (item.type === 'Weapon') baseDmg += getUpgradeBonus(item.baseBonus, item.upgradeLevel);
        if (item.type === 'Armor') baseHp += getUpgradeBonus(item.baseBonus, item.upgradeLevel);
        if (item.type === 'Helmet') baseHp += getUpgradeBonus(item.baseBonus, item.upgradeLevel);
      }
    });

    const artifactDmgMult = getMultiplier('dmg_boost');
    
    const finalClickDamage = Math.floor(baseDmg * artifactDmgMult);
    const finalAutoDamage = Math.floor(finalClickDamage * 0.1);
    const maxHp = Math.floor(baseHp);

    usePlayerStore.getState().updateStats({
      clickDamage: finalClickDamage,
      autoDamage: finalAutoDamage,
      maxHp,
      hpRegen: baseRegen,
      defense: baseDef,
      critChance: baseCritChance,
      critDamage: baseCritDamage,
      blockChance: baseBlock
    });
  },

  calculateOfflineProgress: (timeDiffMs: number) => {
    // Basic offline progress: simulate auto damage against current highest level
    // This is a simplified version.
    const seconds = Math.floor(timeDiffMs / 1000);
    if (seconds < 60) return; // Only process if off for more than a minute

    const autoDps = usePlayerStore.getState().autoDamage;
    if (autoDps <= 0) return;

    // Very naive approximation: assume player beats the current level repeatedly.
    // Realistically, we'd simulate the combats or give a reduced % of active play.
    // The highest stage is not strictly needed for this calculation, but good for context
    
    const estimatedDamage = autoDps * seconds;
    const enemyHpApproximation = useCombatStore.getState().enemy?.maxHp || 100;
    
    const kills = Math.floor(estimatedDamage / enemyHpApproximation);
    if (kills > 0) {
        // Average drops
        const avgGold = useCombatStore.getState().enemy?.goldDrop || 10;
        const avgExp = useCombatStore.getState().enemy?.expDrop || 10;
        
        const artGoldMult = useArtifactStore.getState().getMultiplier('gold_boost');
        const artExpMult = useArtifactStore.getState().getMultiplier('exp_boost');

        const totalGold = Math.floor(kills * avgGold * artGoldMult * 0.5); // 50% offline penalty
        const totalExp = Math.floor(kills * avgExp * artExpMult * 0.5);

        usePlayerStore.getState().addGold(totalGold);
        usePlayerStore.getState().addExp(totalExp);
        console.log(`Offline Progress: ${kills} kills. Gold: ${totalGold}, Exp: ${totalExp}`);
    }
  },

  saveData: () => {
    const data = {
      player: usePlayerStore.getState(),
      combat: useCombatStore.getState(),
      inventory: useInventoryStore.getState(),
      artifact: useArtifactStore.getState(),
      system: { lastTick: Date.now() },
    };
    const json = JSON.stringify(data);
    const base64 = btoa(json);
    localStorage.setItem(SAVE_KEY, base64);
  },

  loadData: () => {
    const base64 = localStorage.getItem(SAVE_KEY);
    if (!base64) {
      useCombatStore.getState().initializeEnemy();
      get().recalculatePlayerStats();
      return;
    }

    try {
      const json = atob(base64);
      const data = JSON.parse(json);

      if (data.player) usePlayerStore.getState().loadData(data.player);
      if (data.combat) useCombatStore.getState().loadData(data.combat);
      if (data.inventory) useInventoryStore.getState().loadData(data.inventory);
      if (data.artifact) useArtifactStore.getState().loadData(data.artifact);

      get().recalculatePlayerStats();
      useCombatStore.getState().initializeEnemy(); // Ensure enemy object is properly instanced

      if (data.system && data.system.lastTick) {
        const timeDiff = Date.now() - data.system.lastTick;
        get().calculateOfflineProgress(timeDiff);
      }
    } catch (e) {
      console.error('Failed to load save data', e);
      useCombatStore.getState().initializeEnemy();
      get().recalculatePlayerStats();
    }
  },

  performRebirth: () => {
    const playerLevel = usePlayerStore.getState().level;
    if (playerLevel < 50) return; // Must be at least level 50 to rebirth
    
    // Calculate spirit stones to reward (e.g., 1 per 10 levels above 40)
    const stones = Math.floor((playerLevel - 40) / 10);
    usePlayerStore.getState().addSpiritStones(stones);
    
    usePlayerStore.getState().resetForRebirth();
    useCombatStore.getState().resetForRebirth();
    useInventoryStore.getState().resetForRebirth();
    
    get().recalculatePlayerStats();
    get().saveData();
  }
}));

// Subscribe to player/inventory changes to recalculate stats
usePlayerStore.subscribe((state, prevState) => {
  if (state.level !== prevState.level) {
    useSystemStore.getState().recalculatePlayerStats();
  }
});
useInventoryStore.subscribe((state, prevState) => {
  if (state.equipped !== prevState.equipped) {
    useSystemStore.getState().recalculatePlayerStats();
  }
});
