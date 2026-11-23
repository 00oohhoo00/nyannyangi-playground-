import React from 'react';

interface ItemIllustrationProps {
  itemId: string;
  className?: string;
}

// 1. Cozy Pastel Cream & Soft Pink Blanket (포근하고 폭신한 이불)
export const BlanketIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blanketShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#92400E" floodOpacity="0.14" />
      </filter>
      <linearGradient id="creamQuiltGrad" x1="50" y1="50" x2="160" y2="170" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="50%" stopColor="#FFF9E8" />
        <stop offset="100%" stopColor="#FEF3C7" />
      </linearGradient>
      <linearGradient id="pinkCuffGrad" x1="30" y1="30" x2="170" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE8EE" />
        <stop offset="50%" stopColor="#FBCFE8" />
        <stop offset="100%" stopColor="#F9A8D4" />
      </linearGradient>
      <linearGradient id="pillowGrad" x1="60" y1="20" x2="140" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FEE2E2" />
      </linearGradient>
    </defs>

    {/* Cozy background pillow tucked behind blanket */}
    <g filter="url(#blanketShadow)">
      <rect
        x="36"
        y="26"
        width="128"
        height="48"
        rx="22"
        fill="url(#pillowGrad)"
        stroke="#E2B1B6"
        strokeWidth="2.8"
      />
      <ellipse cx="100" cy="48" rx="8" ry="4" fill="#F472B6" opacity="0.35" />
      <path d="M 64 36 Q 100 44 136 36" stroke="#FDA4AF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 64 56 Q 100 50 136 56" stroke="#FDA4AF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
      <path
        d="M 100 48 C 98 44, 92 44, 92 48 C 92 52, 100 57, 100 57 C 100 57, 108 52, 108 48 C 108 44, 102 44, 100 48 Z"
        fill="#FB7185"
      />
    </g>

    {/* Main Fluffy Quilted Cotton Blanket Body */}
    <g filter="url(#blanketShadow)">
      <path
        d="M 24 96 
           C 22 75, 42 66, 60 68 
           C 85 71, 115 71, 140 68 
           C 158 66, 178 75, 176 96 
           C 174 132, 170 162, 162 172 
           C 152 184, 48 184, 38 172 
           C 30 162, 26 132, 24 96 Z"
        fill="url(#creamQuiltGrad)"
        stroke="#E2B18A"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Quilted Diamond Stitch Pattern */}
      <g stroke="#F59E0B" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.55" fill="none">
        <path d="M 46 88 Q 100 135 154 182" />
        <path d="M 76 76 Q 120 120 164 164" />
        <path d="M 28 116 Q 80 160 128 184" />
        <path d="M 110 74 Q 140 102 170 136" />
        <path d="M 154 88 Q 100 135 46 182" />
        <path d="M 124 76 Q 80 120 36 164" />
        <path d="M 172 116 Q 120 160 72 184" />
        <path d="M 90 74 Q 60 102 30 136" />
      </g>

      {/* Soft Plump Cotton Tufts */}
      <g fill="#F472B6" opacity="0.7">
        <circle cx="100" cy="110" r="3.2" />
        <circle cx="68" cy="132" r="3" />
        <circle cx="132" cy="132" r="3" />
        <circle cx="100" cy="154" r="3.2" />
        <circle cx="68" cy="94" r="2.8" />
        <circle cx="132" cy="94" r="2.8" />
      </g>

      {/* Soft Creases */}
      <g stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none">
        <path d="M 32 120 Q 42 126 34 136" />
        <path d="M 34 146 Q 44 152 38 162" />
        <path d="M 168 120 Q 158 126 166 136" />
        <path d="M 166 146 Q 156 152 162 162" />
        <path d="M 50 174 Q 100 168 150 174" strokeWidth="2.5" />
      </g>

      {/* Folded Top Cuff */}
      <path
        d="M 26 78 
           C 24 64, 44 58, 62 60 
           C 86 63, 114 63, 138 60 
           C 156 58, 176 64, 174 78 
           C 172 90, 158 95, 140 92 
           C 114 88, 86 88, 60 92 
           C 42 95, 28 90, 26 78 Z"
        fill="url(#pinkCuffGrad)"
        stroke="#E11D48"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* White Polka Dots */}
      <g fill="#FFFFFF" opacity="0.85">
        <circle cx="48" cy="74" r="2.5" />
        <circle cx="70" cy="76" r="2.5" />
        <circle cx="92" cy="74" r="2.5" />
        <circle cx="114" cy="76" r="2.5" />
        <circle cx="136" cy="74" r="2.5" />
        <circle cx="156" cy="76" r="2.5" />
        <circle cx="59" cy="84" r="2.2" />
        <circle cx="81" cy="85" r="2.2" />
        <circle cx="103" cy="84" r="2.2" />
        <circle cx="125" cy="85" r="2.2" />
        <circle cx="147" cy="84" r="2.2" />
      </g>

      <path
        d="M 32 89 C 58 84, 142 84, 168 89"
        stroke="#BE185D"
        strokeWidth="1.8"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.75"
      />
    </g>

    <g fill="#F59E0B">
      <polygon points="172,44 174,48 178,50 174,52 172,56 170,52 166,50 170,48" opacity="0.8" />
      <polygon points="26,104 27,107 30,108 27,109 26,112 25,109 22,108 25,107" opacity="0.7" />
    </g>
  </svg>
);

