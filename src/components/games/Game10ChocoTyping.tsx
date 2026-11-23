import React, { useState, useEffect, useRef } from 'react';
import { GameDifficulty } from '../../types';
import { GameModalWrapper } from './GameModalWrapper';
import { sound } from '../../utils/sound';
import {
  getNextKeystrokeGuide,
  decomposeToKeystrokes,
  KeyGuideInfo,
  JAMO_KEY_MAP,
} from '../../utils/hangul';
import { KoreanKeyboardWithHands } from '../KoreanKeyboardWithHands';
import { Sparkles, AlertCircle } from 'lucide-react';

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

const WORDS_BY_DIFF = {
  easy: ['하늘', '나비', '우유', '바다', '구름', '별빛', '치즈', '모자', '사과', '초코', '딸기', '방울'],
  normal: ['고양이', '컴퓨터', '물고기', '발바닥', '장난감', '무지개', '놀이터', '초콜릿', '선물상자', '왕관'],
  hard: ['아기고양이', '컴퓨터박사', '생선바구니', '은하수별빛', '초코놀이터', '반짝발자국', '달콤디저트'],
};

export const Game10ChocoTyping: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentWordList, setCurrentWordList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [correctCount, setCorrectCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [wrongKeyId, setWrongKeyId] = useState<string | null>(null);

  // Animal speed tiers matching 초코마에 타자 reference (image_3218806b.png)
  const ANIMAL_TIERS = [
    { cpm: 0, label: '0타', name: '달팽이', emoji: '🐌' },
    { cpm: 5, label: '5타', name: '거북이', emoji: '🐢' },
    { cpm: 10, label: '10타', name: '병아리', emoji: '🐥' },
    { cpm: 15, label: '15타', name: '쥐', emoji: '🐭' },
    { cpm: 20, label: '20타', name: '닭', emoji: '🐔' },
    { cpm: 25, label: '25타', name: '돼지', emoji: '🐷' },
    { cpm: 30, label: '30타', name: '고양이', emoji: '🐱' },
    { cpm: 40, label: '40타', name: '사슴', emoji: '🦌' },
    { cpm: 50, label: '50타', name: '캥거루', emoji: '🦘' },
    { cpm: 60, label: '60타', name: '토끼', emoji: '🐰' },
    { cpm: 70, label: '70타', name: '늑대', emoji: '🐺' },
    { cpm: 80, label: '80타', name: '얼룩말', emoji: '🦓' },
    { cpm: 90, label: '90타', name: '타조', emoji: '🦤' },
    { cpm: 100, label: '100타', name: '사자', emoji: '🦁' },
    { cpm: 110, label: '110타', name: '치타', emoji: '🐆' },
  ];

  // IME composition tracking to prevent duplicate scoring or premature submission
  const isComposingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrongTimerRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    easy: { wordCount: 6, maxTime: 45, targetScore: 150 },
    normal: { wordCount: 8, maxTime: 40, targetScore: 200 },
    hard: { wordCount: 10, maxTime: 35, targetScore: 250 },
  }[difficulty];

  // Calculate current CPM (Characters Per Minute)
  const elapsedSeconds = Math.max(1, config.maxTime - timeLeft);
  const currentCpm = Math.round((totalKeystrokes / elapsedSeconds) * 60);

  // Track physical keypresses for visual keyboard response & wrong-key feedback
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      // Soft typing clack sound
      sound.playPop();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(config.maxTime);
    setCorrectCount(0);
    setUserInput('');
    setWrongKeyId(null);
    isComposingRef.current = false;

    // Pick words for round
    const all = WORDS_BY_DIFF[difficulty];
    const picked = [...all].sort(() => Math.random() - 0.5).slice(0, config.wordCount);
    setCurrentWordList(picked);
    setWordIndex(0);
    setGameState('playing');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
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

  const currentTargetWord = currentWordList[wordIndex] || '';

  // Decomposed atomic keystrokes of the target word (e.g. '하늘' -> ['ㅎ', 'ㅏ', 'ㄴ', 'ㅡ', 'ㄹ'])
  const targetKeystrokes = React.useMemo(() => {
    return decomposeToKeystrokes(currentTargetWord);
  }, [currentTargetWord]);

  // Decomposed keystrokes of current user input
  const inputKeystrokes = React.useMemo(() => {
    return decomposeToKeystrokes(userInput);
  }, [userInput]);

  // Current real-time keystroke guide (active key & active finger)
  const guideInfo: KeyGuideInfo | null = React.useMemo(() => {
    if (!currentTargetWord) return null;
    return getNextKeystrokeGuide(currentTargetWord, userInput);
  }, [currentTargetWord, userInput]);

  // Check word completion safely outside IME compose
  const checkWordCompletion = (val: string) => {
    if (val.trim() === currentTargetWord) {
      sound.playChoco();
      sound.playStar(1);

      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      const newScore = score + 25;
      setScore(newScore);
      setUserInput('');
      setWrongKeyId(null);

      if (wordIndex + 1 >= currentWordList.length) {
        clearInterval(timerRef.current!);
        const calcStars = timeLeft > 10 ? 3 : 2;
        setStars(calcStars);
        const rewards = onGameComplete(10, difficulty, newScore, calcStars);
        setRewardData(rewards);
        setGameState('victory');
      } else {
        setWordIndex((prev) => prev + 1);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 60);
      }
    }
  };

  // Handle Input Changes with IME guards
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    // If word matched, trigger completion
    if (!isComposingRef.current && val.trim() === currentTargetWord) {
      checkWordCompletion(val);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const val = (e.target as HTMLInputElement).value;
    checkWordCompletion(val);
  };

  // Virtual key press fallback (clicking on keyboard keycaps)
  const handleVirtualKeyPress = (keyId: string, ko: string) => {
    if (gameState !== 'playing') return;
    if (keyId === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      inputRef.current?.focus();
      return;
    }
    if (ko && ko.length === 1) {
      const nextVal = userInput + ko;
      setUserInput(nextVal);
      checkWordCompletion(nextVal);
      inputRef.current?.focus();
    }
  };

  return (
    <GameModalWrapper
      title="초코 타자 챌린지"
      gameNumber={10}
      icon="⌨️"
      subtitle="화면에 나타나는 한글 단어를 자판으로 또박또박 쳐보세요! 노란색 손가락이 올바른 운지법을 안내해 줘요."
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
      maxWidthClass="max-w-5xl"
      stagePaddingClass="p-2 md:p-3 justify-start"
    >
      <div className="w-full flex flex-col items-center max-w-4xl select-none">
        {/* Top Header Row matching reference image (image_3218806b.png) */}
        <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-800 text-white rounded-2xl mb-2 shadow-sm border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-rose-600 font-bold text-white tracking-wide">
              단어 {wordIndex + 1}/{currentWordList.length}
            </span>
            <span className="text-sm font-extrabold text-amber-300">
              연속 성공 타수 : <strong className="text-white text-base">{streakCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">
              현재 타속: <strong className="text-amber-400 font-black">{currentCpm}</strong> 타/분
            </span>
            <span className="text-base font-black text-amber-400 bg-slate-900/80 px-3 py-0.5 rounded-xl border border-slate-600">
              ⏱️ {timeLeft}초
            </span>
          </div>
        </div>

        {/* 1. Animal Speed Indicator Gauge (0타 달팽이 ~ 110타 치타) */}
        <div className="w-full bg-slate-900/90 py-2 px-3 rounded-2xl border border-slate-700 mb-2.5 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between min-w-[580px] gap-1 px-1">
            {ANIMAL_TIERS.map((tier) => {
              const isAchieved = currentCpm >= tier.cpm;
              const isCurrent =
                isAchieved &&
                (ANIMAL_TIERS.find((t) => t.cpm > tier.cpm)?.cpm
                  ? currentCpm < (ANIMAL_TIERS.find((t) => t.cpm > tier.cpm)?.cpm || 999)
                  : true);

              return (
                <div
                  key={tier.label}
                  className={`flex flex-col items-center px-1.5 py-1 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-amber-500/30 border border-amber-400 scale-110 shadow-xs'
                      : isAchieved
                      ? 'opacity-100'
                      : 'opacity-40 grayscale'
                  }`}
                >
                  <span className="text-base md:text-lg leading-none">{tier.emoji}</span>
                  <span
                    className={`text-[10px] font-black mt-0.5 ${
                      isCurrent
                        ? 'text-amber-300'
                        : isAchieved
                        ? 'text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {tier.label}
                  </span>
                  <span className="text-[9px] text-slate-400 scale-90">{tier.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Target Character Display Card (초코마에 타자 스타일 [ ㅁ ] ㅓ ㄴ ㅓ) */}
        <div className="w-full py-4 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700 shadow-md flex flex-col items-center justify-center mb-2.5">
          {/* Main Word Title */}
          <div className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <span>목표 단어:</span>
            <span className="text-sm font-extrabold text-white underline decoration-amber-400 decoration-2 underline-offset-4">
              {currentTargetWord}
            </span>
          </div>

          {/* Prominent Keystroke Sequence Ribbon matching reference: [ ㅁ ]  ㅓ  ㄴ  ㅓ */}
          <div className="flex items-center justify-center gap-3 my-1 font-mono">
            {guideInfo?.jamo ? (
              <div className="flex items-center text-4xl md:text-5xl font-black">
                <span className="text-yellow-400 font-extrabold select-none mr-1.5">[</span>
                <span className="px-4 py-1 bg-white text-slate-900 rounded-2xl shadow-lg border-3 border-yellow-400 font-black tracking-normal">
                  {guideInfo.jamo}
                </span>
                <span className="text-yellow-400 font-extrabold select-none ml-1.5">]</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-teal-400 animate-bounce">
                🎉 단어 완성!
              </div>
            )}

            {/* Upcoming Keystrokes in Soft Gray */}
            <div className="flex items-center gap-2.5 text-2xl md:text-3xl font-extrabold text-slate-400 tracking-wider">
              {targetKeystrokes.slice(inputKeystrokes.length + (guideInfo?.jamo ? 1 : 0)).map((jamo, idx) => (
                <span key={idx} className="opacity-60 hover:opacity-100 transition-opacity">
                  {jamo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Student Input Box */}
        <div className="w-full max-w-xl relative flex items-center mb-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="여기에 단어를 입력하세요!"
            className="w-full py-2.5 px-4 text-center text-2xl font-black text-slate-900 bg-white rounded-2xl border-3 border-teal-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all"
            autoFocus
          />
          {userInput && (
            <button
              onClick={() => {
                setUserInput('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
            >
              지우기
            </button>
          )}
        </div>

        {/* 4. Current Keystroke & Finger Guidance Ribbon */}
        <div className="w-full max-w-xl mb-2">
          {guideInfo?.isTypo ? (
            <div className="flex items-center justify-center gap-2 py-1.5 px-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs md:text-sm font-bold text-rose-700 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>틀린 글자가 있어요! <strong>[지우개(Backspace) ⌫]</strong> 키를 눌러 지워주세요!</span>
            </div>
          ) : guideInfo ? (
            <div className="flex items-center justify-between py-1.5 px-4 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-300 rounded-2xl text-xs md:text-sm font-extrabold text-amber-950 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-400 text-amber-950 rounded-lg text-xs font-black">
                  지금 칠 글자
                </span>
                <span className="text-lg text-amber-900 bg-white px-2.5 py-0.5 rounded-lg border-2 border-amber-300 font-black shadow-xs">
                  {guideInfo.jamo}
                </span>
                {guideInfo.requiresShift && (
                  <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-md font-black animate-pulse">
                    Shift 함께!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-amber-900">
                <span>🖐️ 사용 손가락:</span>
                <span className="underline decoration-amber-500 underline-offset-2 font-black text-amber-950 text-sm">
                  {guideInfo.fingerName}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1.5 px-4 bg-teal-50 border-2 border-teal-300 rounded-2xl text-xs md:text-sm font-bold text-teal-800">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span>단어가 완성되었어요! 아주 훌륭해요!</span>
            </div>
          )}
        </div>

        {/* 5. Korean Keyboard with Natural Human Hands (한글 키보드와 양손 올바른 운지법) */}
        <div className="w-full bg-slate-900/90 p-2 md:p-3 rounded-3xl border-2 border-slate-700 shadow-xl">
          <KoreanKeyboardWithHands
            targetKeyId={guideInfo?.keyId}
            activeFinger={guideInfo?.finger}
            requiresShift={guideInfo?.requiresShift}
            pressedKeys={pressedKeys}
            onVirtualKeyPress={handleVirtualKeyPress}
          />
        </div>

        {/* Friendly Tip Footnote */}
        <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-1">
          <span>💡</span>
          <span>
            화면의 양손 그림 중 노란색으로 빛나는 손가락과 노란색 글쇠를 확인하며 입력해 보세요!
          </span>
        </div>
      </div>
    </GameModalWrapper>
  );
};
