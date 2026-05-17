import { useEffect, useState } from 'react';
import { useSystemStore } from './store/systemStore';
import { PlayerStats } from './components/PlayerStats';
import { GameArea } from './components/GameArea';
import { Inventory } from './components/Inventory';
import { Blacksmith } from './components/Blacksmith';
import { Artifacts } from './components/Artifacts';
import { Rebirth } from './components/Rebirth';

function App() {
  const { startGameLoop, stopGameLoop, loadData, saveData } = useSystemStore();
  const [activeTab, setActiveTab] = useState<'blacksmith' | 'artifacts' | 'rebirth'>('blacksmith');

  useEffect(() => {
    loadData();
    startGameLoop();

    const saveInterval = setInterval(() => {
      saveData();
    }, 10000); // Save every 10 seconds

    return () => {
      stopGameLoop();
      clearInterval(saveInterval);
      saveData();
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-metin-dark text-gray-300 font-crimson flex flex-col p-4">
      <header className="text-center mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-cinzel text-metin-gold tracking-widest drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
          METIN IDLE
        </h1>
        <button className="btn-primary py-1 px-4 text-sm" onClick={() => {
          saveData();
          alert('Game Saved!');
        }}>
          Save Game
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Left Column - Player & Misc */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden h-full">
          <PlayerStats />
          
          <div className="panel flex-1 flex flex-col">
            <div className="flex border-b border-metin-border bg-metin-dark/50 text-sm">
              <button 
                className={`flex-1 py-3 font-cinzel transition-colors ${activeTab === 'blacksmith' ? 'text-metin-gold border-b-2 border-metin-gold bg-metin-panel' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('blacksmith')}
              >
                Blacksmith
              </button>
              <button 
                className={`flex-1 py-3 font-cinzel transition-colors ${activeTab === 'artifacts' ? 'text-metin-gold border-b-2 border-metin-gold bg-metin-panel' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('artifacts')}
              >
                Artifacts
              </button>
              <button 
                className={`flex-1 py-3 font-cinzel transition-colors ${activeTab === 'rebirth' ? 'text-metin-gold border-b-2 border-metin-gold bg-metin-panel' : 'text-gray-500 hover:text-gray-300'}`}
                onClick={() => setActiveTab('rebirth')}
              >
                Rebirth
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTab === 'blacksmith' && <Blacksmith />}
              {activeTab === 'artifacts' && <Artifacts />}
              {activeTab === 'rebirth' && <Rebirth />}
            </div>
          </div>
        </div>

        {/* Center Column - Combat */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <GameArea />
        </div>

        {/* Right Column - Inventory */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
          <Inventory />
        </div>

      </div>
    </div>
  );
}

export default App;