// 2. Cardboard Box Bed (최고급 편안 종이 박스 - 아늑한 쿠션과 작은 담요, 고양이 발바닥 도장)
export const BoxBedIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="boxDropShadow" x="-12%" y="-12%" width="124%" height="124%">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#78350F" floodOpacity="0.2" />
      </filter>
      <linearGradient id="craftGrad" x1="30" y1="40" x2="170" y2="180" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="boxInnerGrad" x1="40" y1="50" x2="160" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="plushGrad" x1="50" y1="70" x2="150" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>

    <g filter="url(#boxDropShadow)">
      {/* Box interior shadow & depth */}
      <rect x="30" y="65" width="140" height="45" rx="8" fill="url(#boxInnerGrad)" stroke="#5B2B0A" strokeWidth="2.5" />

      {/* Super Fluffy White/Cream Inner Cushion */}
      <ellipse cx="100" cy="85" rx="60" ry="22" fill="url(#plushGrad)" stroke="#D97706" strokeWidth="2.5" />
      {/* Cushion tufting dimples */}
      <ellipse cx="78" cy="84" rx="5" ry="2.5" fill="#F59E0B" opacity="0.6" />
      <ellipse cx="122" cy="84" rx="5" ry="2.5" fill="#F59E0B" opacity="0.6" />
      <ellipse cx="100" cy="88" rx="6" ry="3" fill="#F59E0B" opacity="0.6" />

      {/* Cute folded baby polka blanket draped over left edge */}
      <path
        d="M 36 78 C 34 72, 54 70, 64 74 C 70 76, 70 102, 66 112 C 60 118, 38 116, 36 104 Z"
        fill="#FBCFE8"
        stroke="#DB2777"
        strokeWidth="2.2"
      />
      <circle cx="48" cy="86" r="2" fill="#FFFFFF" />
      <circle cx="56" cy="94" r="2" fill="#FFFFFF" />
      <circle cx="44" cy="102" r="2" fill="#FFFFFF" />

      {/* Main Front Wall of Cardboard Box */}
      <rect x="24" y="90" width="152" height="85" rx="12" fill="url(#craftGrad)" stroke="#78350F" strokeWidth="3.5" />

      {/* Open Cardboard Flaps (Left, Right, Back) */}
      {/* Left outward flap */}
      <polygon points="24,90 2,68 38,68 38,90" fill="#FBBF24" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
      {/* Right outward flap */}
      <polygon points="176,90 198,68 162,68 162,90" fill="#FBBF24" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
      {/* Top back flap folded up */}
      <polygon points="55,65 58,46 142,46 145,65" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Cardboard Corrugated Crease Lines */}
      <line x1="26" y1="120" x2="174" y2="120" stroke="#B45309" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      <line x1="26" y1="150" x2="174" y2="150" stroke="#B45309" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />

      {/* Front Center: Cute Paw Print Stamp (🐾) */}
      <g fill="#9A3412">
        {/* Palm pad */}
        <ellipse cx="100" cy="132" rx="10" ry="8" />
        {/* 4 toe pads */}
        <circle cx="88" cy="120" r="3.5" />
        <circle cx="96" cy="116" r="3.8" />
        <circle cx="104" cy="116" r="3.8" />
        <circle cx="112" cy="120" r="3.5" />
      </g>

      {/* Masking tape stamp "CAT ONLY ♥" */}
      <g transform="rotate(-3 100 156)">
        <rect x="68" y="148" width="64" height="18" rx="3" fill="#FEF3C7" stroke="#EA580C" strokeWidth="1.8" opacity="0.95" />
        <text x="100" y="161" textAnchor="middle" fontSize="10" fontWeight="900" fill="#9A3412" letterSpacing="1">
          CAT ONLY ♥
        </text>
      </g>

      {/* Fragile arrow / handle cutout */}
      <rect x="36" y="130" width="16" height="6" rx="3" fill="#78350F" opacity="0.6" />
      <rect x="148" y="130" width="16" height="6" rx="3" fill="#78350F" opacity="0.6" />
    </g>
  </svg>
);

// 3. Fish Rattan Basket (생선 모양 간단 바구니 - 둥근 라탄 바구니 침대, 보들보들 하늘색 쿠션)
export const FishBasketBedIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="basketShadow" x="-12%" y="-12%" width="124%" height="124%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#78350F" floodOpacity="0.18" />
      </filter>
      <linearGradient id="basketWickerGrad" x1="30" y1="60" x2="170" y2="180" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="softBlueCushion" x1="40" y1="70" x2="160" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F0F9FF" />
        <stop offset="60%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>

    <g filter="url(#basketShadow)">
      {/* Basket Rim Back */}
      <ellipse cx="100" cy="85" rx="76" ry="34" fill="#92400E" stroke="#78350F" strokeWidth="3" />

      {/* Spacious Soft Baby-Blue Cushion for kitten */}
      <ellipse cx="100" cy="94" rx="66" ry="28" fill="url(#softBlueCushion)" stroke="#0284C7" strokeWidth="2.5" />
      {/* Fluffy tufts on baby-blue cushion */}
      <ellipse cx="80" cy="92" rx="7" ry="3.5" fill="#38BDF8" opacity="0.5" />
      <ellipse cx="120" cy="92" rx="7" ry="3.5" fill="#38BDF8" opacity="0.5" />
      <ellipse cx="100" cy="100" rx="8" ry="4" fill="#38BDF8" opacity="0.5" />
      {/* Tiny white cloud emblem embroidered on cushion */}
      <path
        d="M 94 92 C 92 89, 96 86, 99 87 C 101 84, 105 85, 106 88 C 108 88, 109 91, 107 93 C 105 94, 95 94, 94 92 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Main Woven Basket Tub (Chubby, Deep, Rounded) */}
      <path
        d="M 22 92 
           C 20 135, 45 168, 100 168 
           C 155 168, 180 135, 178 92 
           C 160 110, 140 116, 100 116 
           C 60 116, 40 110, 22 92 Z"
        fill="url(#basketWickerGrad)"
        stroke="#78350F"
        strokeWidth="3.5"
      />

      {/* Woven Cross-Hatch Rattan Texture */}
      <g stroke="#92400E" strokeWidth="2" opacity="0.65" fill="none">
        <path d="M 38 108 Q 100 148 162 108" />
        <path d="M 44 124 Q 100 156 156 124" />
        <path d="M 56 140 Q 100 164 144 140" />

        {/* Vertical woven ribs */}
        <path d="M 50 102 Q 52 140 65 152" />
        <path d="M 75 110 Q 78 148 85 162" />
        <path d="M 100 116 L 100 168" />
        <path d="M 125 110 Q 122 148 115 162" />
        <path d="M 150 102 Q 148 140 135 152" />
      </g>

      {/* Left Handle: Woven Fish Head Profile */}
      <g>
        <path
          d="M 24 88 C 10 75, 4 92, 14 104 C 20 108, 24 100, 24 88 Z"
          fill="#F59E0B"
          stroke="#78350F"
          strokeWidth="2.8"
        />
        {/* Fish mouth */}
        <path d="M 7 92 L 12 94" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        {/* Fish cute round button eye */}
        <circle cx="15" cy="88" r="3.2" fill="#FFFFFF" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="14.5" cy="87.5" r="1.5" fill="#1E293B" />
      </g>

      {/* Right Handle: Woven Fish Tail Fin */}
      <g>
        <path
          d="M 176 88 C 188 74, 198 76, 194 92 C 190 98, 198 106, 186 108 C 178 106, 176 98, 176 88 Z"
          fill="#F59E0B"
          stroke="#78350F"
          strokeWidth="2.8"
        />
        <line x1="180" y1="90" x2="192" y2="85" stroke="#78350F" strokeWidth="1.8" />
        <line x1="180" y1="95" x2="192" y2="98" stroke="#78350F" strokeWidth="1.8" />
      </g>

      {/* Braided Basket Rim Trim */}
      <ellipse cx="100" cy="94" rx="76" ry="14" fill="none" stroke="#D97706" strokeWidth="4" strokeDasharray="6 4" />
      <ellipse cx="100" cy="94" rx="76" ry="14" fill="none" stroke="#78350F" strokeWidth="1.8" />
    </g>
  </svg>
);

