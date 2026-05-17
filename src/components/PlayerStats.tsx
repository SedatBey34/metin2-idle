import React from 'react';
import { usePlayerStore } from '../store/playerStore';
import { formatNumber } from '../utils/numberFormat';
import { Shield, Sword, Coins, Star } from 'lucide-react';

export const PlayerStats: React.FC = () => {
  const { level, exp, maxExp, gold, spiritStones, clickDamage, autoDamage, currentHp, maxHp } = usePlayerStore();

  const expPercentage = Math.min(100, (exp / maxExp) * 100);
  const hpPercentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  return (
    <div className="panel p-4 flex flex-col gap-4">
      <div className="panel-header text-xl">Hero Status</div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-lg">
          <span className="text-metin-gold font-bold">Level {level}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-yellow-500"><Coins size={16} /> {formatNumber(gold)}</span>
            <span className="flex items-center gap-1 text-cyan-400"><Star size={16} /> {formatNumber(spiritStones)}</span>
          </div>
        </div>

        <div className="w-full bg-metin-dark h-4 rounded overflow-hidden border border-metin-border relative">
          <div 
            className="bg-blue-600 h-full transition-all duration-300" 
            style={{ width: `${expPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
            EXP: {formatNumber(exp)} / {formatNumber(maxExp)}
          </div>
        </div>

        <div className="w-full bg-metin-dark h-4 rounded overflow-hidden border border-metin-border relative mt-1">
          <div 
            className="bg-red-600 h-full transition-all duration-300" 
            style={{ width: `${hpPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">
            HP: {formatNumber(currentHp)} / {formatNumber(maxHp)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-metin-dark/50 p-2 rounded flex items-center gap-2 border border-metin-border">
          <Sword className="text-metin-red" size={20} />
          <div>
            <div className="text-xs text-gray-400">Click Damage</div>
            <div className="font-bold">{formatNumber(clickDamage)}</div>
          </div>
        </div>
        <div className="bg-metin-dark/50 p-2 rounded flex items-center gap-2 border border-metin-border">
          <Shield className="text-metin-gold" size={20} />
          <div>
            <div className="text-xs text-gray-400">Auto DPS</div>
            <div className="font-bold">{formatNumber(autoDamage)}/s</div>
          </div>
        </div>
      </div>
    </div>
  );
};
