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

interface GiftBox {
  id: number;
  x: number;
  y: number;
  color: 'pink' | 'gold' | 'blue' | 'purple';
  points: number;
  opened: boolean;
  openedItem?: string;
}

export const Game3GiftBox: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [boxes, setBoxes] = useState<GiftBox[]>([]);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [singleClickHint, setSingleClickHint] = useState<number | null>(null);

  const nextId = useRef(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { targetBoxes: 6, maxTime: 30, spawnInterval: 1200 },
    normal: { targetBoxes: 10, maxTime: 25, spawnInterval: 950 },
    hard: { targetBoxes: 15, maxTime: 22, spawnInterval: 750 },
  }[difficulty];

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setBoxes([]);
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
            if (cur >= config.targetBoxes * 25) {
              const calcStars = cur >= config.targetBoxes * 35 ? 3 : 2;
              setStars(calcStars);
              const rewards = onGameComplete(3, difficulty, cur, calcStars);
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
  }, [gameState, config.targetBoxes, difficulty, onGameComplete]);

  // Box Spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnRef.current = setInterval(() => {
      const colors: Array<'pink' | 'gold' | 'blue' | 'purple'> = ['pink', 'gold', 'blue', 'purple'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      const points = chosenColor === 'gold' ? 40 : 25;

      const newBox: GiftBox = {
        id: nextId.current++,
        x: Math.floor(12 + Math.random() * 76),
        y: Math.floor(15 + Math.random() * 65),
        color: chosenColor,
        points,
        opened: false,
      };

      setBoxes((prev) => [...prev.filter((b) => !b.opened).slice(-5), newBox]);
    }, config.spawnInterval);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, config.spawnInterval]);

  const handleBoxSingleClick = (id: number) => {
    sound.playPop();
    setSingleClickHint(id);
    setTimeout(() => {
      setSingleClickHint((cur) => (cur === id ? null : cur));
    }, 800);
  };

  const handleBoxDoubleClick = (box: GiftBox, e: React.MouseEvent) => {
    e.stopPropagation();
    if (box.opened) return;
    sound.playStar(1);
    sound.playChoco();

    const treasures = ['💎 반짝 보석!', '🍫 왕초코!', '⭐ 황금별!', '🎀 예쁜 리본!'];
    const prize = treasures[Math.floor(Math.random() * treasures.length)];

    setBoxes((prev) =>
      prev.map((b) => (b.id === box.id ? { ...b, opened: true, openedItem: prize } : b))
    );

    setScore((prev) => {
      const newScore = prev + box.points;
      if (newScore >= config.targetBoxes * 30) {
        clearInterval(timerRef.current!);
        clearInterval(spawnRef.current!);
        const calcStars = 3;
        setStars(calcStars);
        const rewards = onGameComplete(3, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      }
      return newScore;
    });

    // Remove box after celebration
    setTimeout(() => {
      setBoxes((prev) => prev.filter((b) => b.id !== box.id));
    }, 1200);
  };

  return (
    <GameModalWrapper
      title="선물상자 열기"
      gameNumber={3}
      icon="🎁"
      subtitle="선물상자를 마우스로 빠르게 '톡-톡!' 두 번 더블클릭하여 안에 숨겨진 보물을 찾아보세요! 마우스 더블클릭 연습이에요."
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      score={score}
      targetScore={config.targetBoxes * 25}
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
      <div className="relative w-full h-[400px] md:h-[430px] bg-gradient-to-br from-pink-100 via-amber-50 to-purple-100 rounded-3xl border-4 border-pink-300 shadow-inner overflow-hidden select-none">
        {/* Floating clouds/ribbons */}
        <div className="absolute top-4 left-6 text-2xl opacity-60">🎀</div>
        <div className="absolute top-8 right-10 text-2xl opacity-60">✨</div>
        <div className="absolute bottom-6 left-12 text-2xl opacity-60">🍬</div>
        <div className="absolute bottom-8 right-16 text-2xl opacity-60">🎁</div>

        {/* Gift Boxes */}
        {boxes.map((box) => (
          <div
            key={box.id}
            onClick={() => handleBoxSingleClick(box.id)}
            onDoubleClick={(e) => handleBoxDoubleClick(box, e)}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-115 active:scale-95"
            style={{ left: `${box.x}%`, top: `${box.y}%` }}
          >
            {box.opened ? (
              <div className="flex flex-col items-center animate-bounce">
                <span className="text-5xl">✨</span>
                <span className="text-xs font-black text-rose-600 bg-white/95 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-pink-200">
                  {box.openedItem} (+{box.points}점)
                </span>
              </div>
            ) : (
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-3 transition-all ${
                    box.color === 'gold'
                      ? 'bg-amber-300 border-amber-500 shadow-amber-200 animate-pulse'
                      : box.color === 'pink'
                      ? 'bg-pink-300 border-pink-500 shadow-pink-200'
                      : box.color === 'blue'
                      ? 'bg-sky-300 border-sky-500 shadow-sky-200'
                      : 'bg-purple-300 border-purple-500 shadow-purple-200'
                  }`}
                >
                  🎁
                </div>

                {/* Double click instruction bubble if single-clicked */}
                {singleClickHint === box.id && (
                  <div className="absolute -top-7 bg-amber-400 text-amber-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow-md border border-amber-500 whitespace-nowrap animate-bounce z-30">
                    빠르게 톡-톡! (더블클릭)
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-xs border border-pink-200">
          💡 팁: 마우스 버튼을 빠르게 '두 번' 연속으로 딸깍딸깍 누르면 상자가 열려요!
        </div>
      </div>
    </GameModalWrapper>
  );
};
