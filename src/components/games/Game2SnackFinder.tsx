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

interface ItemDef {
  id: string;
  name: string;
  icon: string;
  bg: string;
}

const SNACK_ITEMS: ItemDef[] = [
  { id: 'churu', name: '맛있는 츄르', icon: '🥫', bg: '#FEE2E2' },
  { id: 'tuna', name: '참치캔', icon: '🐟', bg: '#E0F2FE' },
  { id: 'milk', name: '고소한 우유', icon: '🥛', bg: '#FEF9C3' },
  { id: 'cheese', name: '노란 치즈', icon: '🧀', bg: '#FEF08A' },
  { id: 'shrimp', name: '바삭 새우', icon: '🍤', bg: '#FFEDD5' },
  { id: 'cookie', name: '물고기 쿠키', icon: '🍪', bg: '#FCE7F3' },
  { id: 'sausage', name: '비엔나 소시지', icon: '🌭', bg: '#FEE2E2' },
  { id: 'icecream', name: '딸기 아이스크림', icon: '🍦', bg: '#EDE9FE' },
];

export const Game2SnackFinder: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);
  const [targetItem, setTargetItem] = useState<ItemDef>(SNACK_ITEMS[0]);
  const [gridItems, setGridItems] = useState<ItemDef[]>([]);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [wrongShake, setWrongShake] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { totalRounds: 6, maxTime: 35, gridSize: 6, targetScore: 120 },
    normal: { totalRounds: 10, maxTime: 30, gridSize: 9, targetScore: 200 },
    hard: { totalRounds: 14, maxTime: 25, gridSize: 12, targetScore: 280 },
  }[difficulty];

  const generateRound = () => {
    // Pick random target
    const target = SNACK_ITEMS[Math.floor(Math.random() * SNACK_ITEMS.length)];
    setTargetItem(target);

    // Pick (gridSize - 1) other items
    const otherItems = SNACK_ITEMS.filter((i) => i.id !== target.id);
    const selectedOthers: ItemDef[] = [];
    for (let i = 0; i < config.gridSize - 1; i++) {
      selectedOthers.push(otherItems[Math.floor(Math.random() * otherItems.length)]);
    }

    // Insert target at random slot
    const all = [...selectedOthers];
    const randomIndex = Math.floor(Math.random() * (all.length + 1));
    all.splice(randomIndex, 0, target);
    setGridItems(all);
  };

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setRound(1);
    generateRound();
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart();
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleItemClick = (item: ItemDef) => {
    if (item.id === targetItem.id) {
      sound.playPop();
      sound.playChoco();
      const newScore = score + 20;
      setScore(newScore);

      if (round >= config.totalRounds) {
        clearInterval(timerRef.current!);
        const calcStars = timeLeft > 10 ? 3 : 2;
        setStars(calcStars);
        const rewards = onGameComplete(2, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      } else {
        setRound((prev) => prev + 1);
        generateRound();
      }
    } else {
      sound.playMiss();
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  return (
    <GameModalWrapper
      title="고양이 간식 찾기"
      gameNumber={2}
      icon="🥫"
      subtitle="안내된 간식을 여러 그림 중에서 정확하게 찾아 클릭하세요! 눈으로 꼼꼼히 살피고 마우스를 정확하게 조준하는 연습이에요."
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
      <div className="w-full flex flex-col items-center">
        {/* Mission Banner */}
        <div className="w-full max-w-xl p-3.5 mb-4 bg-gradient-to-r from-rose-100 via-amber-100 to-teal-100 rounded-2xl border-3 border-amber-300 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-white rounded-xl shadow-xs">{targetItem.icon}</span>
            <div>
              <span className="text-xs font-bold text-amber-800">
                [라운드 {round} / {config.totalRounds}]
              </span>
              <div className="text-lg font-black text-slate-800">
                <span className="text-rose-600 font-extrabold underline decoration-amber-400">
                  {targetItem.name}
                </span>
                을(를) 찾아보세요!
              </div>
            </div>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-white/90 text-slate-700 rounded-xl border border-amber-200">
            정확히 클릭!
          </div>
        </div>

        {/* Item Selection Grid */}
        <div
          className={`grid gap-3 w-full max-w-xl p-4 bg-amber-50/70 rounded-3xl border-3 border-amber-200 shadow-inner ${
            wrongShake ? 'animate-shake' : ''
          }`}
          style={{
            gridTemplateColumns: `repeat(${config.gridSize <= 6 ? 3 : 4}, minmax(0, 1fr))`,
          }}
        >
          {gridItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item)}
              className="group p-3 md:p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95 focus:outline-none"
              style={{ backgroundColor: item.bg }}
            >
              <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-xs font-bold text-slate-700 mt-1.5 whitespace-nowrap">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </GameModalWrapper>
  );
};
