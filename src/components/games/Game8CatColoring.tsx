import React, { useState, useRef } from 'react';
import { Download, RotateCcw, Palette } from 'lucide-react';
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

const PALETTE = [
  { name: '딸기 핑크', color: '#FDA4AF' },
  { name: '햇살 노랑', color: '#FEF08A' },
  { name: '새싹 민트', color: '#A7F3D0' },
  { name: '하늘 블루', color: '#BAE6FD' },
  { name: '라벤더 퍼플', color: '#DDD6FE' },
  { name: '따뜻 주황', color: '#FDBA74' },
  { name: '초콜릿 브라운', color: '#D97706' },
  { name: '순백 화이트', color: '#FFFFFF' },
];

export const Game8CatColoring: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onGameComplete,
  onClose,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [rewardData, setRewardData] = useState({ earnedChoco: 0, earnedExp: 0, isFirstClear: false });
  const [activeColor, setActiveColor] = useState(PALETTE[0].color);

  // Region colors
  const [colors, setColors] = useState<{ [key: string]: string }>({
    bg: '#F8FAFC',
    head: '#FFFFFF',
    ears: '#FFFFFF',
    innerEars: '#FECDD3',
    body: '#FFFFFF',
    belly: '#FFFFFF',
    ribbon: '#FFFFFF',
    cheeks: '#FB7185',
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleStart = () => {
    setScore(0);
    setGameState('playing');
  };

  const handleRestart = () => {
    setColors({
      bg: '#F8FAFC',
      head: '#FFFFFF',
      ears: '#FFFFFF',
      innerEars: '#FECDD3',
      body: '#FFFFFF',
      belly: '#FFFFFF',
      ribbon: '#FFFFFF',
      cheeks: '#FB7185',
    });
    handleStart();
  };

  const handleFillRegion = (regionKey: string) => {
    sound.playPop();
    setColors((prev) => ({
      ...prev,
      [regionKey]: activeColor,
    }));
    setScore((prev) => prev + 15);
  };

  const handleCompleteColoring = () => {
    sound.playVictory();
    sound.playStar(2);
    const finalScore = Math.max(120, score);
    setScore(finalScore);
    const calcStars = 3;
    setStars(calcStars);
    const rewards = onGameComplete(8, difficulty, finalScore, calcStars);
    setRewardData(rewards);
    setGameState('victory');
  };

  const downloadPNG = () => {
    if (!svgRef.current) return;
    sound.playChoco();

    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(image, 0, 0, 600, 600);
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = '냥냥이_컴놀이터_색칠작품.png';
        downloadLink.href = pngURL;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  return (
    <GameModalWrapper
      title="고양이 색칠놀이"
      gameNumber={8}
      icon="🎨"
      subtitle="원하는 물감 색을 고른 뒤 고양이 그림의 영역을 콕! 찍어 예쁘게 색칠해보세요. 완성된 그림은 PNG 파일로 컴퓨터에 저장할 수 있어요!"
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      score={score}
      targetScore={100}
      gameState={gameState}
      stars={stars}
      earnedChoco={rewardData.earnedChoco}
      earnedExp={rewardData.earnedExp}
      isFirstClear={rewardData.isFirstClear}
      onStart={handleStart}
      onRestart={handleRestart}
      onClose={onClose}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl select-none">
        {/* Coloring Canvas Frame */}
        <div className="relative p-2 bg-white rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 400 400"
            className="w-72 h-72 md:w-84 md:h-84 cursor-pointer"
          >
            {/* Background Rect */}
            <rect
              x="0"
              y="0"
              width="400"
              height="400"
              fill={colors.bg}
              onClick={() => handleFillRegion('bg')}
            />

            {/* Cat Ears */}
            <polygon
              points="110,130 150,50 170,120"
              fill={colors.ears}
              stroke="#1E293B"
              strokeWidth="6"
              strokeLinejoin="round"
              onClick={() => handleFillRegion('ears')}
            />
            <polygon
              points="120,120 150,65 160,115"
              fill={colors.innerEars}
              onClick={() => handleFillRegion('innerEars')}
            />

            <polygon
              points="290,130 250,50 230,120"
              fill={colors.ears}
              stroke="#1E293B"
              strokeWidth="6"
              strokeLinejoin="round"
              onClick={() => handleFillRegion('ears')}
            />
            <polygon
              points="280,120 250,65 240,115"
              fill={colors.innerEars}
              onClick={() => handleFillRegion('innerEars')}
            />

            {/* Body */}
            <ellipse
              cx="200"
              cy="270"
              rx="90"
              ry="75"
              fill={colors.body}
              stroke="#1E293B"
              strokeWidth="6"
              onClick={() => handleFillRegion('body')}
            />

            {/* Belly */}
            <ellipse
              cx="200"
              cy="285"
              rx="55"
              ry="48"
              fill={colors.belly}
              stroke="#1E293B"
              strokeWidth="4"
              strokeDasharray="4 4"
              onClick={() => handleFillRegion('belly')}
            />

            {/* Head */}
            <circle
              cx="200"
              cy="160"
              r="75"
              fill={colors.head}
              stroke="#1E293B"
              strokeWidth="6"
              onClick={() => handleFillRegion('head')}
            />

            {/* Cheeks */}
            <ellipse
              cx="145"
              cy="175"
              rx="12"
              ry="8"
              fill={colors.cheeks}
              onClick={() => handleFillRegion('cheeks')}
            />
            <ellipse
              cx="255"
              cy="175"
              rx="12"
              ry="8"
              fill={colors.cheeks}
              onClick={() => handleFillRegion('cheeks')}
            />

            {/* Eyes */}
            <circle cx="165" cy="155" r="9" fill="#0F172A" />
            <circle cx="162" cy="152" r="3" fill="#FFFFFF" />
            <circle cx="235" cy="155" r="9" fill="#0F172A" />
            <circle cx="232" cy="152" r="3" fill="#FFFFFF" />

            {/* Nose & Mouth */}
            <polygon points="195,172 205,172 200,178" fill="#F43F5E" />
            <path
              d="M 190 180 Q 200 186 200 178 Q 200 186 210 180"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Whiskers */}
            <line x1="135" y1="170" x2="95" y2="165" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="135" y1="180" x2="92" y2="185" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="265" y1="170" x2="305" y2="165" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="265" y1="180" x2="308" y2="185" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

            {/* Bowtie Ribbon */}
            <g onClick={() => handleFillRegion('ribbon')}>
              <polygon points="200,235 175,220 175,250" fill={colors.ribbon} stroke="#1E293B" strokeWidth="4" />
              <polygon points="200,235 225,220 225,250" fill={colors.ribbon} stroke="#1E293B" strokeWidth="4" />
              <circle cx="200" cy="235" r="9" fill={colors.ribbon} stroke="#1E293B" strokeWidth="4" />
            </g>

            {/* Paws */}
            <ellipse cx="170" cy="335" rx="18" ry="12" fill={colors.body} stroke="#1E293B" strokeWidth="4" />
            <ellipse cx="230" cy="335" rx="18" ry="12" fill={colors.body} stroke="#1E293B" strokeWidth="4" />
          </svg>
        </div>

        {/* Right Palette & Actions */}
        <div className="flex flex-col gap-4 w-full md:w-64">
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-3">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>물감 팔레트 (색을 선택하세요!)</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {PALETTE.map((item) => (
                <button
                  key={item.color}
                  onClick={() => {
                    sound.playPop();
                    setActiveColor(item.color);
                  }}
                  className={`w-11 h-11 rounded-full border-3 transition-transform hover:scale-115 active:scale-95 shadow-xs flex items-center justify-center ${
                    activeColor === item.color
                      ? 'border-slate-800 scale-115 ring-2 ring-amber-400'
                      : 'border-white'
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.name}
                >
                  {activeColor === item.color && <span className="text-xs">🖌️</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCompleteColoring}
              className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-white font-black text-sm rounded-2xl shadow-md border-2 border-teal-600 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>🎉 색칠 완성하고 보상 받기!</span>
            </button>
            <button
              onClick={downloadPNG}
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-2xl shadow-sm border border-sky-600 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>PNG 그림 파일로 컴퓨터에 저장</span>
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-2xl border border-slate-200 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>처음부터 다시 색칠하기</span>
            </button>
          </div>
        </div>
      </div>
    </GameModalWrapper>
  );
};
