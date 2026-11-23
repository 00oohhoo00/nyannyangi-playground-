import React from 'react';

// Cute hand-drawn fairytale SVG vignettes with chubby baby cat and warm pastel colors

export const BasketFishVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#FEF9E7]">
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FFF3C4" />
        <stop offset="100%" stopColor="#FEF9E7" />
      </radialGradient>
      <linearGradient id="basketGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sunGlow)" />
    {/* Soft hills & clouds */}
    <circle cx="80" cy="90" r="45" fill="#FFFFFF" opacity="0.6" />
    <circle cx="120" cy="80" r="55" fill="#FFFFFF" opacity="0.6" />
    <path d="M0,230 Q150,190 400,230 L400,300 L0,300 Z" fill="#D1FAE5" />
    <path d="M0,250 Q200,220 400,250 L400,300 L0,300 Z" fill="#A7F3D0" />

    {/* Woven Basket */}
    <ellipse cx="270" cy="220" rx="70" ry="25" fill="#92400E" opacity="0.3" />
    <path d="M210,180 Q270,260 330,180 Q340,165 330,150 Q270,140 210,150 Q200,165 210,180 Z" fill="url(#basketGrad)" />
    <ellipse cx="270" cy="155" rx="55" ry="16" fill="#FDE68A" />
    {/* Basket pattern */}
    <path d="M220,165 Q270,210 320,165" stroke="#78350F" strokeWidth="3" fill="none" />
    <path d="M230,185 Q270,225 310,185" stroke="#78350F" strokeWidth="3" fill="none" />
    <path d="M245,155 Q270,80 295,155" stroke="#92400E" strokeWidth="6" fill="none" strokeLinecap="round" />

    {/* Fish inside basket */}
    <path d="M250,150 Q275,135 295,155 Q275,165 250,150 Z" fill="#38BDF8" />
    <polygon points="295,155 310,145 310,165" fill="#0284C7" />
    <circle cx="260" cy="148" r="2" fill="#0F172A" />

    <path d="M235,160 Q260,145 280,165 Q260,175 235,160 Z" fill="#FB923C" />
    <polygon points="280,165 295,155 295,175" fill="#EA580C" />
    <circle cx="245" cy="158" r="2" fill="#0F172A" />

    {/* Cute Chubby Baby Cat holding fish */}
    <ellipse cx="130" cy="250" rx="40" ry="12" fill="#000000" opacity="0.1" />
    {/* Tail */}
    <path d="M90,220 Q60,200 70,170 Q75,155 85,165 Q80,190 100,210" fill="#FDBA74" stroke="#78350F" strokeWidth="3" />
    {/* Body */}
    <ellipse cx="135" cy="205" rx="38" ry="42" fill="#FED7AA" stroke="#78350F" strokeWidth="3.5" />
    <ellipse cx="138" cy="215" rx="22" ry="24" fill="#FFFFFF" />
    {/* Feet */}
    <ellipse cx="115" cy="245" rx="12" ry="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
    <ellipse cx="155" cy="245" rx="12" ry="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
    {/* Head */}
    <ellipse cx="140" cy="135" rx="44" ry="38" fill="#FED7AA" stroke="#78350F" strokeWidth="3.5" />
    {/* Ears */}
    <path d="M105,115 Q95,75 120,95 Z" fill="#FDBA74" stroke="#78350F" strokeWidth="3.5" />
    <path d="M110,110 Q105,85 120,100 Z" fill="#FDA4AF" />
    <path d="M175,115 Q185,75 160,95 Z" fill="#FDBA74" stroke="#78350F" strokeWidth="3.5" />
    <path d="M170,110 Q175,85 160,100 Z" fill="#FDA4AF" />
    {/* Cheese Stripes */}
    <path d="M132,100 Q140,112 148,100" stroke="#EA580C" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M125,108 Q140,122 155,108" stroke="#EA580C" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Eyes */}
    <circle cx="125" cy="135" r="4.5" fill="#3E2723" />
    <circle cx="124" cy="133" r="1.5" fill="#FFFFFF" />
    <circle cx="155" cy="135" r="4.5" fill="#3E2723" />
    <circle cx="154" cy="133" r="1.5" fill="#FFFFFF" />
    {/* Cheeks */}
    <circle cx="115" cy="142" r="6" fill="#FDA4AF" opacity="0.6" />
    <circle cx="165" cy="142" r="6" fill="#FDA4AF" opacity="0.6" />
    {/* Mouth */}
    <path d="M136,142 Q140,146 144,142" stroke="#78350F" strokeWidth="2.5" fill="none" />
    {/* Paw holding swimming fish */}
    <ellipse cx="170" cy="180" rx="9" ry="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
    <path d="M175,175 Q205,150 230,170 Q205,185 175,175 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="2.5" />
    <polygon points="230,170 245,160 245,180" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
    <circle cx="185" cy="172" r="2" fill="#064E3B" />
  </svg>
);