// 4. Cloud Bed (포근한 구름 침대 - 몽실몽실 솜사탕 구름)
export const CloudBedIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="cloudBedShadow" x="-12%" y="-12%" width="124%" height="124%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.18" />
      </filter>
      <linearGradient id="cloudOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="65%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
      <linearGradient id="cloudInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F0F9FF" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>

    <g filter="url(#cloudBedShadow)">
      <circle cx="55" cy="110" r="36" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />
      <circle cx="145" cy="110" r="36" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />
      <circle cx="100" cy="78" r="42" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />
      <circle cx="68" cy="132" r="34" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />
      <circle cx="132" cy="132" r="34" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />
      <circle cx="100" cy="140" r="36" fill="url(#cloudOuterGrad)" stroke="#38BDF8" strokeWidth="4" />

      <ellipse cx="100" cy="120" rx="54" ry="30" fill="url(#cloudInnerGrad)" stroke="#0284C7" strokeWidth="3.5" />

      <ellipse cx="80" cy="116" rx="8" ry="4" fill="#38BDF8" opacity="0.45" />
      <ellipse cx="120" cy="116" rx="8" ry="4" fill="#38BDF8" opacity="0.45" />
      <ellipse cx="100" cy="126" rx="9" ry="4.5" fill="#38BDF8" opacity="0.45" />

      <polygon
        points="100,50 103,58 111,59 105,65 107,73 100,68 93,73 95,65 89,59 97,58"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1.5"
      />
      <polygon
        points="146,82 148,87 153,88 149,92 150,97 146,94 142,97 143,92 139,88 144,87"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1"
      />
    </g>
  </svg>
);

// 5. Cherry Blossom Starry Night Room (벚꽃 밤하늘 방 - 4:3 와이드 인테리어 일러스트)
export const CherryBlossomRoomIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cherryWallGrad" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDF2F8" />
        <stop offset="100%" stopColor="#FCE7F3" />
      </linearGradient>
      <linearGradient id="nightSkyGrad" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E1B4B" />
        <stop offset="60%" stopColor="#2E1065" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="woodFloorCherry" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
    </defs>

    {/* Soft Pink Striped Wallpaper */}
    <rect width="400" height="220" fill="url(#cherryWallGrad)" />
    <g stroke="#FBCFE8" strokeWidth="2" opacity="0.45">
      {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="220" strokeDasharray="6 4" />
      ))}
    </g>

    {/* Warm Hardwood Floor */}
    <rect y="220" width="400" height="80" fill="url(#woodFloorCherry)" />
    <line x1="0" y1="220" x2="400" y2="220" stroke="#EA580C" strokeWidth="3" />
    <line x1="0" y1="250" x2="400" y2="250" stroke="#F97316" strokeWidth="1.2" opacity="0.5" />
    <line x1="0" y1="280" x2="400" y2="280" stroke="#F97316" strokeWidth="1.2" opacity="0.5" />

    {/* Big Arched Window showing Night Sky & Cherry Blossoms */}
    <g>
      {/* Window cutout mask / backdrop */}
      <path
        d="M 60 40 
           C 60 15, 180 15, 180 40 
           L 180 150 L 60 150 Z"
        fill="url(#nightSkyGrad)"
        stroke="#FFFFFF"
        strokeWidth="6"
      />
      {/* Golden Crescent Moon */}
      <path
        d="M 145 35 C 138 35, 130 42, 130 52 C 130 62, 138 69, 148 68 C 142 66, 138 58, 141 50 C 143 44, 146 39, 145 35 Z"
        fill="#FDE047"
      />
      {/* Twinkling Stars */}
      <circle cx="85" cy="45" r="1.8" fill="#FFFFFF" />
      <circle cx="105" cy="35" r="1.2" fill="#FFFFFF" />
      <circle cx="120" cy="65" r="2" fill="#FDE047" />
      <circle cx="75" cy="80" r="1.4" fill="#FFFFFF" />
      <circle cx="95" cy="110" r="1.5" fill="#FFFFFF" />

      {/* Fluttering Cherry Blossom Petals in Night Sky */}
      <g fill="#F472B6" opacity="0.9">
        <ellipse cx="80" cy="55" rx="4" ry="2.5" transform="rotate(-25 80 55)" />
        <ellipse cx="115" cy="85" rx="5" ry="3" transform="rotate(35 115 85)" />
        <ellipse cx="150" cy="115" rx="4.5" ry="2.6" transform="rotate(-15 150 115)" />
        <ellipse cx="70" cy="130" rx="4" ry="2.2" transform="rotate(45 70 130)" />
        <ellipse cx="130" cy="138" rx="5" ry="2.8" transform="rotate(20 130 138)" />
      </g>

      {/* Window Mullions / Wooden Panes */}
      <line x1="120" y1="20" x2="120" y2="150" stroke="#FFFFFF" strokeWidth="3" />
      <line x1="60" y1="90" x2="180" y2="90" stroke="#FFFFFF" strokeWidth="3" />
      {/* Window Sill */}
      <rect x="52" y="148" width="136" height="8" rx="3" fill="#FFFFFF" stroke="#FCE7F3" strokeWidth="1" />
    </g>

    {/* Hanging Moon & Star Pendant Lamp */}
    <g>
      <line x1="280" y1="0" x2="280" y2="60" stroke="#B45309" strokeWidth="1.8" />
      <circle cx="280" cy="60" r="4" fill="#F59E0B" />
      {/* Glowing Star Shade */}
      <polygon
        points="280,48 285,62 300,64 288,74 292,88 280,80 268,88 272,74 260,64 275,62"
        fill="#FEF08A"
        stroke="#F59E0B"
        strokeWidth="2.5"
      />
      {/* Warm Light Glow */}
      <circle cx="280" cy="68" r="28" fill="#FDE047" opacity="0.25" />
    </g>

    {/* Fluffy Round Star Rug on Floor */}
    <ellipse cx="230" cy="255" rx="75" ry="25" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2.5" strokeDasharray="5 3" />
    <polygon points="230,248 233,253 238,254 234,258 235,263 230,260 225,263 226,258 222,254 227,253" fill="#FBBF24" />

    {/* Cozy Low Cat Nightstand with Cherry Blossom Twig Vase */}
    <g>
      <rect x="310" y="180" width="60" height="60" rx="8" fill="#FFFFFF" stroke="#E2B18A" strokeWidth="2.5" />
      <rect x="316" y="190" width="48" height="18" rx="4" fill="#FFF9E8" stroke="#E2B18A" strokeWidth="1.5" />
      <circle cx="340" cy="199" r="2" fill="#EA580C" />
      {/* White Ceramic Vase */}
      <ellipse cx="330" cy="172" rx="7" ry="9" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.8" />
      {/* Twig with blooming cherry blossom */}
      <path d="M 330 165 Q 334 150 342 142" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="342" cy="142" r="4.5" fill="#F472B6" />
      <circle cx="342" cy="142" r="2" fill="#FFFFFF" />
      <circle cx="333" cy="152" r="3.5" fill="#FDA4AF" />
    </g>

    {/* Tiny Picture Frame on Wall */}
    <rect x="220" y="80" width="36" height="42" rx="4" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.5" />
    <circle cx="238" cy="98" r="8" fill="#FCE7F3" />
    <path d="M 235 98 C 235 95, 238 95, 238 97 C 238 95, 241 95, 241 98 C 241 101, 238 103, 238 103 C 238 103, 235 101, 235 98 Z" fill="#E11D48" />
  </svg>
);

