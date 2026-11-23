import React, { useState } from 'react';
import { CatSpeciesId } from '../types';
import { CAT_SPECIES } from '../data/cats';
import { sound } from '../utils/sound';

interface CatAvatarProps {
  speciesId: CatSpeciesId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  equipped?: {
    ribbon?: string;
    hat?: string;
    glasses?: string;
    clothes?: string;
    bed?: string;
  };
  showBed?: boolean;
  interactive?: boolean;
  className?: string;
}

export const CatAvatar: React.FC<CatAvatarProps> = ({
  speciesId,
  size = 'md',
  equipped = {},
  showBed = false,
  interactive = true,
  className = '',
}) => {
  const [isJumping, setIsJumping] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const species = CAT_SPECIES[speciesId] || CAT_SPECIES.cheesenyang;

  const sizePixels = {
    sm: 96,
    md: 160,
    lg: 240,
    xl: 320,
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;
    sound.playMeow();
    setIsJumping(true);
    setShowHeart(true);
    setTimeout(() => setIsJumping(false), 500);
    setTimeout(() => setShowHeart(false), 1200);
  };

  // Soft warm chocolate outline color across all cats
  const outlineColor = '#5E4032';

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
      title={`${species.name} - 클릭하면 야옹 소리를 내요!`}
    >
      {/* Floating hearts on click */}
      {showHeart && (
        <div className="absolute -top-7 text-2xl animate-bounce pointer-events-none z-30 flex items-center gap-1">
          <span>💖</span>
          <span className="text-xs font-black text-rose-500 bg-white/95 px-2.5 py-0.5 rounded-full shadow-sm border border-pink-200">
            골골송~ 야옹!
          </span>
        </div>
      )}

      {/* Bed backplate if equipped (Pure visuals, zero text) */}
      {showBed && equipped.bed && (
        <div className="absolute -bottom-3 w-[118%] h-[42%] rounded-[40px] pointer-events-none z-0 flex items-center justify-center">
          {equipped.bed === 'bed_blanket' && (
            <div className="w-full h-full rounded-[40px] bg-gradient-to-b from-[#FFFDF0] to-[#FCE7F3] border-4 border-[#FBCFE8] shadow-md flex items-center justify-center relative overflow-hidden">
              {/* Soft quilted mattress tufts */}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-[#FBCFE8]/40 border-t-2 border-dashed border-[#F472B6]/50" />
            </div>
          )}
          {equipped.bed === 'bed_cloud' && (
            <div className="w-full h-full rounded-[40px] bg-gradient-to-b from-[#FFFFFF] via-[#E0F2FE] to-[#BAE6FD] border-4 border-[#38BDF8] shadow-md flex items-center justify-center relative overflow-hidden">
              {/* Puffy cloud pillow lobes */}
              <div className="absolute -top-3 left-3 w-10 h-10 rounded-full bg-white/80 border-2 border-[#7DD3FC]" />
              <div className="absolute -top-4 right-4 w-12 h-12 rounded-full bg-white/80 border-2 border-[#7DD3FC]" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-[#38BDF8]/20" />
            </div>
          )}
          {equipped.bed === 'bed_box' && (
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-[#FDE68A] to-[#D97706] border-4 border-[#78350F] shadow-md relative">
              <div className="absolute top-1 left-3 w-8 h-3 rounded-full bg-[#78350F]/20" />
              <div className="absolute top-1 right-3 w-8 h-3 rounded-full bg-[#78350F]/20" />
            </div>
          )}
          {equipped.bed === 'bed_fish_basket' && (
            <div className="w-full h-full rounded-[36px] bg-gradient-to-b from-[#BAE6FD] to-[#FDE68A] border-4 border-[#B45309] shadow-md relative" />
          )}
        </div>
      )}

      {/* Main SVG Cute Round Baby Cat */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full z-10 transition-transform duration-300 ${
          isJumping ? '-translate-y-3 scale-108' : ''
        }`}
      >
        <defs>
          <filter id="gentleShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#5E4032" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Tail (Small, chubby rounded kitten tail, animated wag) */}
        <g className="animate-cat-tail" style={{ transformOrigin: '142px 148px' }}>
          <path
            d="M 134 146 C 158 140, 172 122, 166 104 C 162 94, 150 96, 151 106 C 153 118, 144 132, 128 142 Z"
            fill={species.tailColor}
            stroke={outlineColor}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Species-specific tail patterns */}
          {speciesId === 'cheesenyang' && (
            <>
              <path d="M 158 108 Q 163 112 155 116" stroke={species.stripeColor} strokeWidth="2.5" fill="none" />
              <path d="M 150 124 Q 157 127 146 133" stroke={species.stripeColor} strokeWidth="2.5" fill="none" />
            </>
          )}
          {speciesId === 'starbyulnyang' && (
            <path d="M 160 102 Q 166 112 154 116" stroke="#CBD5E1" strokeWidth="4" fill="none" />
          )}
          {speciesId === 'mochanyang' && (
            <path d="M 166 104 C 162 94, 150 96, 151 106 Z" fill="#D7BFA8" />
          )}
          {speciesId === 'bamnyang' && (
            <circle cx="160" cy="100" r="5" fill="#FAF8F5" />
          )}
        </g>

        {/* Back Feet (Tiny, chubby rounded paws resting on sides) */}
        <ellipse
          cx="60"
          cy="154"
          rx="13"
          ry="9"
          fill={species.bodyColor}
          stroke={outlineColor}
          strokeWidth="2.8"
        />
        <ellipse
          cx="140"
          cy="154"
          rx="13"
          ry="9"
          fill={species.bodyColor}
          stroke={outlineColor}
          strokeWidth="2.8"
        />

        {/* Chubby, Small Round Body */}
        <ellipse
          cx="100"
          cy="142"
          rx="42"
          ry="32"
          fill={species.bodyColor}
          stroke={outlineColor}
          strokeWidth="2.8"
          filter="url(#gentleShadow)"
        />

        {/* Species Patterns on Body */}
        {speciesId === 'starbyulnyang' && (
          <>
            {/* Peach patch on left body */}
            <path d="M 64 135 Q 76 130 80 150 Q 64 162 60 145 Z" fill="#FED7AA" opacity="0.9" />
            {/* Soft grey patch on right body */}
            <path d="M 125 130 Q 138 135 135 152 Q 120 150 122 135 Z" fill="#CBD5E1" opacity="0.85" />
          </>
        )}

        {speciesId === 'cheesenyang' && (
          <g stroke={species.stripeColor} strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M 72 136 Q 80 140 76 148" />
            <path d="M 128 136 Q 120 140 124 148" />
          </g>
        )}

        {/* Soft Chubby Belly */}
        <ellipse
          cx="100"
          cy="144"
          rx="26"
          ry="20"
          fill={species.bellyColor}
          opacity="0.95"
        />

        {/* Clothes overlay if equipped */}
        {equipped.clothes === 'clothes_sweater' && (
          <g>
            <path d="M 68 130 Q 100 124 132 130 Q 128 158 100 160 Q 72 158 68 130 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
            <line x1="84" y1="133" x2="84" y2="155" stroke="#FFE4E6" strokeWidth="2" />
            <line x1="100" y1="133" x2="100" y2="158" stroke="#FFE4E6" strokeWidth="2" />
            <line x1="116" y1="133" x2="116" y2="155" stroke="#FFE4E6" strokeWidth="2" />
          </g>
        )}
        {equipped.clothes === 'clothes_overalls' && (
          <g>
            <path d="M 74 136 Q 100 132 126 136 L 124 158 L 76 158 Z" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" />
            <line x1="84" y1="126" x2="85" y2="137" stroke="#60A5FA" strokeWidth="3.5" />
            <line x1="116" y1="126" x2="115" y2="137" stroke="#60A5FA" strokeWidth="3.5" />
            <circle cx="85" cy="138" r="2" fill="#FACC15" />
            <circle cx="115" cy="138" r="2" fill="#FACC15" />
          </g>
        )}
        {equipped.clothes === 'clothes_uniform' && (
          <g>
            <path d="M 72 130 Q 100 125 128 130 L 126 156 Q 100 159 74 156 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <polygon points="93,128 100,135 107,128 100,124" fill="#EF4444" />
            {/* Tiny school bag */}
            <rect x="54" y="134" width="14" height="18" rx="4" fill="#EA580C" stroke="#9A3412" strokeWidth="1.8" />
          </g>
        )}
        {equipped.clothes === 'clothes_wizard' && (
          <g>
            <path d="M 66 128 Q 100 120 134 128 L 138 162 Q 100 166 62 162 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
            <polygon points="100,138 102,143 107,144 103,148 104,153 100,150 96,153 97,148 93,144 98,143" fill="#FACC15" />
          </g>
        )}

        {/* Short, Tiny Stubby Front Paws (Side by Side) */}
        <ellipse
          cx="86"
          cy="158"
          rx="9.5"
          ry="7.5"
          fill={speciesId === 'bamnyang' ? '#FAF8F5' : species.bodyColor}
          stroke={outlineColor}
          strokeWidth="2.6"
        />
        <ellipse
          cx="114"
          cy="158"
          rx="9.5"
          ry="7.5"
          fill={speciesId === 'bamnyang' ? '#FAF8F5' : species.bodyColor}
          stroke={outlineColor}
          strokeWidth="2.6"
        />
        {/* Cute tiny paw toe lines */}
        <line x1="84" y1="157" x2="84" y2="161" stroke={outlineColor} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="88" y1="157" x2="88" y2="161" stroke={outlineColor} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="112" y1="157" x2="112" y2="161" stroke={outlineColor} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="116" y1="157" x2="116" y2="161" stroke={outlineColor} strokeWidth="1.4" strokeLinecap="round" />

        {/* Cozy Blanket tucked over cat's lower body ONLY when bed_blanket is equipped (Zero text) */}
        {showBed && equipped.bed === 'bed_blanket' && (
          <g filter="url(#gentleShadow)">
            {/* Cream quilt base with soft 3D puff */}
            <path
              d="M 44 162 C 38 152, 60 148, 100 150 C 140 148, 162 152, 156 162 C 150 182, 145 188, 100 188 C 55 188, 50 182, 44 162 Z"
              fill="#FFFDF7"
              stroke={outlineColor}
              strokeWidth="2.5"
            />
            {/* Diamond stitches */}
            <path d="M 62 165 L 138 185" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            <path d="M 138 165 L 62 185" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            {/* Folded Soft Pink Cuff */}
            <path
              d="M 42 162 C 40 152, 65 146, 100 148 C 135 146, 160 152, 158 162 C 148 168, 130 166, 100 166 C 70 166, 52 168, 42 162 Z"
              fill="#FBCFE8"
              stroke="#E11D48"
              strokeWidth="2"
            />
            {/* Tiny white polka dots on pink cuff */}
            <circle cx="65" cy="158" r="1.5" fill="#FFFFFF" />
            <circle cx="85" cy="159" r="1.5" fill="#FFFFFF" />
            <circle cx="100" cy="158" r="1.5" fill="#FFFFFF" />
            <circle cx="115" cy="159" r="1.5" fill="#FFFFFF" />
            <circle cx="135" cy="158" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Head Group (Large, Round, Squishy Baby Head) */}
        <g style={{ transformOrigin: '100px 82px' }}>
          {/* Small, Cute Rounded Left Ear */}
          <g className="animate-cat-ear" style={{ transformOrigin: '68px 58px' }}>
            <path
              d="M 52 56 C 48 34, 68 24, 80 42 C 83 47, 82 54, 78 58 Z"
              fill={species.earColor}
              stroke={outlineColor}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Soft pink inner ear pad */}
            <path
              d="M 57 52 C 55 39, 68 33, 75 44 C 77 47, 76 52, 73 54 Z"
              fill={species.earInnerColor}
            />
          </g>

          {/* Small, Cute Rounded Right Ear */}
          <g style={{ transformOrigin: '132px 58px' }}>
            <path
              d="M 148 56 C 152 34, 132 24, 120 42 C 117 47, 118 54, 122 58 Z"
              fill={species.earColor}
              stroke={outlineColor}
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Soft pink inner ear pad */}
            <path
              d="M 143 52 C 145 39, 132 33, 125 44 C 123 47, 124 52, 127 54 Z"
              fill={species.earInnerColor}
            />
          </g>

          {/* Big, Squishy Round Head Base */}
          <ellipse
            cx="100"
            cy="82"
            rx="55"
            ry="49"
            fill={species.bodyColor}
            stroke={outlineColor}
            strokeWidth="2.8"
            filter="url(#gentleShadow)"
          />

          {/* Species-Specific Facial Markings */}
          {speciesId === 'cheesenyang' && (
            <g stroke={species.stripeColor} strokeWidth="2.6" strokeLinecap="round" fill="none">
              {/* Forehead 3 soft stripes */}
              <path d="M 100 48 L 100 58" />
              <path d="M 90 51 Q 93 57 91 62" />
              <path d="M 110 51 Q 107 57 109 62" />
              {/* Cheek stripes */}
              <path d="M 52 82 Q 58 84 55 89" />
              <path d="M 148 82 Q 142 84 145 89" />
            </g>
          )}

          {speciesId === 'cloudnyang' && (
            <g stroke="#B8C5D3" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d="M 100 49 L 100 57" />
              <path d="M 92 52 Q 95 57 93 61" />
              <path d="M 108 52 Q 105 57 107 61" />
            </g>
          )}

          {speciesId === 'starbyulnyang' && (
            <>
              {/* Soft pastel peach patch over right side */}
              <path
                d="M 124 40 Q 152 46 150 78 Q 130 84 122 66 Z"
                fill="#FED7AA"
                opacity="0.9"
              />
              {/* Soft pastel dove-grey patch over left ear side */}
              <path
                d="M 76 40 Q 48 46 50 78 Q 70 84 78 66 Z"
                fill="#CBD5E1"
                opacity="0.85"
              />
              {/* Tiny yellow pastel star emblem on forehead */}
              <polygon
                points="100,50 102,54 107,55 103,58 104,63 100,60 96,63 97,58 93,55 98,54"
                fill="#FDE047"
                stroke={outlineColor}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </>
          )}

          {speciesId === 'mochanyang' && (
            <g>
              {/* Soft mocha cream patch near ear */}
              <path d="M 122 42 Q 145 46 142 64 Q 128 66 122 52 Z" fill="#D7BFA8" opacity="0.65" />
            </g>
          )}

          {/* Small, Pure, Clear Button Bead Eyes (Gentle blinking) */}
          <g className="animate-cat-blink" style={{ transformOrigin: '100px 81px' }}>
            {/* Left Eye */}
            <circle
              cx="83"
              cy="81"
              r="4.4"
              fill={species.eyeColor}
            />
            {/* Tiny shiny white twinkle dot */}
            <circle cx="81.6" cy="79.6" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle
              cx="117"
              cy="81"
              r="4.4"
              fill={species.eyeColor}
            />
            {/* Tiny shiny white twinkle dot */}
            <circle cx="115.6" cy="79.6" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Soft Pastel Pink Cheek Blush */}
          <ellipse
            cx="69"
            cy="89"
            rx="9"
            ry="5.5"
            fill="#FB7185"
            opacity={speciesId === 'bamnyang' ? '0.45' : '0.38'}
          />
          <ellipse
            cx="131"
            cy="89"
            rx="9"
            ry="5.5"
            fill="#FB7185"
            opacity={speciesId === 'bamnyang' ? '0.45' : '0.38'}
          />

          {/* Tiny Cute Soft Pink Button Nose */}
          <polygon
            points="97.5,85 102.5,85 100,88"
            fill="#F472B6"
            stroke="#F472B6"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* Sweet Small 'ㅅ' Smiling Kitten Mouth */}
          <path
            d="M 94.5 89 Q 97.2 92.5 100 89.5 Q 102.8 92.5 105.5 89"
            fill="none"
            stroke={outlineColor}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tiny delicate whiskers (2 subtle strands each side) */}
          <g stroke={outlineColor} strokeWidth="1.4" strokeLinecap="round" opacity="0.6">
            <line x1="56" y1="87" x2="42" y2="85" />
            <line x1="57" y1="91" x2="44" y2="93" />
            <line x1="144" y1="87" x2="158" y2="85" />
            <line x1="143" y1="91" x2="156" y2="93" />
          </g>

          {/* Glasses Overlay (scaled to fit baby face) */}
          {equipped.glasses === 'glasses_round' && (
            <g stroke={outlineColor} strokeWidth="2.4" fill="rgba(255,255,255,0.2)">
              <circle cx="83" cy="81" r="12" />
              <circle cx="117" cy="81" r="12" />
              <line x1="95" y1="81" x2="105" y2="81" strokeWidth="2.4" />
            </g>
          )}
          {equipped.glasses === 'glasses_heart' && (
            <g fill="rgba(244, 63, 94, 0.4)" stroke="#E11D48" strokeWidth="2">
              <path d="M 83 89 L 75 81 A 5 5 0 0 1 83 75 A 5 5 0 0 1 91 81 Z" />
              <path d="M 117 89 L 109 81 A 5 5 0 0 1 117 75 A 5 5 0 0 1 125 81 Z" />
              <line x1="91" y1="80" x2="109" y2="80" stroke="#E11D48" strokeWidth="2.2" />
            </g>
          )}
          {equipped.glasses === 'glasses_star' && (
            <g fill="rgba(234, 179, 8, 0.4)" stroke="#CA8A04" strokeWidth="2">
              <polygon points="83,71 85,78 92,78 87,82 89,89 83,85 77,89 79,82 74,78 81,78" />
              <polygon points="117,71 119,78 126,78 121,82 123,89 117,85 111,89 113,82 108,78 115,78" />
              <line x1="92" y1="80" x2="108" y2="80" stroke="#CA8A04" strokeWidth="2.2" />
            </g>
          )}

          {/* Hats Overlay (scaled to sit gently on rounded head) */}
          {equipped.hat === 'hat_party' && (
            <g>
              <polygon points="100,10 82,42 118,42" fill="#F43F5E" stroke={outlineColor} strokeWidth="2.6" />
              <circle cx="100" cy="10" r="5" fill="#FACC15" stroke={outlineColor} strokeWidth="1.8" />
              <line x1="88" y1="32" x2="112" y2="32" stroke="#FACC15" strokeWidth="2.5" />
              <line x1="92" y1="23" x2="108" y2="23" stroke="#38BDF8" strokeWidth="2.5" />
            </g>
          )}
          {equipped.hat === 'hat_chef' && (
            <g>
              <path
                d="M 83 40 Q 70 24 87 14 Q 100 6 113 14 Q 130 24 117 40 Z"
                fill="#FFFFFF"
                stroke={outlineColor}
                strokeWidth="2.6"
              />
              <rect x="83" y="36" width="34" height="7" rx="2" fill="#F8FAFC" stroke={outlineColor} strokeWidth="1.8" />
            </g>
          )}
          {equipped.hat === 'hat_crown' && (
            <g>
              <polygon points="78,42 82,22 91,32 100,16 109,32 118,22 122,42" fill="#FBBF24" stroke="#B45309" strokeWidth="2.2" />
              <circle cx="82" cy="22" r="2.5" fill="#EF4444" />
              <circle cx="100" cy="16" r="3" fill="#3B82F6" />
              <circle cx="118" cy="22" r="2.5" fill="#EF4444" />
            </g>
          )}
          {equipped.hat === 'hat_detective' && (
            <g>
              <ellipse cx="100" cy="40" rx="30" ry="10" fill="#92400E" stroke={outlineColor} strokeWidth="2.6" />
              <path d="M 78 38 Q 100 18 122 38 Z" fill="#78350F" stroke={outlineColor} strokeWidth="2.6" />
              <rect x="96" y="20" width="8" height="4" rx="2" fill="#F59E0B" />
            </g>
          )}

          {/* Ribbon / Collar Overlay */}
          {equipped.ribbon === 'ribbon_red' && (
            <g>
              <polygon points="100,124 86,117 86,131" fill="#EF4444" stroke="#991B1B" strokeWidth="1.8" />
              <polygon points="100,124 114,117 114,131" fill="#EF4444" stroke="#991B1B" strokeWidth="1.8" />
              <circle cx="100" cy="124" r="4.5" fill="#F87171" stroke="#991B1B" strokeWidth="1.8" />
            </g>
          )}
          {equipped.ribbon === 'ribbon_pink' && (
            <g>
              <polygon points="100,124 85,116 85,132" fill="#EC4899" stroke="#9D174D" strokeWidth="1.8" />
              <polygon points="100,124 115,116 115,132" fill="#EC4899" stroke="#9D174D" strokeWidth="1.8" />
              <circle cx="100" cy="124" r="5" fill="#FBCFE8" stroke="#9D174D" strokeWidth="1.8" />
            </g>
          )}
          {equipped.ribbon === 'ribbon_blue' && (
            <g>
              <polygon points="100,124 87,118 87,130" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.8" />
              <polygon points="100,124 113,118 113,130" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.8" />
              <circle cx="100" cy="124" r="4" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.8" />
            </g>
          )}
          {equipped.ribbon === 'ribbon_gold_bell' && (
            <g>
              <path d="M 83 122 Q 100 126 117 122" stroke="#EF4444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <circle cx="100" cy="127" r="6" fill="#FBBF24" stroke="#B45309" strokeWidth="1.8" />
              <circle cx="100" cy="128" r="1.8" fill="#78350F" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