export const CatPuzzleVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#EFF6FF]">
    {/* Puzzle board background */}
    <rect x="50" y="30" width="300" height="230" rx="20" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="4" />
    {/* Puzzle cut lines */}
    <path d="M150,30 L150,110 C165,110 165,135 150,135 L150,260" stroke="#60A5FA" strokeWidth="3" strokeDasharray="6,4" fill="none" />
    <path d="M250,30 L250,150 C235,150 235,175 250,175 L250,260" stroke="#60A5FA" strokeWidth="3" strokeDasharray="6,4" fill="none" />
    <path d="M50,140 L110,140 C110,155 135,155 135,140 L280,140 C280,125 305,125 305,140 L350,140" stroke="#60A5FA" strokeWidth="3" strokeDasharray="6,4" fill="none" />

    {/* Floating Puzzle Piece */}
    <g transform="translate(180, 80) rotate(-8)">
      <rect x="0" y="0" width="80" height="80" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3.5" />
      <circle cx="40" cy="0" r="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3.5" />
      <circle cx="40" cy="35" r="14" fill="#F472B6" />
      <path d="M30,35 Q40,45 50,35" stroke="#831843" strokeWidth="2" fill="none" />
      <text x="40" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#854D0E">쏙!</text>
    </g>

    {/* Chubby White Kitten adjusting puzzle */}
    <g transform="translate(70, 110)">
      <ellipse cx="60" cy="110" rx="35" ry="38" fill="#FFFFFF" stroke="#52525B" strokeWidth="3" />
      <ellipse cx="60" cy="55" rx="38" ry="32" fill="#FFFFFF" stroke="#52525B" strokeWidth="3" />
      {/* Ears */}
      <path d="M30,35 Q20,5 45,20 Z" fill="#FFFFFF" stroke="#52525B" strokeWidth="3" />
      <path d="M35,30 Q30,15 45,22 Z" fill="#FCE7F3" />
      <path d="M90,35 Q100,5 75,20 Z" fill="#FFFFFF" stroke="#52525B" strokeWidth="3" />
      <path d="M85,30 Q90,15 75,22 Z" fill="#FCE7F3" />
      {/* Eyes & smile */}
      <circle cx="48" cy="52" r="3.5" fill="#27272A" />
      <circle cx="72" cy="52" r="3.5" fill="#27272A" />
      <circle cx="42" cy="58" r="5" fill="#F472B6" opacity="0.6" />
      <circle cx="78" cy="58" r="5" fill="#F472B6" opacity="0.6" />
      <path d="M57,58 Q60,62 63,58" stroke="#52525B" strokeWidth="2" fill="none" />
      {/* Paw reaching */}
      <ellipse cx="95" cy="70" rx="10" ry="7" fill="#FFFFFF" stroke="#52525B" strokeWidth="2.5" />
    </g>
  </svg>
);

