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

interface CommandAction {
  id: string;
  name: string;
  icon: string;
}

const COMMANDS: CommandAction[] = [
  { id: 'pet', name: '부드럽게 쓰다듬기', icon: '✋' },
  { id: 'snack', name: '맛있는 츄르 주기', icon: '🥫' },
  { id: 'play', name: '털실공 던지기', icon: '🧶' },
  { id: 'nap', name: '포근한 낮잠 재우기', icon: '💤' },
  { id: 'praise', name: '최고라고 칭찬하기', icon: '💖' },
];

export const Game9ContextMenu: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);
  const [targetCmd, setTargetCmd] = useState<CommandAction>(COMMANDS[0]);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [leftClickHint, setLeftClickHint] = useState(false);
  const [happyReaction, setHappyReaction] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { totalRounds: 5, maxTime: 35 },
    normal: { totalRounds: 8, maxTime: 30 },
    hard: { totalRounds: 12, maxTime: 25 },
  }[difficulty];

  const pickNewTarget = () => {
    const picked = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
    setTargetCmd(picked);
    setMenuPos(null);
  };

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setRound(1);
    pickNewTarget();
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

  const handleCatContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    sound.playPop();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMenuPos({ x: Math.min(x, 320), y: Math.min(y, 160) });
    setLeftClickHint(false);
  };

  const handleCatLeftClick = () => {
    sound.playMiss();
    setLeftClickHint(true);
    setTimeout(() => setLeftClickHint(false), 1200);
  };

  const handleSelectMenuItem = (cmd: CommandAction) => {
    setMenuPos(null);

    if (cmd.id === targetCmd.id) {
      sound.playMeow();
      sound.playChoco();
      sound.playStar(1);

      setHappyReaction(`${cmd.name} 성공! 야옹~💖`);
      setTimeout(() => setHappyReaction(null), 1000);

      const newScore = score + 25;
      setScore(newScore);

      if (round >= config.totalRounds) {
        clearInterval(timerRef.current!);
        const calcStars = timeLeft > 10 ? 3 : 2;
        setStars(calcStars);
        const rewards = onGameComplete(9, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      } else {
        setRound((prev) => prev + 1);
        pickNewTarget();
      }
    } else {
      sound.playMiss();
    }
  };

  return (
    <GameModalWrapper
      title="냥냥이 메뉴 선택"
      gameNumber={9}
      icon="🖱️"
      subtitle="고양이를 마우스 '오른쪽 버튼'으로 콕 누르면 나타나는 특별 메뉴에서 지시된 명령을 선택하세요! 마우스 우클릭 연습이에요."
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      score={score}
      targetScore={config.totalRounds * 25}
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
      <div className="w-full flex flex-col items-center select-none max-w-xl">
        {/* Mission Notice Banner */}
        <div className="w-full p-4 mb-4 bg-gradient-to-r from-amber-100 to-rose-100 rounded-2xl border-3 border-amber-300 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1 bg-white rounded-xl shadow-xs">{targetCmd.icon}</span>
            <div>
              <div className="text-xs font-bold text-amber-800">
                [미션 {round} / {config.totalRounds}]
              </div>
              <div className="text-base font-extrabold text-slate-800">
                고양이를 <span className="text-rose-600 font-black">마우스 우클릭</span>하여{' '}
                <span className="underline decoration-amber-400 font-black text-rose-600">
                  [{targetCmd.name}]
                </span>
                을(를) 누르세요!
              </div>
            </div>
          </div>
        </div>

        {/* Play Stage */}
        <div
          onContextMenu={handleCatContextMenu}
          onClick={handleCatLeftClick}
          className="relative w-full h-[320px] bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl border-4 border-amber-300 shadow-inner flex flex-col items-center justify-center cursor-context-menu overflow-hidden"
        >
          {/* Reaction speech bubble */}
          {happyReaction && (
            <div className="absolute top-6 z-40 bg-pink-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm animate-bounce">
              {happyReaction}
            </div>
          )}

          {/* Left click hint warning */}
          {leftClickHint && (
            <div className="absolute top-6 z-40 bg-amber-400 text-amber-950 font-black px-4 py-1.5 rounded-full shadow-lg text-xs animate-bounce border-2 border-amber-600">
              👉 왼쪽이 아니라 마우스의 '오른쪽' 버튼을 눌러보세요!
            </div>
          )}

          {/* Center Cat */}
          <div className="flex flex-col items-center pointer-events-none">
            <div className="text-8xl animate-float-gentle filter drop-shadow-md">🐱</div>
            <div className="mt-2 text-xs font-black text-amber-800 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-amber-200">
              마우스 오른쪽 버튼으로 눌러주세요!
            </div>
          </div>

          {/* Custom Pop-up Context Menu */}
          {menuPos && (
            <div
              className="absolute z-50 bg-white/95 backdrop-blur-md rounded-2xl border-3 border-amber-400 shadow-2xl p-1.5 min-w-[190px] animate-in zoom-in-95 duration-150"
              style={{ left: `${menuPos.x}px`, top: `${menuPos.y}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 text-[11px] font-black text-amber-900 border-b border-amber-200 bg-amber-50 rounded-xl mb-1 flex items-center justify-between">
                <span>냥냥이 메뉴</span>
                <span className="text-[10px] text-amber-600 font-bold">선택하기</span>
              </div>
              <div className="flex flex-col gap-1">
                {COMMANDS.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelectMenuItem(cmd)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                      cmd.id === targetCmd.id
                        ? 'bg-amber-200 text-amber-950 font-black hover:bg-amber-300 ring-2 ring-amber-400'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{cmd.icon}</span>
                    <span>{cmd.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameModalWrapper>
  );
};
