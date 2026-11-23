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

type FishColor = 'red' | 'blue' | 'yellow';

interface BasketFish {
  id: number;
  color: FishColor;
  icon: string;
}

export const Game4FishBasket: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentFish, setCurrentFish] = useState<BasketFish[]>([]);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [draggedFish, setDraggedFish] = useState<BasketFish | null>(null);

  const nextFishId = useRef(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { targetSorts: 6, maxTime: 35, simultaneousFish: 2 },
    normal: { targetSorts: 10, maxTime: 30, simultaneousFish: 3 },
    hard: { targetSorts: 15, maxTime: 25, simultaneousFish: 4 },
  }[difficulty];

  const createFish = (): BasketFish => {
    const colors: FishColor[] = ['red', 'blue', 'yellow'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const icons = {
      red: '🐠',
      blue: '🐟',
      yellow: '🐡',
    };
    return {
      id: nextFishId.current++,
      color,
      icon: icons[color],
    };
  };

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    const initialFish: BasketFish[] = [];
    for (let i = 0; i < config.simultaneousFish; i++) {
      initialFish.push(createFish());
    }
    setCurrentFish(initialFish);
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
          setScore((cur) => {
            if (cur >= config.targetSorts * 15) {
              const calcStars = cur >= config.targetSorts * 25 ? 3 : 2;
              setStars(calcStars);
              const rewards = onGameComplete(4, difficulty, cur, calcStars);
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
  }, [gameState, config.targetSorts, difficulty, onGameComplete]);

  const handleDragStart = (fish: BasketFish) => {
    sound.playPop();
    setDraggedFish(fish);
  };

  const handleDrop = (basketColor: FishColor) => {
    if (!draggedFish) return;

    if (draggedFish.color === basketColor) {
      sound.playChoco();
      sound.playStar(0);
      const newScore = score + 20;
      setScore(newScore);

      // Remove dropped fish and spawn a new one
      setCurrentFish((prev) => {
        const remaining = prev.filter((f) => f.id !== draggedFish.id);
        return [...remaining, createFish()];
      });

      if (newScore >= config.targetSorts * 20) {
        clearInterval(timerRef.current!);
        const calcStars = timeLeft > 10 ? 3 : 2;
        setStars(calcStars);
        const rewards = onGameComplete(4, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      }
    } else {
      sound.playMiss();
    }
    setDraggedFish(null);
  };

  return (
    <GameModalWrapper
      title="생선 바구니"
      gameNumber={4}
      icon="🧺"
      subtitle="생선을 마우스로 꾹 누른 채로 알맞은 색깔 바구니로 드래그해서 쏙 넣어보세요! 마우스 드래그 앤 드롭 연습이에요."
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      score={score}
      targetScore={config.targetSorts * 20}
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
      <div className="w-full flex flex-col items-center select-none">
        {/* Fish Swimming Pool (Source Area) */}
        <div className="w-full max-w-xl p-4 bg-sky-100 rounded-3xl border-3 border-sky-300 shadow-inner mb-6 flex flex-col items-center">
          <div className="text-xs font-bold text-sky-800 mb-2">
            👇 생선을 마우스로 끌어서 아래 같은 색깔 바구니에 퐁당 넣어주세요!
          </div>

          <div className="flex items-center justify-center gap-6 py-4">
            {currentFish.map((fish) => {
              const bgBadge =
                fish.color === 'red'
                  ? 'bg-rose-200 border-rose-400'
                  : fish.color === 'blue'
                  ? 'bg-blue-200 border-blue-400'
                  : 'bg-amber-200 border-amber-400';
              return (
                <div
                  key={fish.id}
                  draggable
                  onDragStart={() => handleDragStart(fish)}
                  className={`p-3 md:p-4 rounded-2xl border-3 ${bgBadge} shadow-md cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-all flex flex-col items-center animate-bounce`}
                >
                  <span className="text-5xl">{fish.icon}</span>
                  <span className="text-xs font-black text-slate-700 mt-1">
                    {fish.color === 'red' ? '빨강 생선' : fish.color === 'blue' ? '파랑 생선' : '노랑 생선'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baskets (Drop Target Areas) */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
          {/* Red Basket */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('red')}
            onClick={() => draggedFish && handleDrop('red')}
            className="p-4 bg-rose-50 hover:bg-rose-100 rounded-3xl border-4 border-dashed border-rose-400 flex flex-col items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <div className="text-5xl mb-1">🧺</div>
            <div className="font-extrabold text-rose-700 text-base">빨간 바구니</div>
            <div className="text-xs text-rose-500 font-bold mt-0.5">빨간 물고기 전용</div>
          </div>

          {/* Blue Basket */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('blue')}
            onClick={() => draggedFish && handleDrop('blue')}
            className="p-4 bg-sky-50 hover:bg-sky-100 rounded-3xl border-4 border-dashed border-sky-400 flex flex-col items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <div className="text-5xl mb-1">🧺</div>
            <div className="font-extrabold text-sky-700 text-base">파란 바구니</div>
            <div className="text-xs text-sky-500 font-bold mt-0.5">파란 물고기 전용</div>
          </div>

          {/* Yellow Basket */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('yellow')}
            onClick={() => draggedFish && handleDrop('yellow')}
            className="p-4 bg-amber-50 hover:bg-amber-100 rounded-3xl border-4 border-dashed border-amber-400 flex flex-col items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <div className="text-5xl mb-1">🧺</div>
            <div className="font-extrabold text-amber-700 text-base">노란 바구니</div>
            <div className="text-xs text-amber-600 font-bold mt-0.5">노란 물고기 전용</div>
          </div>
        </div>
      </div>
    </GameModalWrapper>
  );
};
