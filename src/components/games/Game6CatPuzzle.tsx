import React, { useState, useEffect } from 'react';
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

interface Piece {
  id: number;
  correctSlot: number;
  label: string;
  icon: string;
  color: string;
}

export const Game6CatPuzzle: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [placedPieces, setPlacedPieces] = useState<Record<number, Piece>>({});
  const [unplacedPieces, setUnplacedPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const config = {
    easy: { count: 4, gridCols: 2, maxTime: 45, targetScore: 100 },
    normal: { count: 6, gridCols: 3, maxTime: 40, targetScore: 150 },
    hard: { count: 9, gridCols: 3, maxTime: 35, targetScore: 200 },
  }[difficulty];

  const PUZZLE_DATA: Piece[] = [
    { id: 0, correctSlot: 0, label: '고양이 왼쪽 귀', icon: '🐱👂', color: '#FDBA74' },
    { id: 1, correctSlot: 1, label: '고양이 오른쪽 귀', icon: '👂✨', color: '#FB923C' },
    { id: 2, correctSlot: 2, label: '초롱초롱 눈', icon: '👀💖', color: '#FED7AA' },
    { id: 3, correctSlot: 3, label: '빨간 나비 리본', icon: '🎀✨', color: '#FECDD3' },
    { id: 4, correctSlot: 4, label: '말랑 분홍 젤리발', icon: '🐾', color: '#FCE7F3' },
    { id: 5, correctSlot: 5, label: '달콤 딸기 간식', icon: '🍓', color: '#FFE4E6' },
    { id: 6, correctSlot: 6, label: '싱싱한 참치캔', icon: '🥫', color: '#CFFAFE' },
    { id: 7, correctSlot: 7, label: '살랑살랑 꼬리', icon: '🐈', color: '#E0E7FF' },
    { id: 8, correctSlot: 8, label: '빛나는 황금 방울', icon: '🔔', color: '#FEF08A' },
  ];

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setPlacedPieces({});
    setSelectedPiece(null);

    // Take count pieces and shuffle them
    const piecesToUse = PUZZLE_DATA.slice(0, config.count);
    const shuffled = [...piecesToUse].sort(() => Math.random() - 0.5);
    setUnplacedPieces(shuffled);
    setGameState('playing');
  };

  const handleRestart = () => {
    handleStart();
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleSelectPiece = (piece: Piece) => {
    sound.playPop();
    setSelectedPiece(piece);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (!selectedPiece) return;

    if (selectedPiece.correctSlot === slotIdx) {
      sound.playChoco();
      sound.playStar(1);

      const newPlaced = { ...placedPieces, [slotIdx]: selectedPiece };
      setPlacedPieces(newPlaced);
      setUnplacedPieces((prev) => prev.filter((p) => p.id !== selectedPiece.id));
      setSelectedPiece(null);

      const currentPlacedCount = Object.keys(newPlaced).length;
      const points = 25;
      setScore((prev) => prev + points);

      if (currentPlacedCount === config.count) {
        sound.playVictory();
        const finalScore = config.count * 25 + timeLeft * 3;
        setScore(finalScore);
        const calcStars = timeLeft > 15 ? 3 : 2;
        setStars(calcStars);
        const rewards = onGameComplete(6, difficulty, finalScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      }
    } else {
      sound.playMiss();
    }
  };

  return (
    <GameModalWrapper
      title="고양이 퍼즐"
      gameNumber={6}
      icon="🧩"
      subtitle="흩어진 퍼즐 조각을 마우스로 클릭하여 알맞은 자리의 틀에 맞춰보세요! 완성된 아기 고양이 그림이 나타나요."
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
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 select-none max-w-3xl">
        {/* Left: Target Puzzle Board */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-700 mb-2">
            🖼️ 퍼즐 완성판 (빈칸을 클릭하세요!)
          </span>
          <div
            className="grid gap-2 p-3 bg-amber-100 rounded-2xl border-4 border-amber-300 shadow-md"
            style={{
              gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
              width: config.gridCols === 2 ? '220px' : '310px',
            }}
          >
            {Array.from({ length: config.count }).map((_, slotIdx) => {
              const placed = placedPieces[slotIdx];
              return (
                <div
                  key={slotIdx}
                  onClick={() => handleSlotClick(slotIdx)}
                  className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    placed
                      ? 'border-amber-400 shadow-xs'
                      : selectedPiece?.correctSlot === slotIdx
                      ? 'border-dashed border-teal-500 bg-teal-50/80 animate-pulse'
                      : 'border-dashed border-slate-300 bg-white/70 hover:bg-white'
                  }`}
                  style={{ backgroundColor: placed ? placed.color : undefined }}
                >
                  {placed ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">{placed.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 mt-1">
                        {placed.label}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 font-bold text-xs">
                      #{slotIdx + 1} 조각 자리
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unplaced Pieces Tray */}
        <div className="flex-1 max-w-xs flex flex-col items-center">
          <span className="text-xs font-bold text-teal-800 mb-2">
            🧩 남은 퍼즐 조각 (클릭하여 선택!)
          </span>
          <div className="grid grid-cols-2 gap-2.5 p-3 w-full bg-teal-50/90 rounded-2xl border-3 border-teal-200 min-h-[160px]">
            {unplacedPieces.map((piece) => (
              <button
                key={piece.id}
                onClick={() => handleSelectPiece(piece)}
                className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedPiece?.id === piece.id
                    ? 'border-amber-500 bg-amber-200 shadow-md scale-105 ring-2 ring-amber-400'
                    : 'border-slate-200 bg-white hover:border-teal-400 hover:scale-102'
                }`}
              >
                <span className="text-2xl">{piece.icon}</span>
                <span className="text-[11px] font-bold text-slate-700 mt-1">
                  {piece.label}
                </span>
              </button>
            ))}
            {unplacedPieces.length === 0 && (
              <div className="col-span-2 flex items-center justify-center text-teal-700 font-bold text-sm py-8">
                ✨ 모든 조각을 맞췄어요!
              </div>
            )}
          </div>
        </div>
      </div>
    </GameModalWrapper>
  );
};