// 6. Strawberry Cream Room (딸기 생크림 방 - 4:3 와이드 인테리어 일러스트)
export const StrawberryRoomIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="strawWallGrad" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="100%" stopColor="#FFE4E6" />
      </linearGradient>
      <linearGradient id="creamBedGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FFF5F5" />
      </linearGradient>
      <linearGradient id="woodFloorStraw" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFEDD5" />
        <stop offset="100%" stopColor="#FED7AA" />
      </linearGradient>
    </defs>

    {/* Strawberry Milk Wallpaper */}
    <rect width="400" height="220" fill="url(#strawWallGrad)" />

    {/* Cute Strawberry & Whipped Cream Motif Pattern on Wall */}
    <g opacity="0.5">
      {[
        { x: 40, y: 35 }, { x: 120, y: 35 }, { x: 200, y: 35 }, { x: 280, y: 35 }, { x: 360, y: 35 },
        { x: 80, y: 80 }, { x: 160, y: 80 }, { x: 240, y: 80 }, { x: 320, y: 80 },
        { x: 40, y: 125 }, { x: 200, y: 125 }, { x: 360, y: 125 },
      ].map((pos, idx) => (
        <g key={idx} transform={`translate(${pos.x}, ${pos.y}) scale(0.7)`}>
          <polygon points="0,0 6,12 -6,12" fill="#FB7185" />
          <circle cx="0" cy="0" r="3" fill="#4ADE80" />
        </g>
      ))}
    </g>

    {/* Floor */}
    <rect y="220" width="400" height="80" fill="url(#woodFloorStraw)" />
    <line x1="0" y1="220" x2="400" y2="220" stroke="#FB7185" strokeWidth="3" />
    <line x1="0" y1="250" x2="400" y2="250" stroke="#FDA4AF" strokeWidth="1.2" opacity="0.6" />
    <line x1="0" y1="280" x2="400" y2="280" stroke="#FDA4AF" strokeWidth="1.2" opacity="0.6" />

    {/* Big Window with Scalloped Pink Gingham Curtains */}
    <g>
      <rect x="50" y="30" width="120" height="110" rx="8" fill="#EFF6FF" stroke="#FFFFFF" strokeWidth="5" />
      {/* Outside sunny tree & clouds */}
      <circle cx="130" cy="55" r="14" fill="#FEF08A" />
      <path d="M 60 115 Q 90 95 120 115 Q 150 100 170 115 L 170 140 L 50 140 Z" fill="#86EFAC" />

      {/* Scalloped Gingham Pink Curtains */}
      <path d="M 46 25 Q 75 40 70 135 L 46 135 Z" fill="#F43F5E" />
      <path d="M 174 25 Q 145 40 150 135 L 174 135 Z" fill="#F43F5E" />
      <ellipse cx="110" cy="30" rx="60" ry="12" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1.5" />
      {/* Curtain tie ribbons */}
      <circle cx="56" cy="85" r="4" fill="#FFFFFF" />
      <circle cx="164" cy="85" r="4" fill="#FFFFFF" />
    </g>

    {/* Whipped-Cream Fluffy Bed with Strawberry Cushion */}
    <g>
      {/* Bed Headboard */}
      <path
        d="M 230 140 
           C 230 110, 260 105, 290 105 
           C 320 105, 350 110, 350 140 Z"
        fill="#FFFFFF"
        stroke="#FB7185"
        strokeWidth="3.5"
      />
      {/* Headboard tufting */}
      <circle cx="290" cy="122" r="3" fill="#F43F5E" />

      {/* Fluffy Bed Base */}
      <rect x="220" y="150" width="140" height="80" rx="16" fill="url(#creamBedGrad)" stroke="#FB7185" strokeWidth="3" />

      {/* Soft Pink Quilt with White Dots */}
      <path
        d="M 220 175 C 220 165, 250 160, 290 160 C 330 160, 360 165, 360 175 L 360 230 L 220 230 Z"
        fill="#F43F5E"
        stroke="#BE123C"
        strokeWidth="2.5"
      />
      <circle cx="245" cy="180" r="2.5" fill="#FFFFFF" />
      <circle cx="275" cy="180" r="2.5" fill="#FFFFFF" />
      <circle cx="305" cy="180" r="2.5" fill="#FFFFFF" />
      <circle cx="335" cy="180" r="2.5" fill="#FFFFFF" />
      <circle cx="260" cy="205" r="2.5" fill="#FFFFFF" />
      <circle cx="290" cy="205" r="2.5" fill="#FFFFFF" />
      <circle cx="320" cy="205" r="2.5" fill="#FFFFFF" />

      {/* Plump 3D Strawberry Cushion */}
      <g transform="translate(250, 142)">
        <path d="M 20 10 C 10 2, -2 14, 0 28 C 4 38, 20 48, 20 48 C 20 48, 36 38, 40 28 C 42 14, 30 2, 20 10 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
        {/* Seeds */}
        <circle cx="15" cy="22" r="1.5" fill="#FDE047" />
        <circle cx="25" cy="22" r="1.5" fill="#FDE047" />
        <circle cx="20" cy="32" r="1.5" fill="#FDE047" />
        {/* Calyx leaves */}
        <polygon points="20,10 15,2 20,6 25,2" fill="#22C55E" />
      </g>
    </g>

    {/* Round Scalloped Pink Floor Rug */}
    <ellipse cx="140" cy="255" rx="65" ry="24" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="3" />
    <ellipse cx="140" cy="255" rx="55" ry="18" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="4 3" />
    <text x="140" y="260" textAnchor="middle" fontSize="12" fill="#E11D48">🍓</text>

    {/* Strawberry Milk Carton on Small Side Table */}
    <g>
      <rect x="25" y="180" width="45" height="50" rx="6" fill="#FFFFFF" stroke="#E2B18A" strokeWidth="2.5" />
      {/* Strawberry milk mini box */}
      <rect x="36" y="160" width="18" height="22" rx="3" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1.5" />
      <polygon points="36,160 45,152 54,160" fill="#F43F5E" />
      <text x="45" y="174" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#881337">MILK</text>
    </g>
  </svg>
);

