import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { usePlayerStore } from '../store/playerStore';
import { calculateUpgradeCost, calculateUpgradeChance } from '../game/math';
import { formatNumber } from '../utils/numberFormat';
import { Hammer } from 'lucide-react';

export const Blacksmith: React.FC = () => {
  const { items, upgradeItem } = useInventoryStore();
  const { gold } = usePlayerStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<{success: boolean, text: string} | null>(null);

  const selectedItem = items.find(i => i.id === selectedId);

  const handleUpgrade = () => {
    if (!selectedId) return;
    const result = upgradeItem(selectedId);
    setResultMsg({ success: result.success, text: result.message });
    if (!result.success && result.message.includes('destroyed')) {
      setSelectedId(null);
    }
  };

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header text-xl flex items-center justify-center gap-2">
        <Hammer className="text-metin-gold" /> Blacksmith
      </div>
      
      {resultMsg && (
        <div className={`p-2 text-center text-sm rounded border ${resultMsg.success ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-red-900/30 border-red-700 text-red-400'}`}>
          {resultMsg.text}
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1">
        <label className="text-sm text-gray-400">Select an item from your bag to upgrade:</label>
        <select 
          className="bg-metin-dark border border-metin-border rounded p-2 text-white outline-none focus:border-metin-gold"
          value={selectedId || ''}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setResultMsg(null);
          }}
        >
          <option value="">-- Select Item --</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} {item.upgradeLevel > 0 ? `+${item.upgradeLevel}` : ''} (Lvl {item.level})
            </option>
          ))}
        </select>

        {selectedItem && (
          <div className="mt-4 bg-metin-dark/50 border border-metin-border rounded p-4 text-center">
            <h4 className="text-lg font-bold text-metin-gold mb-2">{selectedItem.name} +{selectedItem.upgradeLevel}</h4>
            
            {selectedItem.upgradeLevel < 9 ? (
              <>
                <div className="flex justify-between text-sm mb-1">
                  <span>Success Chance:</span>
                  <span className={`${calculateUpgradeChance(selectedItem.upgradeLevel) < 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                    {Math.round(calculateUpgradeChance(selectedItem.upgradeLevel) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>Upgrade Cost:</span>
                  <span className={`${gold < calculateUpgradeCost(selectedItem.level, selectedItem.upgradeLevel) ? 'text-red-400' : 'text-metin-gold'}`}>
                    {formatNumber(calculateUpgradeCost(selectedItem.level, selectedItem.upgradeLevel))} Gold
                  </span>
                </div>
                <button 
                  className="btn-primary w-full"
                  onClick={handleUpgrade}
                  disabled={gold < calculateUpgradeCost(selectedItem.level, selectedItem.upgradeLevel)}
                >
                  Attempt Upgrade
                </button>
                <div className="text-xs text-red-500 mt-2">Warning: Item will be destroyed on failure!</div>
              </>
            ) : (
              <div className="text-metin-gold">Item is at max level!</div>
            )}
          </div>
        )}
        
        {!selectedItem && (
          <div className="text-center text-gray-500 mt-4 text-sm">
            Only items in your bag can be upgraded. Unequip items first.
          </div>
        )}
      </div>
    </div>
  );
};
