
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PixelHeart from './PixelHeart.tsx';
import Arrow from './Arrow.tsx';
import Bow from './Bow.tsx';

interface HeartData {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface ArrowData {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface GameEngineProps {
  onGameOver: (survived: boolean) => void;
  onMiss: () => void;
  difficulty: number;
}

const GAME_DURATION = 20;

const GameEngine: React.FC<GameEngineProps> = ({ onGameOver, onMiss, difficulty }) => {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bowX, setBowX] = useState(50);
  const [lives, setLives] = useState(99); 
  const [flashRed, setFlashRed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const requestRef = useRef<number>(null);

  const isExtremeMode = (GAME_DURATION - timeLeft) >= 10;

  const spawnHeart = useCallback(() => {
    if (isPaused || timeLeft <= 0) return;
    
    const elapsed = GAME_DURATION - timeLeft;
    const isExtreme = elapsed >= 10;
    const spawnCount = isExtreme ? Math.floor(Math.random() * 5) + 3 : 1;
    
    const newHearts: HeartData[] = [];
    for (let i = 0; i < spawnCount; i++) {
      const size = 30 + Math.random() * 20;
      const baseSpeed = isExtreme ? 1.8 : 0.6;
      const speed = (baseSpeed + Math.random() * 0.4) * (1 + difficulty * 0.05);
      
      newHearts.push({
        id: nextId.current++,
        x: Math.random() * 90 + 5,
        y: -10,
        size,
        speed
      });
    }
    setHearts(prev => [...prev, ...newHearts]);
  }, [difficulty, timeLeft, isPaused]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsPaused(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const intervalTime = isExtremeMode ? 300 : 1500;
    const spawner = setInterval(spawnHeart, intervalTime);
    spawnHeart();
    return () => clearInterval(spawner);
  }, [isExtremeMode, spawnHeart]);

  const fireArrow = () => {
    if (isPaused) return;
    setArrows(prev => [...prev, {
      id: nextId.current++,
      x: bowX,
      y: 90
    }]);
  };

  const createExplosion = (x: number, y: number, color: string) => {
    const count = 25; 
    const newParticles: Particle[] = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const force = 5 + Math.random() * 10;
      return {
        id: nextId.current++,
        x,
        y,
        vx: Math.cos(angle) * force * 0.4,
        vy: Math.sin(angle) * force * 0.4,
        color,
        size: 2 + Math.random() * 5,
        life: 1.0
      };
    });
    setParticles(prev => [...prev, ...newParticles].slice(-400));
  };

  const handleHeartMissed = useCallback(() => {
    if (isPaused) return;
    setLives(l => Math.max(0, l - 1));
    setFlashRed(true);
    onMiss(); 
    setTimeout(() => setFlashRed(false), 100);
  }, [onMiss, isPaused]);

  const update = useCallback(() => {
    if (isPaused) {
       // Only move existing particles when paused, freeze others
       setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2,
          life: p.life - 0.03
        }))
        .filter(p => p.life > 0)
      );
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    // 1. Move Particles (Independently)
    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.2, // Gravity
        life: p.life - 0.03
      }))
      .filter(p => p.life > 0)
    );

    // 2. Synchronized Update
    setArrows(prevArrows => {
      const movedArrows = prevArrows.map(a => ({ ...a, y: a.y - 12 })).filter(a => a.y > -10);
      
      setHearts(prevHearts => {
        let currentHearts = [...prevHearts];
        let currentArrows = [...movedArrows];
        let triggeredMiss = false;

        currentHearts = currentHearts.map(h => ({ ...h, y: h.y + h.speed }));

        const survivingHearts: HeartData[] = [];
        const heartsToExplode: HeartData[] = [];

        currentHearts.forEach(heart => {
          const hitByArrow = currentArrows.find(arrow => {
            const dx = Math.abs(arrow.x - heart.x);
            const dy = Math.abs(arrow.y - heart.y);
            return dx < 12 && dy < 12;
          });

          if (hitByArrow) {
            heartsToExplode.push(heart);
            currentArrows = currentArrows.filter(a => a.id !== hitByArrow.id);
          } else {
            survivingHearts.push(heart);
          }
        });

        heartsToExplode.forEach(h => createExplosion(h.x, h.y, "#f43f5e"));

        const finalHearts = survivingHearts.filter(h => {
          if (h.y > 105) {
            triggeredMiss = true;
            return false;
          }
          return true;
        });

        if (triggeredMiss) handleHeartMissed();
        (window as any)._tempArrows = currentArrows;
        return finalHearts;
      });

      return (window as any)._tempArrows || movedArrows;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [handleHeartMissed, isPaused]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  useEffect(() => {
    if (lives <= 0) onGameOver(false);
  }, [lives, onGameOver]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Small delay before actual screen change
      setTimeout(() => onGameOver(true), 1500);
    }
  }, [timeLeft, onGameOver]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && !isPaused) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setBowX(Math.max(5, Math.min(95, x)));
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full transition-colors duration-100 overflow-hidden relative ${flashRed ? 'bg-red-950' : 'bg-stone-900'}`}
      onMouseMove={handleMouseMove}
      onClick={fireArrow}
    >
      <div className="absolute top-8 left-0 w-full px-8 flex justify-between items-start pointer-events-none z-10">
        <div className="flex flex-col items-center">
           <h2 className={`text-xl ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'} mb-1`}>⏱ {timeLeft}s</h2>
           <p className="text-[10px] text-white opacity-50 uppercase tracking-widest">Time Remaining</p>
        </div>
        <div className="flex flex-col items-end">
           <div className="flex items-center gap-2">
             <PixelHeart size={24} color="#f43f5e" />
             <span className="text-2xl text-white font-bold">{lives}</span>
           </div>
           <p className="text-[10px] text-white opacity-50 mt-1 uppercase tracking-widest">Lives Left</p>
        </div>
      </div>

      <div className="absolute top-24 left-0 w-full text-center pointer-events-none px-4">
        {timeLeft > 0 ? (
          isExtremeMode && (
            <div className="animate-pulse">
              <p className="text-sm text-red-500 uppercase tracking-widest font-bold">WARNING: LOVE OVERLOAD!</p>
              <p className="text-[10px] text-white opacity-70 mt-1 uppercase">SHOOT THE HEARTS TO SURVIVE!</p>
            </div>
          )
        ) : (
          <p className="text-lg text-white uppercase tracking-[0.5em] animate-bounce">TIME UP!</p>
        )}
      </div>

      {hearts.map(h => (
        <div 
          key={h.id} 
          className="absolute"
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: h.size, height: h.size, transform: 'translate(-50%, -50%)' }}
        >
          <PixelHeart size={h.size} color="#f43f5e" />
        </div>
      ))}

      {arrows.map(a => (
        <div 
          key={a.id} 
          className="absolute"
          style={{ left: `${a.x}%`, top: `${a.y}%`, transform: 'translateX(-50%)' }}
        >
          <Arrow />
        </div>
      ))}

      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-full"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: `${p.size}px`, 
            height: `${p.size}px`, 
            backgroundColor: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      <div 
        className="absolute bottom-10 transition-all duration-75 pointer-events-none"
        style={{ left: `${bowX}%`, transform: 'translateX(-50%) scale(2.5)' }}
      >
        <Bow />
      </div>
    </div>
  );
};

export default GameEngine;
