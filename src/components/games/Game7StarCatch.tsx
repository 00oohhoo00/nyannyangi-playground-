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

interface StarTarget {
  id: number;
  x: number;
  y: number;
  type: 'gold' | 'rainbow' | 'comet';
  points: number;
}

export const Game7StarCatch: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [starsOnScreen, setStarsOnScreen] = useState<StarTarget[]>([]);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });

  const nextId = useRef(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { maxTime: 30, spawnInterval: 900, duration: 3200, targetScore: 120 },
    normal: { maxTime: 25, spawnInterval: 650, duration: 2400, targetScore: 200 },
    hard: { maxTime: 22, spawnInterval: 480, duration: 1800, targetScore: 300 },
  }[difficulty];

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setStarsOnScreen([]);
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(spawnRef.current!);
          setScore((cur) => {
            if (cur >= config.targetScore) {
              const calcStars = cur >= config.targetScore * 1.3 ? 3 : 2;
              setStars(calcStars);
              const rewards = onGameComplete(7, difficulty, cur, calcStars);
              setRewardData(rewards);
              setGameState('victory');
            } else {
              setGameState('gameover');
            }
            return cur;
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

  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnRef.current = setInterval(() => {
      const rand = Math.random();
      const type: 'gold' | 'rainbow' | 'comet' = rand < 0.2 ? 'comet' : rand < 0.5 ? 'rainbow' : 'gold';
      const points = type === 'comet' ? 35 : type === 'rainbow' ? 25 : 15;

      const newStar: StarTarget = {
        id: nextId.current++,
        x: Math.floor(10 + Math.random() * 80),
        y: Math.floor(15 + Math.random() * 70),
        type,
        points,
      };

      setStarsOnScreen((prev) => [...prev.slice(-9), newStar]);

      setTimeout(() => {
        setStarsOnScreen((prev) => prev.filter((s) => s.id !== newStar.id));
      }, config.duration);
    }, config.spawnInterval);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, config.duration, config.spawnInterval]);

  const handleStarClick = (star: StarTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playStar(star.type === 'comet' ? 2 : 0);
    sound.playPop();

    setScore((prev) => prev + star.points);
    setStarsOnScreen((prev) => prev.filter((s) => s.id !== star.id));
  };

  return (
    <GameModalWrapper
      title="별을 잡아라"
      gameNumber={7}
      icon="⭐"
      subtitle="밤하늘에 깜빡이며 나타나는 별들을 빠르게 클릭하세요! 빠른 반사신경과 마우스 조준 능력을 키워주는 게임이에요."
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
      <div className="relative w-full h-[400px] md:h-[440px] bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#31104B] rounded-3xl border-4 border-indigo-400 shadow-2xl overflow-hidden select-none cursor-crosshair">
        {/* Distant cosmic stars */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Crescent Moon */}
        <div className="absolute top-4 right-6 text-4xl opacity-80 pointer-events-none">🌙</div>

        {/* Stars */}
        {starsOnScreen.map((star) => (
          <button
            key={star.id}
            onClick={(e) => handleStarClick(star, e)}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-130 active:scale-90 focus:outline-none animate-pulse"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]">
                {star.type === 'comet' ? '💫' : star.type === 'rainbow' ? '🌟' : '⭐'}
              </span>
              <span className="text-[10px] font-black text-amber-300 drop-shadow-md">
                +{star.points}
              </span>
            </div>
          </button>
        ))}

        <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200 border border-indigo-500 shadow-md">
          💡 반짝이는 별이 사라지기 전에 콕! 클릭하세요!
        </div>
      </div>
    </GameModalWrapper>
  );
};