export const ContextMenuVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#FFFBEB]">
    <rect x="0" y="0" width="400" height="300" fill="#FFFBEB" />
    {/* Computer desk surface */}
    <rect x="30" y="220" width="340" height="60" rx="10" fill="#FDE68A" stroke="#F59E0B" strokeWidth="3" />

    {/* Chubby cat sitting */}
    <g transform="translate(100, 70)">
      <ellipse cx="60" cy="110" rx="36" ry="40" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      <ellipse cx="60" cy="55" rx="40" ry="34" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      {/* Ears */}
      <path d="M30,35 Q20,10 45,22 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      <path d="M90,35 Q100,10 75,22 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="48" cy="52" r="4" fill="#1E293B" />
      <circle cx="72" cy="52" r="4" fill="#1E293B" />
      <circle cx="40" cy="58" r="5" fill="#FDA4AF" opacity="0.7" />
      <circle cx="80" cy="58" r="5" fill="#FDA4AF" opacity="0.7" />
      <path d="M56,58 Q60,62 64,58" stroke="#475569" strokeWidth="2" fill="none" />
    </g>

    {/* Context Menu Popup Window */}
    <g transform="translate(200, 60)" className="animate-float-gentle">
      <rect x="0" y="0" width="150" height="130" rx="16" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.1))" />
      {/* Header bar */}
      <rect x="0" y="0" width="150" height="28" rx="16" fill="#FEF3C7" />
      <text x="14" y="19" fontSize="11" fontWeight="900" fill="#92400E">🖱️ 냥냥이 메뉴</text>
      {/* Menu items */}
      <rect x="8" y="34" width="134" height="26" rx="8" fill="#FEE2E2" />
      <text x="16" y="51" fontSize="12" fontWeight="bold" fill="#991B1B">🐟 맛있는 생선 주기</text>

      <rect x="8" y="64" width="134" height="26" rx="8" fill="#E0F2FE" />
      <text x="16" y="81" fontSize="12" fontWeight="bold" fill="#075985">🧶 털실 공 굴리기</text>

      <rect x="8" y="94" width="134" height="26" rx="8" fill="#F3E8FF" />
      <text x="16" y="111" fontSize="12" fontWeight="bold" fill="#6B21A8">💖 머리 쓰다듬기</text>
    </g>

    {/* Mouse with glowing Right Click button */}
    <g transform="translate(190, 200)">
      <rect x="0" y="0" width="36" height="52" rx="18" fill="#FFFFFF" stroke="#64748B" strokeWidth="3" />
      <line x1="18" y1="0" x2="18" y2="24" stroke="#64748B" strokeWidth="2.5" />
      <line x1="0" y1="24" x2="36" y2="24" stroke="#64748B" strokeWidth="2" />
      {/* Right button highlight */}
      <path d="M18,0 L27,0 A9,9 0 0 1 36,9 L36,24 L18,24 Z" fill="#F43F5E" />
      <text x="22" y="18" fontSize="10" fontWeight="900" fill="#FFFFFF">우</text>
    </g>
  </svg>
);

export const ArrowKeysVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#ECFDF5]">
    <rect width="400" height="300" fill="#ECFDF5" />
    {/* Map Path */}
    <path d="M40,240 Q150,230 180,170 Q210,110 320,100" stroke="#A7F3D0" strokeWidth="30" strokeLinecap="round" fill="none" />
    <path d="M40,240 Q150,230 180,170 Q210,110 320,100" stroke="#34D399" strokeWidth="4" strokeDasharray="8,8" fill="none" />

    {/* Arrow Keys Cluster */}
    <g transform="translate(70, 70)">
      {/* Up Key */}
      <rect x="50" y="0" width="45" height="45" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="3" filter="drop-shadow(0 4px 0 #047857)" />
      <path d="M72.5,14 L60,28 L85,28 Z" fill="#10B981" />

      {/* Left Key */}
      <rect x="0" y="52" width="45" height="45" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="3" filter="drop-shadow(0 4px 0 #047857)" />
      <path d="M14,74.5 L28,62 L28,87 Z" fill="#10B981" />

      {/* Down Key */}
      <rect x="50" y="52" width="45" height="45" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="3" filter="drop-shadow(0 4px 0 #047857)" />
      <path d="M72.5,85 L60,71 L85,71 Z" fill="#10B981" />

      {/* Right Key */}
      <rect x="100" y="52" width="45" height="45" rx="10" fill="#FFFFFF" stroke="#059669" strokeWidth="3" filter="drop-shadow(0 4px 0 #047857)" />
      <path d="M131,74.5 L117,62 L117,87 Z" fill="#10B981" />
    </g>

    {/* Explorer Baby Cat */}
    <g transform="translate(260, 80)">
      <ellipse cx="40" cy="90" rx="32" ry="34" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />
      <ellipse cx="40" cy="45" rx="35" ry="30" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />
      {/* Explorer Cap */}
      <path d="M15,35 Q40,15 65,35" fill="#84CC16" stroke="#4D7C0F" strokeWidth="3" />
      <ellipse cx="40" cy="22" rx="18" ry="10" fill="#65A30D" stroke="#4D7C0F" strokeWidth="2" />
      {/* Eyes & Smile */}
      <circle cx="30" cy="45" r="3.5" fill="#3E2723" />
      <circle cx="50" cy="45" r="3.5" fill="#3E2723" />
      <circle cx="24" cy="50" r="4" fill="#FDA4AF" />
      <circle cx="56" cy="50" r="4" fill="#FDA4AF" />
      <path d="M36,52 Q40,56 44,52" stroke="#78350F" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