// 7. Green Garden Sunlit Room (햇살 가득 초록 정원 방 - 4:3 와이드 인테리어 일러스트)
export const GreenGardenRoomIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gardenWallGrad" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F0FDF4" />
        <stop offset="100%" stopColor="#DCFCE7" />
      </linearGradient>
      <linearGradient id="sunbeamGrad" x1="50" y1="0" x2="250" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="woodFloorGarden" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
    </defs>

    {/* Light Green Wallpaper with subtle leafy trim */}
    <rect width="400" height="220" fill="url(#gardenWallGrad)" />
    <path d="M 0 15 Q 100 25 200 15 Q 300 25 400 15" stroke="#86EFAC" strokeWidth="2" fill="none" opacity="0.6" />

    {/* Floor */}
    <rect y="220" width="400" height="80" fill="url(#woodFloorGarden)" />
    <line x1="0" y1="220" x2="400" y2="220" stroke="#16A34A" strokeWidth="3" />
    <line x1="0" y1="250" x2="400" y2="250" stroke="#CA8A04" strokeWidth="1.2" opacity="0.4" />
    <line x1="0" y1="280" x2="400" y2="280" stroke="#CA8A04" strokeWidth="1.2" opacity="0.4" />

    {/* Huge Sunlit Bay Window with Outdoors Garden & Butterflies */}
    <g>
      <rect x="70" y="25" width="160" height="135" rx="10" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="6" />
      {/* Golden Sun & Green Rolling Hills Outside */}
      <circle cx="190" cy="50" r="22" fill="#FDE047" />
      <path d="M 70 120 Q 120 90 170 120 Q 210 100 230 120 L 230 160 L 70 160 Z" fill="#4ADE80" />
      <path d="M 120 135 Q 170 115 230 135 L 230 160 L 120 160 Z" fill="#22C55E" />
      {/* Fluttering Yellow Butterfly outside */}
      <g transform="translate(110, 65) scale(0.8)">
        <polygon points="0,0 8,-6 4,4" fill="#FACC15" />
        <polygon points="0,0 -8,-6 -4,4" fill="#FACC15" />
      </g>

      {/* Window panes */}
      <line x1="150" y1="25" x2="150" y2="160" stroke="#FFFFFF" strokeWidth="3.5" />
      <line x1="70" y1="95" x2="230" y2="95" stroke="#FFFFFF" strokeWidth="3.5" />

      {/* Sunbeams Streaming In */}
      <polygon points="120,25 240,280 140,280 70,120" fill="url(#sunbeamGrad)" pointerEvents="none" />
    </g>

    {/* Hanging Ivy Planter from Ceiling */}
    <g>
      <line x1="45" y1="0" x2="45" y2="45" stroke="#78350F" strokeWidth="1.5" />
      <ellipse cx="45" cy="48" rx="14" ry="6" fill="#EA580C" stroke="#9A3412" strokeWidth="1.8" />
      {/* Cascading Ivy Vines */}
      <path d="M 38 52 Q 32 75 36 95" stroke="#16A34A" strokeWidth="2.5" fill="none" />
      <circle cx="34" cy="65" r="3.5" fill="#4ADE80" />
      <circle cx="38" cy="80" r="3.5" fill="#22C55E" />
      <path d="M 52 52 Q 58 75 54 90" stroke="#16A34A" strokeWidth="2.5" fill="none" />
      <circle cx="56" cy="68" r="3.5" fill="#4ADE80" />
    </g>

    {/* Big Potted Monstera Deliciosa with Perforated Leaves */}
    <g transform="translate(290, 130)">
      {/* Terracotta Pot */}
      <polygon points="25,65 15,100 45,100 35,65" fill="#EA580C" stroke="#9A3412" strokeWidth="2.5" />
      <rect x="18" y="60" width="24" height="6" rx="2" fill="#F97316" stroke="#9A3412" strokeWidth="1.5" />
      {/* Big Lush Leaves */}
      <path d="M 30 65 Q 10 30 -5 40 Q 5 10 30 50 Z" fill="#15803D" stroke="#14532D" strokeWidth="2" />
      <circle cx="10" cy="34" r="2" fill="#DCFCE7" />
      <path d="M 30 65 Q 50 20 65 35 Q 55 5 30 50 Z" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
      <circle cx="50" cy="30" r="2.2" fill="#DCFCE7" />
      <path d="M 30 65 Q 30 10 35 5 Q 40 25 30 55 Z" fill="#22C55E" stroke="#14532D" strokeWidth="2" />
    </g>

    {/* Daisy Flower Round Rug on Floor */}
    <g transform="translate(180, 255)">
      {/* Daisy Petals */}
      <circle cx="0" cy="0" r="58" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2.5" />
      {/* Yellow Flower Center */}
      <circle cx="0" cy="0" r="24" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
      <circle cx="-6" cy="-4" r="2.5" fill="#CA8A04" />
      <circle cx="6" cy="-4" r="2.5" fill="#CA8A04" />
      <path d="M -4 4 Q 0 8 4 4" stroke="#CA8A04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// 8. Mint Computer Classroom Room (민트 컴퓨터 교실 방 - 4:3 와이드 인테리어 일러스트)
