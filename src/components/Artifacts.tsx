import React from 'react';
import { useArtifactStore, ARTIFACT_DEFINITIONS } from '../store/artifactStore';
import { usePlayerStore } from '../store/playerStore';
import { calculateArtifactCost } from '../game/math';
import { formatNumber } from '../utils/numberFormat';
import { Sparkles } from 'lucide-react';

export const Artifacts: React.FC = () => {
  const { artifacts, upgradeArtifact } = useArtifactStore();
  const { spiritStones } = usePlayerStore();

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header text-xl flex items-center justify-center gap-2">
        <Sparkles className="text-cyan-400" /> Artifacts
      </div>
      
      <div className="text-sm text-gray-400 text-center mb-2">
        Permanent upgrades that persist through rebirth.
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2">
        {ARTIFACT_DEFINITIONS.map(def => {
          const currentLevel = artifacts[def.id] || 0;
          const cost = calculateArtifactCost(def.baseCost, def.costMultiplier, currentLevel);
          const isMax = currentLevel >= def.maxLevel;
          const canAfford = spiritStones >= cost;

          return (
            <div key={def.id} className="bg-metin-dark/50 border border-metin-border rounded p-3 flex flex-col gap-2 relative">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-metin-gold">{def.name}</div>
                  <div className="text-xs text-gray-400">{def.description}</div>
                </div>
                <div className="text-xs bg-gray-800 px-2 py-1 rounded">Lvl {currentLevel}/{def.maxLevel}</div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-sm text-cyan-400">
                  {isMax ? 'MAX LEVEL' : `Cost: ${formatNumber(cost)} Stones`}
                </div>
                <button 
                  className="btn-primary text-xs py-1 px-3"
                  disabled={isMax || !canAfford}
                  onClick={() => upgradeArtifact(def.id)}
                >
                  Upgrade
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