export const SpaceJumpVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#FFF7ED]">
    <rect width="400" height="300" fill="#FFF7ED" />
    {/* Rainbow arch */}
    <path d="M40,240 Q200,60 360,240" stroke="#FDE047" strokeWidth="12" fill="none" opacity="0.5" />
    <path d="M50,240 Q200,80 350,240" stroke="#F472B6" strokeWidth="10" fill="none" opacity="0.5" />

    {/* Spacebar key */}
    <g transform="translate(80, 210)">
      <rect x="0" y="0" width="240" height="50" rx="14" fill="#FFFFFF" stroke="#EA580C" strokeWidth="3.5" filter="drop-shadow(0 6px 0 #C2410C)" />
      <text x="120" y="32" textAnchor="middle" fontSize="16" fontWeight="900" fill="#C2410C">SPACE BAR 🚀</text>
    </g>

    {/* Jumping Baby Cat in mid-air */}
    <g transform="translate(160, 50)" className="animate-playful-bounce">
      <ellipse cx="40" cy="70" rx="30" ry="34" fill="#FDE047" stroke="#854D0E" strokeWidth="3" />
      <ellipse cx="40" cy="35" rx="34" ry="28" fill="#FDE047" stroke="#854D0E" strokeWidth="3" />
      {/* Ears */}
      <path d="M15,22 Q10,2 30,12 Z" fill="#FDE047" stroke="#854D0E" strokeWidth="3" />
      <path d="M65,22 Q70,2 50,12 Z" fill="#FDE047" stroke="#854D0E" strokeWidth="3" />
      {/* Excited open mouth */}
      <circle cx="30" cy="33" r="3.5" fill="#3E2723" />
      <circle cx="50" cy="33" r="3.5" fill="#3E2723" />
      <ellipse cx="40" cy="42" rx="4" ry="5" fill="#EF4444" />
      {/* Paws wide open */}
      <ellipse cx="10" cy="48" rx="8" ry="6" fill="#FFFFFF" stroke="#854D0E" strokeWidth="2.5" />
      <ellipse cx="70" cy="48" rx="8" ry="6" fill="#FFFFFF" stroke="#854D0E" strokeWidth="2.5" />
      <text x="40" y="15" textAnchor="middle" fontSize="14">✨ 쩜프! ✨</text>
    </g>
  </svg>
);

export const HomeRowVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#FEFCE8]">
    <rect width="400" height="300" fill="#FEFCE8" />
    {/* Keyboard Home Row strip */}
    <g transform="translate(40, 160)">
      <rect x="0" y="0" width="320" height="75" rx="16" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
      {['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅓ', 'ㅏ', 'ㅣ', ';'].map((char, i) => (
        <g key={char} transform={`translate(${16 + i * 36}, 12)`}>
          <rect x="0" y="0" width="30" height="48" rx="8" fill="#FFFFFF" stroke="#EAB308" strokeWidth="2.5" filter="drop-shadow(0 3px 0 #CA8A04)" />
          <text x="15" y="32" textAnchor="middle" fontSize="16" fontWeight="900" fill="#854D0E">{char}</text>
        </g>
      ))}
    </g>

    {/* Baby Cat paws resting properly */}
    <g transform="translate(150, 40)">
      <ellipse cx="50" cy="85" rx="42" ry="36" fill="#FED7AA" stroke="#78350F" strokeWidth="3.5" />
      {/* Ears */}
      <path d="M20,65 Q10,35 38,50 Z" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />
      <path d="M80,65 Q90,35 62,50 Z" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />
      {/* Eyes */}
      <circle cx="36" cy="82" r="4" fill="#3E2723" />
      <circle cx="64" cy="82" r="4" fill="#3E2723" />
      <circle cx="28" cy="88" r="5" fill="#FDA4AF" />
      <circle cx="72" cy="88" r="5" fill="#FDA4AF" />
      <path d="M46,90 Q50,94 54,90" stroke="#78350F" strokeWidth="2" fill="none" />
      {/* Two little paws positioned over the keys */}
      <ellipse cx="30" cy="122" rx="14" ry="10" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
      <ellipse cx="70" cy="122" rx="14" ry="10" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
    </g>
  </svg>
);

