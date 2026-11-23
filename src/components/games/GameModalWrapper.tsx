import React from 'react';
import { ArrowLeft, RotateCcw, Star, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameDifficulty } from '../../types';
import { sound } from '../../utils/sound';

interface GameModalWrapperProps {
  title: string;
  gameNumber: number;
  icon: string;
  subtitle: string;
  difficulty: GameDifficulty;
  onDifficultyChange: (diff: GameDifficulty) => void;
  score: number;
  targetScore?: number;
  timeLeft?: number;
  maxTime?: number;
  gameState: 'intro' | 'playing' | 'gameover' | 'victory';
  stars: number;
  earnedChoco: number;
  earnedExp: number;
  isFirstClear: boolean;
  onStart: () => void;
  onRestart: () => void;
  onClose: () => void;
  maxWidthClass?: string;
  stagePaddingClass?: string;
  children: React.ReactNode;
}

export const GameModalWrapper: React.FC<GameModalWrapperProps> = ({
  title,
  gameNumber,
  icon,
  subtitle,
  difficulty,
  onDifficultyChange,
  score,
  targetScore,
  timeLeft,
  maxTime,
  gameState,
  stars,
  earnedChoco,
  earnedExp,
  isFirstClear,
  onStart,
  onRestart,
  onClose,
  maxWidthClass,
  stagePaddingClass,
  children,
}) => {
  const [muted, setMuted] = React.useState(sound.isMuted);

  const toggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA'],
    });
  };

  React.useEffect(() => {
    if (gameState === 'victory') {
      sound.playVictory();
      triggerConfetti();
    } else if (gameState === 'gameover') {
      sound.playMiss();
    }
  }, [gameState]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className={`relative w-full ${maxWidthClass || 'max-w-4xl'} max-h-[96vh] flex flex-col bg-[#FDFBF7] rounded-3xl border-4 border-amber-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
        {/* Game Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-amber-100 via-rose-50 to-teal-100 border-b-2 border-amber-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 text-sm font-bold rounded-2xl border-2 border-slate-200 shadow-xs hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>놀이터로</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl p-1 bg-white/80 rounded-2xl shadow-xs">{icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-800 rounded-lg">
                    게임 {gameNumber}
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
                </div>
                <p className="text-xs text-slate-500">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 shadow-xs"
              title={muted ? '소리 켜기' : '소리 끄기'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
            </button>
          </div>
        </div>

        {/* HUD Sub-Bar while playing */}
        {gameState === 'playing' && (
          <div className="flex items-center justify-between px-6 py-2 bg-amber-50/80 border-b border-amber-200 shrink-0 text-slate-700 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-600">
                난이도: <span className="text-amber-700 font-extrabold">{difficulty === 'easy' ? '쉬움' : difficulty === 'normal' ? '보통' : '어려움'}</span>
              </span>
              <span className="font-bold text-teal-700">
                현재 점수: <span className="text-lg font-extrabold">{score}</span> {targetScore ? `/ ${targetScore}` : '점'}
              </span>
            </div>

            {timeLeft !== undefined && maxTime !== undefined && (
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-600">남은 시간:</span>
                <div className="w-28 md:w-32 h-3.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <div
                    className={`h-full transition-all duration-300 ${
                      timeLeft < 5 ? 'bg-red-500 animate-pulse' : timeLeft < 10 ? 'bg-amber-400' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.max(0, (timeLeft / maxTime) * 100)}%` }}
                  />
                </div>
                <span className={`font-mono font-bold text-sm ${timeLeft < 5 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                  {timeLeft}초
                </span>
              </div>
            )}
          </div>
        )}

        {/* Game Stage Area */}
        <div className={`relative flex-1 ${stagePaddingClass || 'p-4 md:p-6'} overflow-y-auto flex flex-col items-center justify-start min-h-[360px]`}>
          {/* Intro Screen */}
          {gameState === 'intro' && (
            <div className="flex flex-col items-center justify-center max-w-lg text-center p-6 bg-white rounded-3xl border-3 border-amber-200 shadow-md">
              <div className="text-6xl mb-3 animate-bounce">{icon}</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-base text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
                {subtitle}
              </p>

              <div className="w-full mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="block text-sm font-bold text-amber-800 mb-2.5">
                  도전할 난이도를 골라주세요!
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'normal', 'hard'] as GameDifficulty[]).map((diff) => {
                    const label = diff === 'easy' ? '🌱 쉬움' : diff === 'normal' ? '🌸 보통' : '🔥 어려움';
                    const rewardText = diff === 'easy' ? '초코 5개' : diff === 'normal' ? '초코 10개' : '초코 15개';
                    return (
                      <button
                        key={diff}
                        onClick={() => {
                          sound.playPop();
                          onDifficultyChange(diff);
                        }}
                        className={`py-2 px-1 rounded-xl text-sm font-bold border-2 transition-all ${
                          difficulty === diff
                            ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>{label}</div>
                        <div className="text-[11px] opacity-80 mt-0.5">{rewardText}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playPop();
                  onStart();
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-extrabold text-xl rounded-2xl shadow-lg border-2 border-amber-500 hover:scale-105 active:scale-95 transition-all"
              >
                🎮 게임 시작하기!
              </button>
            </div>
          )}

          {/* Active Playing Canvas / Interaction Area */}
          {gameState === 'playing' && children}

          {/* Victory Result Modal */}
          {gameState === 'victory' && (
            <div className="flex flex-col items-center justify-center max-w-md text-center p-6 bg-white rounded-3xl border-4 border-amber-300 shadow-2xl animate-in zoom-in-90 duration-300">
              <div className="text-5xl mb-2 animate-bounce">🎉 냥냥 대성공! 🎉</div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">참 잘했어요!</h3>
              <p className="text-sm text-slate-600 mb-4">멋진 컴퓨터 실력을 뽐냈어요!</p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-10 h-10 transition-transform ${
                      starIdx <= stars
                        ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-md animate-pulse'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Reward Box */}
              <div className="w-full p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 mb-5 text-left">
                <div className="flex items-center justify-between py-1 text-slate-700">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="text-xl">🏆</span> 최종 점수:
                  </span>
                  <span className="font-extrabold text-lg text-slate-800">{score}점</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-700">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="text-xl">🍫</span> 획득한 초코:
                  </span>
                  <span className="font-extrabold text-lg text-amber-700 animate-choco-bounce">
                    +{earnedChoco}개
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-700">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="text-xl">⭐</span> 획득한 경험치:
                  </span>
                  <span className="font-extrabold text-lg text-teal-700">+{earnedExp} EXP</span>
                </div>
                {isFirstClear && (
                  <div className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>최초 클리어 보너스 초코 +5개가 추가되었어요!</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => {
                    sound.playPop();
                    onRestart();
                  }}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 하기</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    onClose();
                  }}
                  className="py-3 px-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl border-2 border-teal-600 shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>메인으로 가기</span>
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="flex flex-col items-center justify-center max-w-md text-center p-6 bg-white rounded-3xl border-4 border-rose-200 shadow-xl">
              <div className="text-5xl mb-2 animate-pulse">😿 아쉬워요!</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">조금만 더 힘내봐요!</h3>
              <p className="text-sm text-slate-600 mb-4">시간이 다 되었거나 아쉽게 목표를 놓쳤어요.</p>

              <div className="w-full p-4 bg-rose-50 rounded-2xl border border-rose-200 mb-5">
                <div className="text-slate-700 font-bold">
                  기록한 점수: <span className="text-xl font-extrabold text-rose-600">{score}점</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">다시 도전하면 더 잘할 수 있어요!</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => {
                    sound.playPop();
                    onRestart();
                  }}
                  className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl border-2 border-amber-500 shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 도전하기</span>
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    onClose();
                  }}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>돌아가기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
