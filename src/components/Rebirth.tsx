import React, { useState } from 'react';
import { useSystemStore } from '../store/systemStore';
import { usePlayerStore } from '../store/playerStore';
import { RotateCcw } from 'lucide-react';

export const Rebirth: React.FC = () => {
  const { performRebirth } = useSystemStore();
  const { level } = usePlayerStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const canRebirth = level >= 50;
  const stonesEarned = canRebirth ? Math.floor((level - 40) / 10) : 0;

  const handleRebirth = () => {
    performRebirth();
    setShowConfirm(false);
  };

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header text-xl flex items-center justify-center gap-2">
        <RotateCcw className="text-purple-400" /> Rebirth
      </div>
      
      <div className="text-sm text-gray-400 text-center">
        Reset your level, gold, and equipment to earn Spirit Stones.
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-4">
        {showConfirm ? (
          <div className="text-center w-full">
            <p className="text-red-400 mb-4 text-sm font-bold">Are you sure? This will reset all your progress!</p>
            <div className="flex gap-2 justify-center">
              <button className="btn-primary flex-1 bg-gray-600 hover:bg-gray-500" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleRebirth}>Confirm</button>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <div className="mb-4">
              <div className="text-lg mb-1">Current Level: <span className={canRebirth ? 'text-green-400' : 'text-red-400'}>{level}</span>/50</div>
              <div className="text-cyan-400 font-bold">Reward: +{stonesEarned} Spirit Stones</div>
            </div>
            
            <button 
              className="btn-primary w-full py-3 text-lg"
              disabled={!canRebirth}
              onClick={() => setShowConfirm(true)}
            >
              Perform Rebirth
            </button>
            {!canRebirth && <div className="text-xs text-red-500 mt-2">Requires Level 50</div>}
          </div>
        )}
      </div>
    </div>
  );
};