export const MintComputerRoomIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mintWallGrad" x1="0" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E6FFFA" />
        <stop offset="100%" stopColor="#CCFBF1" />
      </linearGradient>
      <linearGradient id="deskWoodGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="monitorScreenGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>

    {/* Mint School Wallpaper with Subtle Grid */}
    <rect width="400" height="220" fill="url(#mintWallGrad)" />
    <g stroke="#99F6E4" strokeWidth="1" opacity="0.45">
      {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="220" />
      ))}
      {[30, 60, 90, 120, 150, 180, 210].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} />
      ))}
    </g>

    {/* Green Classroom Chalkboard on wall */}
    <rect x="40" y="30" width="130" height="85" rx="8" fill="#134E4A" stroke="#B45309" strokeWidth="5" />
    {/* Chalkboard Drawings */}
    <text x="105" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#A7F3D0" fontFamily="sans-serif">
      냥냥이 컴놀이터 🐾
    </text>
    <path d="M 65 78 Q 105 70 145 78" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 3" fill="none" />
    <text x="105" y="98" textAnchor="middle" fontSize="9" fill="#FEF08A">
      1 + 1 = 💖 야옹!
    </text>

    {/* Floor */}
    <rect y="220" width="400" height="80" fill="#E2E8F0" />
    <line x1="0" y1="220" x2="400" y2="220" stroke="#0D9488" strokeWidth="3" />
    <line x1="0" y1="255" x2="400" y2="255" stroke="#CBD5E1" strokeWidth="1.5" />

    {/* Study Desk */}
    <g>
      {/* Desk surface */}
      <rect x="180" y="145" width="180" height="75" rx="8" fill="url(#deskWoodGrad)" stroke="#0D9488" strokeWidth="3" />
      {/* Desk Legs */}
      <line x1="195" y1="220" x2="195" y2="265" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" />
      <line x1="345" y1="220" x2="345" y2="265" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" />

      {/* Pastel Lavender Computer Monitor with Cat Ears */}
      <g transform="translate(225, 75)">
        {/* Cat ears on monitor casing */}
        <polygon points="20,10 10,-8 32,2" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
        <polygon points="70,10 80,-8 58,2" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
        <polygon points="18,6 12,-4 26,2" fill="#F472B6" />
        <polygon points="72,6 78,-4 64,2" fill="#F472B6" />

        {/* Monitor Casing */}
        <rect x="0" y="8" width="90" height="62" rx="10" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="3" />
        {/* Screen with Smiling Cat Mascot */}
        <rect x="6" y="14" width="78" height="50" rx="6" fill="url(#monitorScreenGrad)" stroke="#0284C7" strokeWidth="1.5" />

        {/* 2D Smiling Cat Mascot Face on Screen */}
        <circle cx="45" cy="38" r="16" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.8" />
        <polygon points="33,26 30,18 40,23" fill="#F59E0B" />
        <polygon points="57,26 60,18 50,23" fill="#F59E0B" />
        <circle cx="39" cy="36" r="2" fill="#1E293B" />
        <circle cx="51" cy="36" r="2" fill="#1E293B" />
        <path d="M 42 41 Q 45 44 48 41" stroke="#78350F" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Monitor Stand */}
        <rect x="40" y="70" width="10" height="12" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x="30" y="80" width="30" height="6" rx="3" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
      </g>

      {/* Pastel Keyboard & Mouse */}
      <rect x="220" y="172" width="65" height="18" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.8" />
      {/* Keyboard rainbow keys */}
      <g fill="#F472B6" opacity="0.8">
        <rect x="224" y="176" width="6" height="4" rx="1" />
        <rect x="232" y="176" width="6" height="4" rx="1" fill="#60A5FA" />
        <rect x="240" y="176" width="6" height="4" rx="1" fill="#4ADE80" />
        <rect x="248" y="176" width="6" height="4" rx="1" fill="#FACC15" />
        <rect x="256" y="176" width="6" height="4" rx="1" fill="#FB7185" />
        <rect x="236" y="182" width="24" height="4" rx="1" fill="#FFFFFF" />
      </g>
      {/* Cat Paw Mousepad & Mouse */}
      <ellipse cx="305" cy="182" rx="12" ry="10" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1.2" />
      <ellipse cx="305" cy="182" rx="6" ry="8" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />

      {/* Mini Bookshelf on Desk Side */}
      <g transform="translate(325, 120)">
        <rect x="0" y="0" width="30" height="30" rx="3" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        {/* Colorful Books */}
        <rect x="4" y="6" width="6" height="20" rx="1" fill="#F43F5E" />
        <rect x="12" y="4" width="6" height="22" rx="1" fill="#3B82F6" />
        <rect x="20" y="8" width="6" height="18" rx="1" fill="#10B981" />
      </g>
    </g>

    {/* Ergonomic Cat-Ear Chair */}
    <g transform="translate(130, 175)">
      {/* Backrest with cat ears */}
      <polygon points="20,12 12,-2 30,6" fill="#5EEAD4" stroke="#0F766E" strokeWidth="2" />
      <polygon points="60,12 68,-2 50,6" fill="#5EEAD4" stroke="#0F766E" strokeWidth="2" />
      <rect x="15" y="8" width="50" height="45" rx="14" fill="#99F6E4" stroke="#0F766E" strokeWidth="2.5" />
      {/* Seat cushion */}
      <ellipse cx="40" cy="55" rx="32" ry="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
      {/* Chair stem and wheels */}
      <line x1="40" y1="67" x2="40" y2="95" stroke="#64748B" strokeWidth="4" />
      <line x1="20" y1="95" x2="60" y2="95" stroke="#64748B" strokeWidth="3" />
      <circle cx="20" cy="98" r="3" fill="#1E293B" />
      <circle cx="60" cy="98" r="3" fill="#1E293B" />
    </g>
  </svg>
);

