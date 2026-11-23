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

export const Game5PawMaze: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [pawPos, setPawPos] = useState({ x: 20, y: 30 });
  const [touchWallAlert, setTouchWallAlert] = useState(false);
  const [hasStartedPath, setHasStartedPath] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { maxTime: 40, targetScore: 100 },
    normal: { maxTime: 30, targetScore: 150 },
    hard: { maxTime: 25, targetScore: 200 },
  }[difficulty];

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setPawPos({ x: 40, y: 40 });
    setHasStartedPath(false);
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

  const handleWallHit = () => {
    if (!hasStartedPath) return;
    sound.playMiss();
    setTouchWallAlert(true);
    setPawPos({ x: 40, y: 40 }); // reset to start
    setHasStartedPath(false);
    setTimeout(() => setTouchWallAlert(false), 500);
  };

  const handleGoalReach = () => {
    if (!hasStartedPath) return;
    sound.playVictory();
    sound.playStar(2);
    clearInterval(timerRef.current!);

    const calculatedScore = Math.max(80, timeLeft * 5 + (difficulty === 'hard' ? 80 : difficulty === 'normal' ? 50 : 20));
    setScore(calculatedScore);
    const calcStars = timeLeft > 15 ? 3 : 2;
    setStars(calcStars);
    const rewards = onGameComplete(5, difficulty, calculatedScore, calcStars);
    setRewardData(rewards);
    setGameState('victory');
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPawPos({ x, y });
  };

  return (
    <GameModalWrapper
      title="발자국 미로"
      gameNumber={5}
      icon="🐾"
      subtitle="벽에 닿지 않도록 마우스를 조심조심 움직여 길을 따라 아기 고양이에게 가보세요! 마우스를 섬세하게 움직이는 연습이에요."
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
      <div className="relative w-full max-w-2xl h-[380px] bg-amber-100/90 rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden select-none">
        {/* Wall alert notice */}
        {touchWallAlert && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 bg-rose-500 text-white font-extrabold px-4 py-1 rounded-full shadow-lg text-sm animate-bounce">
            ⚠️ 앗! 벽에 닿았어요! 출발선에서 다시 시작해요.
          </div>
        )}

        {/* Maze SVG with path and walls */}
        <svg
          className="w-full h-full"
          viewBox="0 0 600 360"
          onMouseMove={handleMouseMove}
        >
          {/* Background Wall Zone (Hitting this causes wall hit) */}
          <rect
            x="0"
            y="0"
            width="600"
            height="360"
            fill="#FDE68A"
            onMouseEnter={handleWallHit}
          />

          {/* Safe Walkable Track (White path) */}
          {difficulty === 'easy' && (
            <path
              d="M 50 60 L 520 60 L 520 180 L 100 180 L 100 300 L 530 300"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="60"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => setHasStartedPath(true)}
            />
          )}

          {difficulty === 'normal' && (
            <path
              d="M 50 60 L 300 60 L 300 140 L 120 140 L 120 230 L 480 230 L 480 140 L 530 140 L 530 300 L 250 300"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="48"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => setHasStartedPath(true)}
            />
          )}

          {difficulty === 'hard' && (
            <path
              d="M 40 40 L 220 40 L 220 120 L 80 120 L 80 200 L 360 200 L 360 100 L 540 100 L 540 260 L 280 260 L 280 320 L 540 320"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="38"
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => setHasStartedPath(true)}
            />
          )}

          {/* Start Circle */}
          <circle cx="50" cy="50" r="28" fill="#34D399" opacity="0.8" />
          <text x="35" y="55" fontSize="13" fontWeight="bold" fill="#065F46">출발</text>

          {/* Goal Cat Circle */}
          <circle
            cx={difficulty === 'easy' ? '530' : difficulty === 'normal' ? '250' : '540'}
            cy={difficulty === 'easy' ? '300' : difficulty === 'normal' ? '300' : '320'}
            r="32"
            fill="#FB7185"
            opacity="0.9"
            className="animate-pulse cursor-pointer"
            onMouseEnter={handleGoalReach}
          />
          <text
            x={difficulty === 'easy' ? '518' : difficulty === 'normal' ? '238' : '528'}
            y={difficulty === 'easy' ? '307' : difficulty === 'normal' ? '307' : '327'}
            fontSize="24"
            className="pointer-events-none"
          >
            🐱
          </text>
        </svg>

        {/* Following Paw Cursor */}
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-75 text-2xl drop-shadow-md"
          style={{ left: `${pawPos.x}px`, top: `${pawPos.y}px` }}
        >
          🐾
        </div>

        <div className="absolute bottom-2 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-slate-700 shadow-xs border border-amber-300">
          💡 흰색 길을 따라서 아기 고양이(🐱)에게 도착해보세요!
        </div>
      </div>
    </GameModalWrapper>
  );
};
