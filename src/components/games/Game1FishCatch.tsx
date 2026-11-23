import React, { useState, useEffect, useRef } from 'react';
import { GameDifficulty } from '../../types';
import { GameModalWrapper } from './GameModalWrapper';
import { sound } from '../../utils/sound';

interface Props {
  difficulty: GameDifficulty;
  onDifficultyChange: (diff: GameDifficulty) => void;
  onGameComplete: (gameId: number, diff: GameDifficulty, score: number, stars: number) => {
    earnedChoco: number;
    earnedExp: number;
    isFirstClear: boolean;
  };
  onClose: () => void;
}

interface Fish {
  id: number;
  x: number;
  y: number;
  type: 'blue' | 'gold' | 'pink' | 'shrimp';
  size: number;
  points: number;
}

export const Game1FishCatch: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [popEffects, setPopEffects] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);

  const nextFishId = useRef(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { targetScore: 100, maxTime: 30, spawnInterval: 1000, duration: 4000 },
    normal: { targetScore: 180, maxTime: 25, spawnInterval: 750, duration: 3000 },
    hard: { targetScore: 260, maxTime: 22, spawnInterval: 550, duration: 2200 },
  }[difficulty];

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setFishes([]);
    setPopEffects([]);
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart();
  };

  // Game timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(spawnRef.current!);
          // Check win condition
          setScore((currentScore) => {
            if (currentScore >= config.targetScore) {
              const calcStars = currentScore >= config.targetScore * 1.3 ? 3 : currentScore >= config.targetScore ? 2 : 1;
              setStars(calcStars);
              const rewards = onGameComplete(1, difficulty, currentScore, calcStars);
              setRewardData(rewards);
              setGameState('victory');
            } else {
              setGameState('gameover');
            }
            return currentScore;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, config.targetScore, difficulty, onGameComplete]);

  // Fish spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnRef.current = setInterval(() => {
      const types: Array<'blue' | 'gold' | 'pink' | 'shrimp'> = ['blue', 'pink', 'gold', 'shrimp'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const points = chosenType === 'gold' ? 30 : chosenType === 'shrimp' ? 25 : 15;

      const newFish: Fish = {
        id: nextFishId.current++,
        x: Math.floor(10 + Math.random() * 80), // 10% to 90%
        y: Math.floor(15 + Math.random() * 70), // 15% to 85%
        type: chosenType,
        size: chosenType === 'gold' ? 56 : chosenType === 'shrimp' ? 44 : 50,
        points,
      };

      setFishes((prev) => [...prev.slice(-8), newFish]);

      // Remove after duration
      setTimeout(() => {
        setFishes((prev) => prev.filter((f) => f.id !== newFish.id));
      }, config.duration);
    }, config.spawnInterval);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, config.duration, config.spawnInterval]);

  const handleFishClick = (fish: Fish, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();

    // Spawn pop bubble
    const effectId = Date.now();
    setPopEffects((prev) => [...prev, { id: effectId, x: fish.x, y: fish.y, text: `+${fish.points}점!` }]);
    setTimeout(() => {
      setPopEffects((prev) => prev.filter((p) => p.id !== effectId));
    }, 700);

    setScore((prev) => {
      const newScore = prev + fish.points;
      // Instant win if score well above goal
      if (newScore >= config.targetScore * 1.4) {
        clearInterval(timerRef.current!);
        clearInterval(spawnRef.current!);
        const calcStars = 3;
        setStars(calcStars);
        const rewards = onGameComplete(1, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      }
      return newScore;
    });

    setFishes((prev) => prev.filter((f) => f.id !== fish.id));
  };

  return (
    <GameModalWrapper
      title="생선 톡톡"
      gameNumber={1}
      icon="🐟"
      subtitle="수영하는 싱싱한 생선들을 마우스 왼쪽 버튼으로 빠르게 톡톡 클릭해보세요! 정확하게 클릭하는 연습이에요."
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      score={score}
      targetScore={config.targetScore}
      timeLeft={timeLeft}
      maxTime={config.maxTime}
      gameState={gameState}
      stars={stars}
      earnedChoco={rewardData.earnedChoco}
      earnedExp={rewardData.earnedExp}
      isFirstClear={rewardData.isFirstClear}
      onStart={handleStart}
      onRestart={handleRestart}
      onClose={onClose}
    >
      {/* Pond Arena */}
      <div className="relative w-full h-[400px] md:h-[440px] bg-gradient-to-b from-sky-200 via-teal-100 to-sky-300 rounded-3xl border-4 border-teal-300 shadow-inner overflow-hidden select-none cursor-crosshair">
        {/* Animated water waves & ripples */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Cute water plants & stones */}
        <div className="absolute bottom-2 left-6 text-3xl pointer-events-none opacity-80">🌿</div>
        <div className="absolute bottom-3 left-20 text-2xl pointer-events-none opacity-70">🪨</div>
        <div className="absolute bottom-2 right-8 text-3xl pointer-events-none opacity-80">🪸</div>
        <div className="absolute bottom-4 right-28 text-2xl pointer-events-none opacity-70">🌿</div>

        {/* Floating pop score effects */}
        {popEffects.map((p) => (
          <div
            key={p.id}
            className="absolute z-30 font-black text-rose-600 bg-white/95 px-2.5 py-1 rounded-full shadow-md text-sm pointer-events-none animate-bounce"
            style={{ left: `${p.x}%`, top: `${p.y - 10}%` }}
          >
            {p.text}
          </div>
        ))}

        {/* Fishes */}
        {fishes.map((fish) => {
          const fishEmoji =
            fish.type === 'gold' ? '🐠' : fish.type === 'pink' ? '🐡' : fish.type === 'shrimp' ? '🦐' : '🐟';
          return (
            <button
              key={fish.id}
              onClick={(e) => handleFishClick(fish, e)}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 active:scale-90 animate-pulse focus:outline-none"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                width: `${fish.size}px`,
                height: `${fish.size}px`,
              }}
              title={`${fish.points}점 생선 클릭!`}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl filter drop-shadow-md">
                {fishEmoji}
              </div>
            </button>
          );
        })}

        {/* Instruction helper tag */}
        <div className="absolute top-3 left-4 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-slate-600 pointer-events-none shadow-xs">
          💡 생선이 사라지기 전에 마우스로 톡! 클릭하세요!
        </div>
      </div>
    </GameModalWrapper>
  );
};