// 9. Detective Hunting Cap (명탐정 헌팅캡 - 고유 일러스트)
export const DetectiveHatIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 20)">
      {/* Cap Dome with Classic Plaid Creases */}
      <path
        d="M 30 110 
           C 25 65, 60 30, 90 30 
           C 120 30, 155 65, 150 110 Z"
        fill="#92400E"
        stroke="#451A03"
        strokeWidth="3.5"
      />
      {/* Plaid Pattern Lines */}
      <g stroke="#F59E0B" strokeWidth="2" opacity="0.6" strokeDasharray="5 3">
        <line x1="60" y1="38" x2="50" y2="108" />
        <line x1="90" y1="30" x2="90" y2="108" />
        <line x1="120" y1="38" x2="130" y2="108" />
        <path d="M 38 65 Q 90 55 142 65" />
        <path d="M 32 90 Q 90 80 148 90" />
      </g>
      {/* Front & Back Visor Peaks */}
      <path d="M 22 110 Q 90 135 158 110 Q 90 118 22 110 Z" fill="#78350F" stroke="#451A03" strokeWidth="3" />
      {/* Ear flaps tied on top with cute red ribbon */}
      <path d="M 65 35 Q 90 20 115 35 L 105 55 Q 90 48 75 55 Z" fill="#B45309" stroke="#451A03" strokeWidth="2.5" />
      {/* Ribbon bow on top */}
      <circle cx="90" cy="22" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1.8" />
      <polygon points="90,22 75,15 78,28" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
      <polygon points="90,22 105,15 102,28" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
    </g>
  </svg>
);

// 10. Heart Sunglasses (하트 핑크 선글라스 - 고유 일러스트)
export const HeartGlassesIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 20)">
      {/* Bridge */}
      <line x1="82" y1="88" x2="98" y2="88" stroke="#E11D48" strokeWidth="5" strokeLinecap="round" />
      {/* Left Heart Lens Frame */}
      <path
        d="M 52 115 
           C 25 85, 20 55, 48 55 
           C 62 55, 75 68, 75 80 
           C 75 68, 88 55, 102 55 
           C 130 55, 125 85, 98 115 Z"
        transform="translate(-25, 0) scale(0.85)"
        fill="#FB7185"
        stroke="#E11D48"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Right Heart Lens Frame */}
      <path
        d="M 52 115 
           C 25 85, 20 55, 48 55 
           C 62 55, 75 68, 75 80 
           C 75 68, 88 55, 102 55 
           C 130 55, 125 85, 98 115 Z"
        transform="translate(65, 0) scale(0.85)"
        fill="#FB7185"
        stroke="#E11D48"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Shiny lens glints */}
      <path d="M 38 65 Q 52 62 56 74" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M 128 65 Q 142 62 146 74" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

// 11. Star Sunglasses (반짝별 노랑 선글라스 - 고유 일러스트)
export const StarGlassesIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 20)">
      {/* Bridge */}
      <line x1="80" y1="80" x2="100" y2="80" stroke="#CA8A04" strokeWidth="5" strokeLinecap="round" />
      {/* Left Star Frame */}
      <polygon
        points="50,45 58,68 82,68 64,82 70,105 50,92 30,105 36,82 18,68 42,68"
        fill="#FDE047"
        stroke="#CA8A04"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Right Star Frame */}
      <polygon
        points="130,45 138,68 162,68 144,82 150,105 130,92 110,105 116,82 98,68 122,68"
        fill="#FDE047"
        stroke="#CA8A04"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Glints */}
      <polygon points="50,60 52,65 57,66 53,70 54,75 50,72 46,75 47,70 43,66 48,65" fill="#FFFFFF" />
      <polygon points="130,60 132,65 137,66 133,70 134,75 130,72 126,75 127,70 123,66 128,65" fill="#FFFFFF" />
    </g>
  </svg>
);

// Accessories
export const RedRibbonIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 10)">
      <path d="M 90 90 C 45 45, 20 60, 30 95 C 40 125, 65 110, 90 90 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
      <path d="M 45 78 Q 70 85 85 90" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
      <path d="M 90 90 C 135 45, 160 60, 150 95 C 140 125, 115 110, 90 90 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
      <path d="M 135 78 Q 110 85 95 90" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
      <path d="M 82 95 Q 65 140 50 155 L 75 148 L 90 105 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
      <path d="M 98 95 Q 115 140 130 155 L 105 148 L 90 105 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
      <ellipse cx="90" cy="90" rx="16" ry="14" fill="#F87171" stroke="#991B1B" strokeWidth="3.5" />
    </g>
  </svg>
);

export const PinkRibbonIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 10)">
      <path d="M 90 90 C 40 45, 18 62, 28 95 C 38 125, 65 110, 90 90 Z" fill="#F472B6" stroke="#9D174D" strokeWidth="3.5" />
      <path d="M 90 90 C 140 45, 162 62, 152 95 C 142 125, 115 110, 90 90 Z" fill="#F472B6" stroke="#9D174D" strokeWidth="3.5" />
      <circle cx="50" cy="80" r="4" fill="#FFFFFF" />
      <circle cx="65" cy="95" r="3.5" fill="#FFFFFF" />
      <circle cx="130" cy="80" r="4" fill="#FFFFFF" />
      <circle cx="115" cy="95" r="3.5" fill="#FFFFFF" />
      <ellipse cx="90" cy="90" rx="16" ry="14" fill="#FBCFE8" stroke="#9D174D" strokeWidth="3.5" />
      <circle cx="90" cy="90" r="4" fill="#FFFFFF" />
    </g>
  </svg>
);

export const BlueBowtieIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 15)">
      <polygon points="90,85 30,55 30,115" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="90,85 150,55 150,115" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="90" cy="85" rx="14" ry="18" fill="#BAE6FD" stroke="#0369A1" strokeWidth="3.5" />
    </g>
  </svg>
);

export const GoldBellIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 75 Q 100 115 170 75" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" fill="none" />
    <path d="M 30 75 Q 100 115 170 75" stroke="#991B1B" strokeWidth="2.5" fill="none" />
    <circle cx="100" cy="115" r="32" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
    <circle cx="92" cy="105" r="7" fill="#FEF3C7" />
    <line x1="85" y1="125" x2="115" y2="125" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
    <circle cx="100" cy="133" r="5" fill="#78350F" />
  </svg>
);

export const PartyHatIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,25 45,160 155,160" fill="#F43F5E" stroke="#9F1239" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 64 120 L 136 120" stroke="#FDE047" strokeWidth="8" />
    <path d="M 76 80 L 124 80" stroke="#38BDF8" strokeWidth="8" />
    <circle cx="100" cy="22" r="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
  </svg>
);

export const ChefHatIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 50 120 
         C 30 100, 30 60, 60 50 
         C 70 30, 110 20, 130 40 
         C 160 40, 175 80, 150 120 Z"
      fill="#FFFFFF"
      stroke="#475569"
      strokeWidth="4"
    />
    <rect x="52" y="120" width="96" height="35" rx="6" fill="#F8FAFC" stroke="#475569" strokeWidth="3.5" />
  </svg>
);

