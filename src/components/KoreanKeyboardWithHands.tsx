import React, { useState } from 'react';
import { FingerId, FINGER_NAMES } from '../utils/hangul';

export interface KeyDef {
  id: string; // e.g. 'KeyA', 'KeyK', 'Digit1', 'Space', 'ShiftLeft'
  ko: string; // Korean primary letter, e.g. 'ㅁ', 'ㅏ', ''
  koShift?: string; // Double consonant, e.g. 'ㅃ', 'ㅒ'
  en: string; // English letter / symbol, e.g. 'A', '1', 'Tab'
  x: number;
  y: number;
  w: number;
  h: number;
  finger: FingerId;
}

// 5-Row Standard Korean Dubeolsik Keyboard Definitions
export const KEY_ROWS: KeyDef[][] = [
  // Row 0: Number & Symbols (~ 1 2 3 4 5 6 7 8 9 0 - = Backspace)
  [
    { id: 'Backquote', ko: '', en: '~ `', x: 20, y: 12, w: 50, h: 44, finger: 'LP' },
    { id: 'Digit1', ko: '', en: '1', x: 74, y: 12, w: 50, h: 44, finger: 'LP' },
    { id: 'Digit2', ko: '', en: '2', x: 128, y: 12, w: 50, h: 44, finger: 'LR' },
    { id: 'Digit3', ko: '', en: '3', x: 182, y: 12, w: 50, h: 44, finger: 'LM' },
    { id: 'Digit4', ko: '', en: '4', x: 236, y: 12, w: 50, h: 44, finger: 'LI' },
    { id: 'Digit5', ko: '', en: '5', x: 290, y: 12, w: 50, h: 44, finger: 'LI' },
    { id: 'Digit6', ko: '', en: '6', x: 344, y: 12, w: 50, h: 44, finger: 'RI' },
    { id: 'Digit7', ko: '', en: '7', x: 398, y: 12, w: 50, h: 44, finger: 'RI' },
    { id: 'Digit8', ko: '', en: '8', x: 452, y: 12, w: 50, h: 44, finger: 'RM' },
    { id: 'Digit9', ko: '', en: '9', x: 506, y: 12, w: 50, h: 44, finger: 'RR' },
    { id: 'Digit0', ko: '', en: '0', x: 560, y: 12, w: 50, h: 44, finger: 'RP' },
    { id: 'Minus', ko: '', en: '-', x: 614, y: 12, w: 50, h: 44, finger: 'RP' },
    { id: 'Equal', ko: '', en: '=', x: 668, y: 12, w: 50, h: 44, finger: 'RP' },
    { id: 'Backspace', ko: '', en: 'backspace', x: 722, y: 12, w: 98, h: 44, finger: 'RP' },
  ],
  // Row 1: QWERTY / ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ
  [
    { id: 'Tab', ko: '', en: 'tab', x: 20, y: 62, w: 76, h: 44, finger: 'LP' },
    { id: 'KeyQ', ko: 'ㅂ', koShift: 'ㅃ', en: 'q', x: 100, y: 62, w: 50, h: 44, finger: 'LP' },
    { id: 'KeyW', ko: 'ㅈ', koShift: 'ㅉ', en: 'w', x: 154, y: 62, w: 50, h: 44, finger: 'LR' },
    { id: 'KeyE', ko: 'ㄷ', koShift: 'ㄸ', en: 'e', x: 208, y: 62, w: 50, h: 44, finger: 'LM' },
    { id: 'KeyR', ko: 'ㄱ', koShift: 'ㄲ', en: 'r', x: 262, y: 62, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyT', ko: 'ㅅ', koShift: 'ㅆ', en: 't', x: 316, y: 62, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyY', ko: 'ㅛ', en: 'y', x: 370, y: 62, w: 50, h: 44, finger: 'RI' },
    { id: 'KeyU', ko: 'ㅕ', en: 'u', x: 424, y: 62, w: 50, h: 44, finger: 'RI' },
    { id: 'KeyI', ko: 'ㅑ', en: 'i', x: 478, y: 62, w: 50, h: 44, finger: 'RM' },
    { id: 'KeyO', ko: 'ㅐ', koShift: 'ㅒ', en: 'o', x: 532, y: 62, w: 50, h: 44, finger: 'RR' },
    { id: 'KeyP', ko: 'ㅔ', koShift: 'ㅖ', en: 'p', x: 586, y: 62, w: 50, h: 44, finger: 'RP' },
    { id: 'BracketLeft', ko: '', en: '[', x: 640, y: 62, w: 50, h: 44, finger: 'RP' },
    { id: 'BracketRight', ko: '', en: ']', x: 694, y: 62, w: 50, h: 44, finger: 'RP' },
    { id: 'Backslash', ko: '', en: '\\', x: 748, y: 62, w: 72, h: 44, finger: 'RP' },
  ],
  // Row 2: ASDF / ㅁㄴㅇㄹㅎㅗㅓㅏㅣ (기본 자리 Home Row)
  [
    { id: 'CapsLock', ko: '', en: 'caps lock', x: 20, y: 112, w: 88, h: 44, finger: 'LP' },
    { id: 'KeyA', ko: 'ㅁ', en: 'a', x: 112, y: 112, w: 50, h: 44, finger: 'LP' },
    { id: 'KeyS', ko: 'ㄴ', en: 's', x: 166, y: 112, w: 50, h: 44, finger: 'LR' },
    { id: 'KeyD', ko: 'ㅇ', en: 'd', x: 220, y: 112, w: 50, h: 44, finger: 'LM' },
    { id: 'KeyF', ko: 'ㄹ', en: 'f', x: 274, y: 112, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyG', ko: 'ㅎ', en: 'g', x: 328, y: 112, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyH', ko: 'ㅗ', en: 'h', x: 382, y: 112, w: 50, h: 44, finger: 'RI' },
    { id: 'KeyJ', ko: 'ㅓ', en: 'j', x: 436, y: 112, w: 50, h: 44, finger: 'RI' },
    { id: 'KeyK', ko: 'ㅏ', en: 'k', x: 490, y: 112, w: 50, h: 44, finger: 'RM' },
    { id: 'KeyL', ko: 'ㅣ', en: 'l', x: 544, y: 112, w: 50, h: 44, finger: 'RR' },
    { id: 'Semicolon', ko: '', en: ';', x: 598, y: 112, w: 50, h: 44, finger: 'RP' },
    { id: 'Quote', ko: '', en: "'", x: 652, y: 112, w: 50, h: 44, finger: 'RP' },
    { id: 'Enter', ko: '', en: 'enter', x: 706, y: 112, w: 114, h: 44, finger: 'RP' },
  ],
  // Row 3: ZXCV / ㅋㅌㅊㅍㅠㅜㅡ
  [
    { id: 'ShiftLeft', ko: '', en: 'left_shift', x: 20, y: 162, w: 116, h: 44, finger: 'LP' },
    { id: 'KeyZ', ko: 'ㅋ', en: 'z', x: 140, y: 162, w: 50, h: 44, finger: 'LP' },
    { id: 'KeyX', ko: 'ㅌ', en: 'x', x: 194, y: 162, w: 50, h: 44, finger: 'LR' },
    { id: 'KeyC', ko: 'ㅊ', en: 'c', x: 248, y: 162, w: 50, h: 44, finger: 'LM' },
    { id: 'KeyV', ko: 'ㅍ', en: 'v', x: 302, y: 162, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyB', ko: 'ㅠ', en: 'b', x: 356, y: 162, w: 50, h: 44, finger: 'LI' },
    { id: 'KeyN', ko: 'ㅜ', en: 'n', x: 410, y: 162, w: 50, h: 44, finger: 'RI' },
    { id: 'KeyM', ko: 'ㅡ', en: 'm', x: 464, y: 162, w: 50, h: 44, finger: 'RI' },
    { id: 'Comma', ko: '', en: ',', x: 518, y: 162, w: 50, h: 44, finger: 'RM' },
    { id: 'Period', ko: '', en: '.', x: 572, y: 162, w: 50, h: 44, finger: 'RR' },
    { id: 'Slash', ko: '', en: '/', x: 626, y: 162, w: 50, h: 44, finger: 'RP' },
    { id: 'ShiftRight', ko: '', en: 'right_shift', x: 680, y: 162, w: 140, h: 44, finger: 'RP' },
  ],
  // Row 4: Space Bar row
  [
    { id: 'ControlLeft', ko: '', en: 'ctrl', x: 20, y: 212, w: 65, h: 44, finger: 'LP' },
    { id: 'WindowLeft', ko: '', en: 'window', x: 89, y: 212, w: 55, h: 44, finger: 'LP' },
    { id: 'AltLeft', ko: '', en: 'alt', x: 148, y: 212, w: 50, h: 44, finger: 'LP' },
    { id: 'Hanja', ko: '', en: '한자', x: 202, y: 212, w: 50, h: 44, finger: 'LT' },
    { id: 'Space', ko: '', en: 'space', x: 256, y: 212, w: 320, h: 44, finger: 'LT' },
    { id: 'HangulMode', ko: '', en: '한/영', x: 580, y: 212, w: 55, h: 44, finger: 'RT' },
    { id: 'AltRight', ko: '', en: 'alt', x: 639, y: 212, w: 50, h: 44, finger: 'RP' },
    { id: 'ControlRight', ko: '', en: 'ctrl', x: 693, y: 212, w: 55, h: 44, finger: 'RP' },
    { id: 'ArrowLeft', ko: '', en: '◀', x: 752, y: 212, w: 68, h: 44, finger: 'RP' },
  ],
];

// Helper to look up key position for movement arrows
const ALL_KEYS = KEY_ROWS.flat();
export function findKeyDef(keyId?: string): KeyDef | undefined {
  if (!keyId) return undefined;
  return ALL_KEYS.find((k) => k.id === keyId);
}

// Exact fingertip coordinates on the home row
export const FINGERTIP_CENTERS: Record<FingerId, { x: number; y: number; label: string }> = {
  LP: { x: 137, y: 134, label: 'ㅁ' },
  LR: { x: 191, y: 134, label: 'ㄴ' },
  LM: { x: 245, y: 134, label: 'ㅇ' },
  LI: { x: 299, y: 134, label: 'ㄹ' },
  LT: { x: 325, y: 226, label: 'space' },
  RT: { x: 445, y: 226, label: 'space' },
  RI: { x: 461, y: 134, label: 'ㅓ' },
  RM: { x: 515, y: 134, label: 'ㅏ' },
  RR: { x: 569, y: 134, label: 'ㅣ' },
  RP: { x: 623, y: 134, label: ';' },
};

interface Props {
  targetKeyId?: string; // e.g. 'KeyA'
  activeFinger?: FingerId; // e.g. 'LP'
  requiresShift?: boolean;
  pressedKeys?: Set<string>;
  onVirtualKeyPress?: (keyId: string, ko: string) => void;
  className?: string;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
}

export const KoreanKeyboardWithHands: React.FC<Props> = ({
  targetKeyId,
  activeFinger,
  requiresShift = false,
  pressedKeys = new Set(),
  onVirtualKeyPress,
  className = '',
  theme: controlledTheme,
}) => {
  // Theme state: defaults to 'dark' to match the ChocoMae reference image (image_3218806b.png)
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');
  const currentTheme = controlledTheme ?? internalTheme;

  const isKeyTarget = (kId: string) => {
    if (targetKeyId === kId) return true;
    if (requiresShift && (kId === 'ShiftLeft' || kId === 'ShiftRight')) return true;
    return false;
  };

  const targetKeyDef = findKeyDef(targetKeyId);
  const activeFingerCenter = activeFinger ? FINGERTIP_CENTERS[activeFinger] : null;

  // Determine if target key is on a different row from home row
  const isTargetOffHomeRow =
    activeFingerCenter &&
    targetKeyDef &&
    (Math.abs(targetKeyDef.x + targetKeyDef.w / 2 - activeFingerCenter.x) > 12 ||
      Math.abs(targetKeyDef.y + targetKeyDef.h / 2 - activeFingerCenter.y) > 12);

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Theme Toggle Bar (Top right corner of keyboard) */}
      <div className="flex items-center justify-between px-2 mb-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
          <span className={currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
            두벌식 표준 한글 키보드 · 양손 올바른 운지법
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInternalTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
            currentTheme === 'dark'
              ? 'bg-slate-800 text-amber-300 border-slate-600 hover:bg-slate-700'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
          title="키보드 색상 테마 전환"
        >
          {currentTheme === 'dark' ? '🌙 다크 모드 (화면 일치)' : '☀️ 라이트 모드 (화사한 크림)'}
        </button>
      </div>

      <svg
        viewBox="0 0 840 330"
        className="w-full h-auto drop-shadow-lg overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Key Drop Shadow */}
          <filter id="keyShadowDark" x="-6%" y="-6%" width="112%" height="118%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
          <filter id="keyShadowLight" x="-6%" y="-6%" width="112%" height="118%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodColor="#94A3B8" floodOpacity="0.3" />
          </filter>

          {/* Yellow Target Glow (High-intensity neon yellow bloom matching reference) */}
          <filter id="neonTargetGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FFE600" floodOpacity="0.95" />
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFFFFF" floodOpacity="0.8" />
          </filter>

          {/* Golden Active Finger Glow */}
          <filter id="activeFingerGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFE600" floodOpacity="0.85" />
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#B45309" floodOpacity="0.5" />
          </filter>

          {/* Gentle Hand Silhouette Drop Shadow */}
          <filter id="handDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Active Finger Vibrant Gradient */}
          <linearGradient id="activeFingerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFE066" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.88" />
          </linearGradient>

          {/* Resting Hand Organic Translucent Fill */}
          <linearGradient id="restingHandGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.16" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="restingHandGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* ─────────────────────────────────────────────────────────────
            1. Keyboard Chassis Plate
            Dark Mode: Deep Slate Charcoal (#272B30) matching image_3218806b.png
            Light Mode: Warm Cream White (#FFFDF7)
        ───────────────────────────────────────────────────────────── */}
        <rect
          x="10"
          y="2"
          width="820"
          height="262"
          rx="18"
          fill={currentTheme === 'dark' ? '#272B30' : '#FFFDF7'}
          stroke={currentTheme === 'dark' ? '#3B4149' : '#E2E8F0'}
          strokeWidth="3.5"
          filter={currentTheme === 'dark' ? 'url(#keyShadowDark)' : 'url(#keyShadowLight)'}
        />

        {/* ─────────────────────────────────────────────────────────────
            2. Keycaps (All 5 Rows)
        ───────────────────────────────────────────────────────────── */}
        {KEY_ROWS.map((row, rowIdx) => (
          <g key={rowIdx}>
            {row.map((key) => {
              const isTarget = isKeyTarget(key.id);
              const isPressed = pressedKeys.has(key.id);

              // Colors based on theme and target status
              let keyFill = currentTheme === 'dark' ? '#3B4149' : '#FFFFFF';
              let keyStroke = currentTheme === 'dark' ? '#58626F' : '#CBD5E1';
              let textColor = currentTheme === 'dark' ? '#FFFFFF' : '#0F172A';
              let subtextColor = currentTheme === 'dark' ? '#CBD5E1' : '#64748B';

              if (isTarget) {
                keyFill = currentTheme === 'dark' ? '#4A4016' : '#FEF08A';
                keyStroke = '#FFE600';
                textColor = currentTheme === 'dark' ? '#FFF566' : '#78350F';
                subtextColor = currentTheme === 'dark' ? '#FDE047' : '#92400E';
              } else if (isPressed) {
                keyFill = currentTheme === 'dark' ? '#202428' : '#E2E8F0';
              }

              return (
                <g
                  key={key.id}
                  onClick={() => onVirtualKeyPress && onVirtualKeyPress(key.id, key.ko || key.en)}
                  className="cursor-pointer transition-transform"
                  transform={isPressed ? 'translate(0, 2)' : ''}
                >
                  {/* Keycap Tile */}
                  <rect
                    x={key.x}
                    y={key.y}
                    width={key.w}
                    height={key.h}
                    rx="9"
                    fill={keyFill}
                    stroke={keyStroke}
                    strokeWidth={isTarget ? '3.5' : '1.8'}
                    filter={
                      isTarget
                        ? 'url(#neonTargetGlow)'
                        : currentTheme === 'dark'
                        ? 'url(#keyShadowDark)'
                        : 'url(#keyShadowLight)'
                    }
                  />

                  {/* F and J Home Row Tactile Bumps (ㄹ & ㅓ) */}
                  {(key.id === 'KeyF' || key.id === 'KeyJ') && (
                    <line
                      x1={key.x + key.w / 2 - 8}
                      y1={key.y + key.h - 6}
                      x2={key.x + key.w / 2 + 8}
                      y2={key.y + key.h - 6}
                      stroke={isTarget ? '#FFE600' : currentTheme === 'dark' ? '#E2E8F0' : '#64748B'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Korean Primary Letter (Large, Bold, Centered) */}
                  {key.ko && (
                    <text
                      x={key.x + (key.en ? key.w * 0.38 : key.w / 2)}
                      y={key.y + (key.koShift ? key.h * 0.74 : key.h * 0.68)}
                      textAnchor="middle"
                      fontSize="20"
                      fontWeight="900"
                      fill={textColor}
                    >
                      {key.ko}
                    </text>
                  )}

                  {/* Korean Double Consonant / Shift Consonant */}
                  {key.koShift && (
                    <text
                      x={key.x + key.w * 0.38}
                      y={key.y + key.h * 0.36}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="800"
                      fill={isTarget && requiresShift ? '#F43F5E' : subtextColor}
                    >
                      {key.koShift}
                    </text>
                  )}

                  {/* English Label / Function Key Subtitle */}
                  {key.en && (
                    <text
                      x={key.ko ? key.x + key.w * 0.76 : key.x + key.w / 2}
                      y={key.ko ? key.y + key.h * 0.38 : key.y + key.h * 0.62}
                      textAnchor="middle"
                      fontSize={key.ko ? '11' : key.en.length > 6 ? '10' : '12'}
                      fontWeight={key.ko ? '600' : '800'}
                      fill={subtextColor}
                    >
                      {key.en}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* ─────────────────────────────────────────────────────────────
            3. DYNAMIC TARGET BEACON / ARROW (When target key is off-home-row)
            Shows smooth path from home-row fingertip to target key
        ───────────────────────────────────────────────────────────── */}
        {isTargetOffHomeRow && activeFingerCenter && targetKeyDef && (
          <g style={{ pointerEvents: 'none' }}>
            <line
              x1={activeFingerCenter.x}
              y1={activeFingerCenter.y}
              x2={targetKeyDef.x + targetKeyDef.w / 2}
              y2={targetKeyDef.y + targetKeyDef.h / 2}
              stroke="#FFE600"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Target key pulse ripple */}
            <circle
              cx={targetKeyDef.x + targetKeyDef.w / 2}
              cy={targetKeyDef.y + targetKeyDef.h / 2}
              r="14"
              fill="none"
              stroke="#FFE600"
              strokeWidth="2.5"
              opacity="0.9"
            >
              <animate attributeName="r" values="12;18;12" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* ─────────────────────────────────────────────────────────────
            4. NATURAL HUMAN HANDS (LEFT & RIGHT) OVERLAY
            - Anatomically accurate proportions with smooth Bézier curves
            - Rounded fingertips resting directly on home keys:
                Left: LP(ㅁ 137), LR(ㄴ 191), LM(ㅇ 245), LI(ㄹ 299), LT(Space 325)
                Right: RT(Space 445), RI(ㅓ 461), RM(ㅏ 515), RR(ㅣ 569), RP(; 623)
            - Smooth wrist extending naturally past the keyboard bottom edge
            - Non-wireframe, clean organic contours with fingernails & joint cues
            - Active finger shines with intense radiant yellow glow (#FFE600)
            - pointer-events: none ensures keystroke clicks pass through directly
        ───────────────────────────────────────────────────────────── */}
        <g id="naturalHandsLayer" style={{ pointerEvents: 'none' }} filter="url(#handDropShadow)">
          {/* ═══════════════════════════════════════════════════════════
              LEFT HAND
          ═══════════════════════════════════════════════════════════ */}
          <g id="leftHand">
            {/* Left Palm & Forearm Body */}
            <path
              d="
                M 75 330
                C 85 295, 96 265, 102 235
                C 108 205, 116 182, 126 168
                L 149 168
                C 151 172, 153 172, 155 172
                L 179 172
                L 204 172
                L 233 172
                L 258 172
                L 287 172
                L 312 172
                C 314 185, 308 198, 298 206
                C 288 238, 260 268, 240 285
                C 222 305, 212 318, 205 330
                Z
              "
              fill={currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={currentTheme === 'dark' ? 0.8 : 0.9}
            />

            {/* Left Palm Natural Crease Lines (Lifeline & Heartline) */}
            <path
              d="M 125 195 C 150 205, 195 210, 235 220"
              fill="none"
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 145 225 C 175 235, 210 248, 230 270"
              fill="none"
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Left Pinky (LP - Home: ㅁ / KeyA) */}
            <g id="finger-LP">
              <path
                d="
                  M 126 168
                  C 125 152, 126 138, 128 132
                  C 129 123, 133 118, 137 118
                  C 142 118, 145 123, 146 132
                  C 147 138, 148 152, 149 168
                  Z
                "
                fill={activeFinger === 'LP' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'LP' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'LP' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'LP' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 132 127 Q 137 123 142 127"
                fill="none"
                stroke={activeFinger === 'LP' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Left Ring Finger (LR - Home: ㄴ / KeyS) */}
            <g id="finger-LR">
              <path
                d="
                  M 179 170
                  C 179 148, 180 134, 182 128
                  C 183 118, 187 114, 191 114
                  C 196 114, 200 118, 201 128
                  C 202 134, 203 148, 204 170
                  Z
                "
                fill={activeFinger === 'LR' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'LR' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'LR' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'LR' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 186 123 Q 191 119 196 123"
                fill="none"
                stroke={activeFinger === 'LR' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Left Middle Finger (LM - Home: ㅇ / KeyD) */}
            <g id="finger-LM">
              <path
                d="
                  M 233 170
                  C 233 145, 234 130, 235 124
                  C 237 112, 241 108, 245 108
                  C 250 108, 254 112, 255 124
                  C 256 130, 257 145, 258 170
                  Z
                "
                fill={activeFinger === 'LM' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'LM' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'LM' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'LM' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 240 117 Q 245 113 250 117"
                fill="none"
                stroke={activeFinger === 'LM' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Left Index Finger (LI - Home: ㄹ / KeyF) */}
            <g id="finger-LI">
              <path
                d="
                  M 287 170
                  C 287 146, 288 132, 289 126
                  C 291 115, 295 111, 299 111
                  C 304 111, 308 115, 309 126
                  C 310 132, 311 148, 312 170
                  Z
                "
                fill={activeFinger === 'LI' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'LI' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'LI' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'LI' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 294 120 Q 299 116 304 120"
                fill="none"
                stroke={activeFinger === 'LI' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Left Thumb (LT - Home: Spacebar left) */}
            <g id="finger-LT">
              <path
                d="
                  M 298 206
                  C 306 211, 316 218, 324 220
                  C 330 222, 336 226, 334 232
                  C 332 238, 323 241, 315 239
                  C 298 243, 276 254, 258 270
                  C 268 252, 285 228, 298 206
                  Z
                "
                fill={activeFinger === 'LT' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'LT' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'LT' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'LT' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Thumb nail */}
              <path
                d="M 324 228 Q 329 224 331 230"
                fill="none"
                stroke={activeFinger === 'LT' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Active Concentric Ripple Circle on Left Fingertip */}
            {activeFinger && activeFinger.startsWith('L') && (
              <g>
                <circle
                  cx={FINGERTIP_CENTERS[activeFinger].x}
                  cy={FINGERTIP_CENTERS[activeFinger].y}
                  r="13"
                  fill="none"
                  stroke="#FFE600"
                  strokeWidth="2.5"
                  opacity="0.9"
                >
                  <animate attributeName="r" values="10;16;10" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={FINGERTIP_CENTERS[activeFinger].x}
                  cy={FINGERTIP_CENTERS[activeFinger].y}
                  r="5"
                  fill="#FFE600"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </g>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT HAND
          ═══════════════════════════════════════════════════════════ */}
          <g id="rightHand">
            {/* Right Palm & Forearm Body */}
            <path
              d="
                M 765 330
                C 755 295, 744 265, 738 235
                C 732 205, 724 182, 714 168
                L 691 168
                C 689 172, 687 172, 685 172
                L 661 172
                L 636 172
                L 607 172
                L 582 172
                L 553 172
                L 528 172
                C 526 185, 532 198, 542 206
                C 552 238, 580 268, 600 285
                C 618 305, 628 318, 635 330
                Z
              "
              fill={currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={currentTheme === 'dark' ? 0.8 : 0.9}
            />

            {/* Right Palm Natural Crease Lines */}
            <path
              d="M 715 195 C 690 205, 645 210, 605 220"
              fill="none"
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 695 225 C 665 235, 630 248, 610 270"
              fill="none"
              stroke={currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Right Pinky (RP - Home: ; / Semicolon) */}
            <g id="finger-RP">
              <path
                d="
                  M 714 168
                  C 715 152, 714 138, 712 132
                  C 711 123, 707 118, 703 118
                  C 698 118, 695 123, 694 132
                  C 693 138, 692 152, 691 168
                  Z
                "
                transform="translate(-80, 0)"
                fill={activeFinger === 'RP' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'RP' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'RP' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'RP' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 618 127 Q 623 123 628 127"
                fill="none"
                stroke={activeFinger === 'RP' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Right Ring Finger (RR - Home: ㅣ / KeyL) */}
            <g id="finger-RR">
              <path
                d="
                  M 661 170
                  C 661 148, 660 134, 658 128
                  C 657 118, 653 114, 649 114
                  C 644 114, 640 118, 639 128
                  C 638 134, 637 148, 636 170
                  Z
                "
                transform="translate(-80, 0)"
                fill={activeFinger === 'RR' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'RR' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'RR' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'RR' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 564 123 Q 569 119 574 123"
                fill="none"
                stroke={activeFinger === 'RR' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Right Middle Finger (RM - Home: ㅏ / KeyK) */}
            <g id="finger-RM">
              <path
                d="
                  M 607 170
                  C 607 145, 606 130, 605 124
                  C 603 112, 599 108, 595 108
                  C 590 108, 586 112, 585 124
                  C 584 130, 583 145, 582 170
                  Z
                "
                transform="translate(-80, 0)"
                fill={activeFinger === 'RM' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'RM' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'RM' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'RM' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 510 117 Q 515 113 520 117"
                fill="none"
                stroke={activeFinger === 'RM' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Right Index Finger (RI - Home: ㅓ / KeyJ) */}
            <g id="finger-RI">
              <path
                d="
                  M 553 170
                  C 553 146, 552 132, 551 126
                  C 549 115, 545 111, 541 111
                  C 536 111, 532 115, 531 126
                  C 530 132, 529 148, 528 170
                  Z
                "
                transform="translate(-80, 0)"
                fill={activeFinger === 'RI' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'RI' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'RI' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'RI' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Fingernail arch */}
              <path
                d="M 456 120 Q 461 116 466 120"
                fill="none"
                stroke={activeFinger === 'RI' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Right Thumb (RT - Home: Spacebar right) */}
            <g id="finger-RT">
              <path
                d="
                  M 542 206
                  C 534 211, 524 218, 516 220
                  C 510 222, 504 226, 506 232
                  C 508 238, 517 241, 525 239
                  C 542 243, 564 254, 582 270
                  C 572 252, 555 228, 542 206
                  Z
                "
                transform="translate(-70, 0)"
                fill={activeFinger === 'RT' ? 'url(#activeFingerGrad)' : currentTheme === 'dark' ? 'url(#restingHandGradDark)' : 'url(#restingHandGradLight)'}
                stroke={activeFinger === 'RT' ? '#FFE600' : currentTheme === 'dark' ? '#94A3B8' : '#CBD5E1'}
                strokeWidth={activeFinger === 'RT' ? '3.5' : '2'}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={activeFinger === 'RT' ? 'url(#activeFingerGlow)' : undefined}
              />
              {/* Thumb nail */}
              <path
                d="M 444 228 Q 449 224 451 230"
                fill="none"
                stroke={activeFinger === 'RT' ? '#B45309' : currentTheme === 'dark' ? '#CBD5E1' : '#94A3B8'}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* Active Concentric Ripple Circle on Right Fingertip */}
            {activeFinger && activeFinger.startsWith('R') && (
              <g>
                <circle
                  cx={FINGERTIP_CENTERS[activeFinger].x}
                  cy={FINGERTIP_CENTERS[activeFinger].y}
                  r="13"
                  fill="none"
                  stroke="#FFE600"
                  strokeWidth="2.5"
                  opacity="0.9"
                >
                  <animate attributeName="r" values="10;16;10" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={FINGERTIP_CENTERS[activeFinger].x}
                  cy={FINGERTIP_CENTERS[activeFinger].y}
                  r="5"
                  fill="#FFE600"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
