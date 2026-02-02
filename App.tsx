
import React, { useState, useEffect } from 'react';
import GameEngine from './components/GameEngine.tsx';
import PixelHeart from './components/PixelHeart.tsx';
import PixelCouple from './components/PixelCouple.tsx';

type Stage = 'INTRO' | 'PLAYING' | 'RETRY' | 'FINAL';

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>('INTRO');
  const [attempts, setAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [finalStep, setFinalStep] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);
  };

  const startGame = () => {
    setStage('PLAYING');
    setAttempts(prev => prev + 1);
  };

  const handleGameEnd = (survived: boolean) => {
    if (survived) {
      setStage('FINAL');
    } else {
      if (attempts >= 2) {
        setStage('FINAL');
      } else {
        triggerShake();
        setStage('RETRY');
      }
    }
  };

  if (stage === 'INTRO') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-xl md:text-3xl mb-8 leading-loose tracking-widest text-pink-400">
          💘 WILL YOU BE MY VALENTINE? 💘
        </h1>
        <p className="text-xs md:text-sm mb-12 opacity-70">
          TO SAY <span className="text-red-500">NO</span>, YOU MUST WIN THE GAME.
        </p>
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button onClick={startGame} className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 pixel-border text-sm uppercase">
            START GAME 🏹
          </button>
          <button disabled className="bg-gray-800 text-gray-500 py-4 px-8 pixel-border cursor-not-allowed text-xs opacity-50">
            YES 💕 (INACTIVE)
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'PLAYING') {
    return (
      <div className={`relative w-full h-screen overflow-hidden ${isShaking ? 'shake' : ''}`}>
        <GameEngine onGameOver={handleGameEnd} onMiss={triggerShake} difficulty={attempts - 1} />
      </div>
    );
  }

  if (stage === 'RETRY') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-xl md:text-3xl mb-8 text-red-500">MISSED.</h1>
        <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-8 pixel-border text-sm uppercase">
          RETRY? 🔁
        </button>
      </div>
    );
  }

  if (stage === 'FINAL') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-stone-950 overflow-hidden relative">
        <div className="max-w-2xl space-y-12 z-20">
          {!celebrated ? (
            <>
              {finalStep === 0 && <Typewriter text="GAME OVER... BUT MY HEART IS STILL YOURS 💘" onComplete={() => setTimeout(() => setFinalStep(1), 1800)} />}
              {finalStep === 1 && <Typewriter text="WOULD YOU STILL LIKE TO BE MY VALENTINE?" onComplete={() => setTimeout(() => setFinalStep(2), 1500)} />}
              {finalStep === 2 && (
                <div className="animate-in fade-in duration-1000">
                   <button onClick={() => setCelebrated(true)} className="bg-pink-600 hover:bg-pink-500 text-white py-8 px-16 pixel-border-pink animate-bounce text-xl shadow-[0_0_40px_rgba(236,72,153,0.8)]">
                     YES 💕
                   </button>
                </div>
              )}
            </>
          ) : (
            <div className="animate-in zoom-in duration-700 space-y-8">
               <PixelCouple size={160} />
               <h1 className="text-xl md:text-2xl text-pink-400">Achievement unlocked:<br/><span className="text-3xl text-white mt-4 block">VALENTINE 💖</span></h1>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Fix for Error: Type '...' is not assignable to type 'FC<{ text: string; onComplete: () => void; }>'.
// Added state logic and return statement for the Typewriter component.
const Typewriter: React.FC<{ text: string, onComplete: () => void }> = ({ text, onComplete }) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <h2 className="text-2xl md:text-4xl font-bold text-white tracking-widest">{display}</h2>;
};

// Fix for Error: Module '"file:///App"' has no default export.
export default App;