export const TopRowVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#FAF5FF]">
    <rect width="400" height="300" fill="#FAF5FF" />
    {/* Keyboard Top Row keys */}
    <g transform="translate(30, 150)">
      <rect x="0" y="0" width="340" height="80" rx="16" fill="#E9D5FF" stroke="#9333EA" strokeWidth="3" />
      {['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'].map((char, i) => (
        <g key={char} transform={`translate(${14 + i * 32}, 14)`}>
          <rect x="0" y="0" width="28" height="48" rx="8" fill="#FFFFFF" stroke="#C084FC" strokeWidth="2" filter="drop-shadow(0 3px 0 #9333EA)" />
          <text x="14" y="32" textAnchor="middle" fontSize="14" fontWeight="900" fill="#6B21A8">{char}</text>
        </g>
      ))}
    </g>

    {/* Kitten stretching paws upward to top row */}
    <g transform="translate(150, 40)">
      <ellipse cx="50" cy="75" rx="38" ry="32" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
      <circle cx="38" cy="72" r="3.5" fill="#1E293B" />
      <circle cx="62" cy="72" r="3.5" fill="#1E293B" />
      <circle cx="30" cy="78" r="4" fill="#F472B6" />
      <circle cx="70" cy="78" r="4" fill="#F472B6" />
      <path d="M47,80 Q50,84 53,80" stroke="#475569" strokeWidth="2" fill="none" />
      {/* Upward paws */}
      <ellipse cx="25" cy="115" rx="12" ry="9" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
      <ellipse cx="75" cy="115" rx="12" ry="9" fill="#FFFFFF" stroke="#475569" strokeWidth="2.5" />
    </g>
  </svg>
);

export const BottomRowVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#F0FDF4]">
    <rect width="400" height="300" fill="#F0FDF4" />
    {/* Keyboard Bottom Row keys */}
    <g transform="translate(50, 160)">
      <rect x="0" y="0" width="300" height="75" rx="16" fill="#BBF7D0" stroke="#16A34A" strokeWidth="3" />
      {['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'].map((char, i) => (
        <g key={char} transform={`translate(${18 + i * 38}, 12)`}>
          <rect x="0" y="0" width="32" height="48" rx="8" fill="#FFFFFF" stroke="#4ADE80" strokeWidth="2" filter="drop-shadow(0 3px 0 #16A34A)" />
          <text x="16" y="32" textAnchor="middle" fontSize="15" fontWeight="900" fill="#14532D">{char}</text>
        </g>
      ))}
    </g>

    {/* Kitten pointing down */}
    <g transform="translate(150, 45)">
      <ellipse cx="50" cy="75" rx="38" ry="32" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />
      <circle cx="38" cy="72" r="3.5" fill="#3E2723" />
      <circle cx="62" cy="72" r="3.5" fill="#3E2723" />
      <circle cx="30" cy="78" r="4" fill="#FDA4AF" />
      <circle cx="70" cy="78" r="4" fill="#FDA4AF" />
      <path d="M47,80 Q50,84 53,80" stroke="#78350F" strokeWidth="2" fill="none" />
      <ellipse cx="32" cy="120" rx="12" ry="9" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
      <ellipse cx="68" cy="120" rx="12" ry="9" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
    </g>
  </svg>
);

export const StorySentenceVignette: React.FC = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-[#F0F9FF]">
    <rect width="400" height="300" fill="#F0F9FF" />
    {/* Storybook page */}
    <rect x="60" y="40" width="280" height="210" rx="16" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="3.5" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.06))" />
    {/* Page spine */}
    <line x1="200" y1="40" x2="200" y2="250" stroke="#BAE6FD" strokeWidth="3" />
    {/* Storybook text lines */}
    <rect x="80" y="70" width="100" height="10" rx="5" fill="#E0F2FE" />
    <rect x="80" y="95" width="85" height="10" rx="5" fill="#E0F2FE" />
    <rect x="80" y="120" width="95" height="10" rx="5" fill="#E0F2FE" />
    <text x="80" y="165" fontSize="13" fontWeight="bold" fill="#0369A1">"안녕 아기 고양이야!"</text>

    {/* Kitten reading book */}
    <g transform="translate(220, 90)">
      <ellipse cx="45" cy="90" rx="32" ry="34" fill="#FCE7F3" stroke="#BE185D" strokeWidth="3" />
      <ellipse cx="45" cy="45" rx="35" ry="30" fill="#FCE7F3" stroke="#BE185D" strokeWidth="3" />
      <circle cx="35" cy="45" r="3.5" fill="#831843" />
      <circle cx="55" cy="45" r="3.5" fill="#831843" />
      <circle cx="28" cy="50" r="4" fill="#FB7185" />
      <circle cx="62" cy="50" r="4" fill="#FB7185" />
      <path d="M42,52 Q45,56 48,52" stroke="#831843" strokeWidth="2" fill="none" />
      <ellipse cx="25" cy="75" rx="10" ry="7" fill="#FFFFFF" stroke="#BE185D" strokeWidth="2" />
    </g>
  </svg>
);
