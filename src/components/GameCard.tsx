import React from 'react';
import { Star, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { GameRecord } from '../types';
import { sound } from '../utils/sound';

export interface GameCardProps {
  id?: number;
  title: string;
  categoryTag?: string;
  description: string;
  imageSrc?: string;
  fallbackSvg?: React.ReactNode;
  tapeColor?: 'yellow' | 'pink' | 'mint' | 'peach' | 'lavender' | 'blue';
  cardBgColor: string; // e.g. 'bg-[#FFFDF5] border-[#FDE68A]'
  stats?: {
    easy?: GameRecord;
    normal?: GameRecord;
    hard?: GameRecord;
  };
  onClick: () => void;
  badgeText?: string;
}

const TAPE_STYLES: Record<string, { bg: string; border: string; pattern: string }> = {
  yellow: {
    bg: 'bg-amber-200/90 text-amber-900',
    border: 'border-amber-300',
    pattern: 'border-dashed border-amber-400/80',
  },
  pink: {
    bg: 'bg-rose-200/90 text-rose-900',
    border: 'border-rose-300',
    pattern: 'border-dotted border-rose-400/80',
  },
  mint: {
    bg: 'bg-teal-200/90 text-teal-900',
    border: 'border-teal-300',
    pattern: 'border-dashed border-teal-400/80',
  },
  peach: {
    bg: 'bg-orange-200/90 text-orange-900',
    border: 'border-orange-300',
    pattern: 'border-dashed border-orange-400/80',
  },
  lavender: {
    bg: 'bg-purple-200/90 text-purple-900',
    border: 'border-purple-300',
    pattern: 'border-dotted border-purple-400/80',
  },
  blue: {
    bg: 'bg-sky-200/90 text-sky-900',
    border: 'border-sky-300',
    pattern: 'border-dashed border-sky-400/80',
  },
};

export const GameCard: React.FC<GameCardProps> = ({
  title,
  categoryTag,
  description,
  imageSrc,
  fallbackSvg,
  tapeColor = 'yellow',
  cardBgColor,
  stats,
  onClick,
  badgeText,
}) => {
  const tape = TAPE_STYLES[tapeColor] || TAPE_STYLES.yellow;

  // Stages calculation
  const easyCompleted = Boolean(stats?.easy?.completed);
  const easyStars = stats?.easy?.stars || 0;

  const normalCompleted = Boolean(stats?.normal?.completed);
  const normalStars = stats?.normal?.stars || 0;
  // Stage 2 is unlocked if Stage 1 is cleared or if player already played it
  const normalUnlocked = easyCompleted || normalCompleted || (stats?.normal?.bestScore ?? 0) > 0;

  const hardCompleted = Boolean(stats?.hard?.completed);
  const hardStars = stats?.hard?.stars || 0;
  // Stage 3 is unlocked if Stage 2 is cleared
  const hardUnlocked = normalCompleted || hardCompleted || (stats?.hard?.bestScore ?? 0) > 0;

  const isAllCleared = easyCompleted && normalCompleted && hardCompleted;
  const isAnyCleared = easyCompleted || normalCompleted || hardCompleted;

  return (
    <div
      onClick={() => {
        sound.playPop();
        onClick();
      }}
      className={`group relative flex flex-col justify-between rounded-[28px] border-3 shadow-md hover:shadow-2xl transition-all duration-200 hover:-translate-y-1.5 cursor-pointer select-none overflow-visible p-4 ${cardBgColor}`}
    >
      {/* 1. Masking Tape Decoration at Top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div
          className={`h-6 px-4 flex items-center justify-center rounded-xs shadow-xs border-t border-b ${tape.bg} ${tape.border} transform -rotate-1 group-hover:rotate-1 transition-transform`}
        >
          <span className="text-[10px] font-black tracking-wider opacity-85">
            {badgeText || '★ 냥냥 놀이터 ★'}
          </span>
        </div>
      </div>

      <div>
        {/* 2. 4:3 Fairytale Illustration Container */}
        <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-black/10 shadow-inner bg-amber-50/50 mb-3.5">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // If local image fails, hide image element so fallbackSvg or styled background shows
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : fallbackSvg ? (
            <div className="w-full h-full flex items-center justify-center">
              {fallbackSvg}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-100 to-rose-100 text-amber-900">
              <span className="text-5xl mb-1">🐾</span>
              <span className="text-xs font-black">{title}</span>
            </div>
          )}

          {/* Cleared Stamp Ribbon */}
          {isAllCleared ? (
            <div className="absolute top-2 right-2 px-2.5 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-md border border-amber-500 flex items-center gap-1 animate-pulse">
              <span>💮</span>
              <span>모두 완료!</span>
            </div>
          ) : isAnyCleared ? (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/95 text-teal-800 font-black text-[11px] rounded-full shadow-xs border border-teal-200 flex items-center gap-1">
              <span>✨</span>
              <span>클리어 중</span>
            </div>
          ) : null}
        </div>

        {/* 3. Game Title (22~26px) & Description (15~17px) */}
        <div className="px-1">
          {categoryTag && (
            <div className="text-[12px] font-black text-amber-800/80 mb-0.5 flex items-center gap-1">
              <span>🐾</span>
              <span>{categoryTag}</span>
            </div>
          )}
          <h3 className="text-[22px] md:text-[24px] font-black text-slate-800 tracking-tight leading-snug group-hover:text-amber-900 transition-colors">
            {title}
          </h3>
          <p className="text-[15px] md:text-[16px] font-bold text-slate-600 mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* 4. Bottom Stages & Completion Status (1단계 별점 / 2단계 잠금 / 3단계 잠금) */}
      <div className="mt-4 pt-3 border-t-2 border-black/5 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {/* Stage 1: 쉬움 */}
          <div className="p-1.5 bg-white/90 rounded-xl border border-black/5 shadow-2xs flex flex-col items-center">
            <span className="text-[11px] font-black text-slate-500">1단계</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= easyStars
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stage 2: 보통 */}
          <div
            className={`p-1.5 rounded-xl border shadow-2xs flex flex-col items-center ${
              normalUnlocked
                ? 'bg-white/90 border-black/5 text-slate-700'
                : 'bg-slate-100/80 border-slate-200 text-slate-400'
            }`}
          >
            <span className="text-[11px] font-black">2단계</span>
            {normalUnlocked ? (
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= normalStars
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-slate-400">
                <Lock className="w-3 h-3" />
                <span>잠김</span>
              </div>
            )}
          </div>

          {/* Stage 3: 어려움 */}
          <div
            className={`p-1.5 rounded-xl border shadow-2xs flex flex-col items-center ${
              hardUnlocked
                ? 'bg-white/90 border-black/5 text-slate-700'
                : 'bg-slate-100/80 border-slate-200 text-slate-400'
            }`}
          >
            <span className="text-[11px] font-black">3단계</span>
            {hardUnlocked ? (
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= hardStars
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-slate-400">
                <Lock className="w-3 h-3" />
                <span>잠김</span>
              </div>
            )}
          </div>
        </div>

        {/* Play Action Button */}
        <div className="mt-1 w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-xl border-2 border-amber-500 shadow-xs flex items-center justify-center gap-1.5 group-hover:scale-102 active:scale-95 transition-all">
          <Play className="w-4 h-4 fill-amber-950" />
          <span>신나게 시작하기!</span>
        </div>
      </div>
    </div>
  );
};
