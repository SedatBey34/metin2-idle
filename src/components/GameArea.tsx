import React, { useEffect } from 'react';
import { useCombatStore } from '../store/combatStore';
import { usePlayerStore } from '../store/playerStore';
import { formatNumber } from '../utils/numberFormat';
import { Skull, ChevronLeft, ChevronRight } from 'lucide-react';

export const GameArea: React.FC = () => {
  const { currentStage, highestStage, killsInStage, isRespawning, enemy, dealDamage, nextStage, previousStage } = useCombatStore();
  const { clickDamage } = usePlayerStore();

  useEffect(() => {
    // Initializing enemy if not set
    if (!enemy) {
      useCombatStore.getState().initializeEnemy();
    }
  }, [enemy]);

  if (!enemy) return <div className="panel p-10 flex justify-center"><div className="animate-spin"><Skull /></div></div>;

  if (isRespawning) {
    return (
      <div className="panel flex flex-col h-full min-h-[400px] items-center justify-center bg-red-900/20">
        <Skull size={64} className="text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl text-red-500 font-bold mb-2">You Died!</h2>
        <p className="text-gray-300">Penalty applied. Respawning...</p>
      </div>
    );
  }

  const hpPercentage = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    dealDamage(clickDamage);
    
    // Add visual click effect here if desired (e.g., floating text)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const floater = document.createElement('div');
    floater.className = 'absolute text-metin-red font-bold text-xl pointer-events-none animate-ping drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]';
    floater.style.left = `${x}px`;
    floater.style.top = `${y}px`;
    floater.innerText = `-${formatNumber(clickDamage)}`;
    e.currentTarget.appendChild(floater);
    
    setTimeout(() => {
      if (floater.parentNode) {
        floater.parentNode.removeChild(floater);
      }
    }, 500);
  };

  return (
    <div className="panel flex flex-col h-full min-h-[400px]">
      <div className="panel-header flex justify-between items-center">
        <button 
          onClick={previousStage} 
          disabled={currentStage <= 1}
          className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">Stage {currentStage} {enemy.isBoss && <span className="text-metin-red">(BOSS)</span>}</span>
          <span className="text-xs text-gray-400">Kills: {killsInStage} / 10</span>
        </div>
        <button 
          onClick={nextStage} 
          disabled={currentStage >= highestStage}
          className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-metin-dark/80 via-black to-black">
        
        {/* Enemy Entity */}
        <div 
          className={`relative cursor-pointer select-none transition-transform active:scale-95 hover:scale-105 duration-100 p-8 rounded-full ${enemy.isBoss ? 'bg-metin-red/10 border-metin-red/30' : 'bg-gray-800/20 border-gray-700'} border-2`}
          onClick={handleClick}
        >
          <Skull size={100} className={`${enemy.isBoss ? 'text-metin-red drop-shadow-[0_0_25px_rgba(139,0,0,0.8)]' : 'text-gray-400 drop-shadow-[0_0_15px_rgba(156,163,175,0.4)]'}`} />
        </div>

        <div className="mt-8 text-center w-full max-w-md z-10">
          <h2 className={`text-2xl mb-2 ${enemy.isBoss ? 'text-metin-red font-bold' : 'text-gray-300'}`}>{enemy.name}</h2>
          
          <div className="w-full bg-metin-dark h-6 rounded overflow-hidden border border-metin-border relative">
            <div 
              className={`h-full transition-all duration-200 ${enemy.isBoss ? 'bg-red-700' : 'bg-green-700'}`} 
              style={{ width: `${hpPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white">
              {formatNumber(enemy.currentHp)} / {formatNumber(enemy.maxHp)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