export const CrownIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="35,145 45,65 75,105 100,45 125,105 155,65 165,145"
      fill="#FBBF24"
      stroke="#B45309"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect x="35" y="140" width="130" height="20" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="3.5" />
    <circle cx="100" cy="45" r="7" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
    <circle cx="45" cy="65" r="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <circle cx="155" cy="65" r="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
  </svg>
);

export const RoundGlassesIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="62" cy="100" r="34" fill="#F8FAFC" stroke="#334155" strokeWidth="5" />
    <circle cx="138" cy="100" r="34" fill="#F8FAFC" stroke="#334155" strokeWidth="5" />
    <line x1="96" y1="100" x2="104" y2="100" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
    <path d="M 48 85 Q 70 80 75 95" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 124 85 Q 146 80 151 95" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const SweaterIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 70 55 L 40 85 L 55 105 L 72 85 L 72 150 L 128 150 L 128 85 L 145 105 L 160 85 L 130 55 Z"
      fill="#FB7185"
      stroke="#BE123C"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M 70 55 Q 100 70 130 55" stroke="#FEE2E2" strokeWidth="6" fill="none" />
    <line x1="90" y1="80" x2="90" y2="140" stroke="#FEE2E2" strokeWidth="3" strokeDasharray="6 4" />
    <line x1="110" y1="80" x2="110" y2="140" stroke="#FEE2E2" strokeWidth="3" strokeDasharray="6 4" />
    <polygon points="100,100 93,112 107,112" fill="#DC2626" />
    <circle cx="100" cy="98" r="3" fill="#22C55E" />
  </svg>
);

export const OverallsIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 65 75 L 135 75 L 135 155 L 105 155 L 105 125 L 95 125 L 95 155 L 65 155 Z"
      fill="#3B82F6"
      stroke="#1D4ED8"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect x="70" y="45" width="14" height="40" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
    <rect x="116" y="45" width="14" height="40" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
    <circle cx="77" cy="80" r="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <circle cx="123" cy="80" r="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
    <rect x="85" y="90" width="30" height="24" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2.5" />
  </svg>
);

export const UniformIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 60 55 L 140 55 L 135 150 L 65 150 Z"
      fill="#FDE047"
      stroke="#CA8A04"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <polygon points="90,55 100,75 110,55" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <rect x="135" y="70" width="34" height="52" rx="10" fill="#EA580C" stroke="#9A3412" strokeWidth="3" />
    <rect x="142" y="82" width="20" height="18" rx="4" fill="#FDBA74" stroke="#9A3412" strokeWidth="2" />
  </svg>
);

export const WizardCapeIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 75 50 Q 100 40 125 50 L 155 155 Q 100 145 45 155 Z"
      fill="#7C3AED"
      stroke="#5B21B6"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <polygon points="100,85 103,93 111,94 105,100 107,108 100,103 93,108 95,100 89,94 97,93" fill="#FDE047" />
    <polygon points="75,120 77,125 82,126 78,130 79,135 75,132 71,135 72,130 68,126 73,125" fill="#FDE047" />
  </svg>
);

// Master Renderer Mapping (Strictly Unique per Item ID)
export const ItemIllustration: React.FC<ItemIllustrationProps> = ({ itemId, className = 'w-full h-full' }) => {
  switch (itemId) {
    // Beds & Loungers
    case 'bed_blanket':
      return <BlanketIllustration className={className} />;
    case 'bed_cloud':
      return <CloudBedIllustration className={className} />;
    case 'bed_box':
      return <BoxBedIllustration className={className} />;
    case 'bed_fish_basket':
      return <FishBasketBedIllustration className={className} />;

    // Room Themes (4:3 Wide 2D Storybook Interiors)
    case 'bg_starry':
    case 'cherry_blossom_room':
    case 'room_cherry_blossom':
      return <CherryBlossomRoomIllustration className={className} />;
    case 'bg_strawberry':
    case 'strawberry_room':
    case 'room_strawberry':
      return <StrawberryRoomIllustration className={className} />;
    case 'bg_garden':
    case 'green_garden_room':
    case 'room_green_garden':
      return <GreenGardenRoomIllustration className={className} />;
    case 'bg_mint_classroom':
    case 'mint_computer_room':
    case 'room_mint_computer':
      return <MintComputerRoomIllustration className={className} />;

    // Ribbons
    case 'ribbon_red':
      return <RedRibbonIllustration className={className} />;
    case 'ribbon_pink':
      return <PinkRibbonIllustration className={className} />;
    case 'ribbon_blue':
      return <BlueBowtieIllustration className={className} />;
    case 'ribbon_gold_bell':
      return <GoldBellIllustration className={className} />;

    // Hats
    case 'hat_party':
      return <PartyHatIllustration className={className} />;
    case 'hat_chef':
      return <ChefHatIllustration className={className} />;
    case 'hat_crown':
      return <CrownIllustration className={className} />;
    case 'hat_detective':
      return <DetectiveHatIllustration className={className} />;

    // Glasses
    case 'glasses_round':
      return <RoundGlassesIllustration className={className} />;
    case 'glasses_heart':
      return <HeartGlassesIllustration className={className} />;
    case 'glasses_star':
      return <StarGlassesIllustration className={className} />;

    // Clothes
    case 'clothes_sweater':
      return <SweaterIllustration className={className} />;
    case 'clothes_overalls':
      return <OverallsIllustration className={className} />;
    case 'clothes_uniform':
      return <UniformIllustration className={className} />;
    case 'clothes_wizard':
      return <WizardCapeIllustration className={className} />;

    default:
      if (itemId.includes('cherry') || itemId.includes('starry')) {
        return <CherryBlossomRoomIllustration className={className} />;
      }
      if (itemId.includes('strawberry')) {
        return <StrawberryRoomIllustration className={className} />;
      }
      if (itemId.includes('garden')) {
        return <GreenGardenRoomIllustration className={className} />;
      }
      if (itemId.includes('mint') || itemId.includes('classroom')) {
        return <MintComputerRoomIllustration className={className} />;
      }
      if (itemId.includes('box')) {
        return <BoxBedIllustration className={className} />;
      }
      if (itemId.includes('fish') || itemId.includes('basket')) {
        return <FishBasketBedIllustration className={className} />;
      }
      if (itemId.includes('cloud')) {
        return <CloudBedIllustration className={className} />;
      }
      return <BlanketIllustration className={className} />;
  }
};
