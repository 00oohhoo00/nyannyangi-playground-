export type CatSpeciesId = 
  | 'cheesenyang' 
  | 'somnyang' 
  | 'cloudnyang' 
  | 'starbyulnyang' 
  | 'bamnyang' 
  | 'mochanyang';

export interface CatSpecies {
  id: CatSpeciesId;
  name: string;
  tagline: string;
  description: string;
  bodyColor: string;
  stripeColor?: string;
  bellyColor: string;
  eyeColor: string;
  earColor: string;
  earInnerColor: string;
  tailColor: string;
  personality: string;
}

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameRecord {
  completed: boolean;
  bestScore: number;
  stars: number; // 0-3
  firstClearRewardClaimed?: boolean;
}

export interface StudentGameStats {
  easy: GameRecord;
  normal: GameRecord;
  hard: GameRecord;
  playCount: number;
}

export interface RoomItem {
  id: string;
  itemId: string;
  name: string;
  category: 'bed' | 'cushion' | 'toy' | 'carpet' | 'furniture' | 'wallpaper' | 'decoration';
  icon: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
}

export interface StudentProfile {
  id: string;
  personalCode: string; // e.g. "NYANG-7821"
  entranceCodeHash: string; // SHA-256 hashed entrance code (never stored in plaintext)
  name: string;
  school: string;
  gradeClass: string;
  catType: CatSpeciesId;
  catName: string;
  hasChosenCat?: boolean; // Whether the student has completed their first-time cat selection
  level: number;
  exp: number;
  choco: number;
  gameStats: Record<number, StudentGameStats>;
  inventory: {
    ribbons: string[];
    hats: string[];
    glasses: string[];
    clothes: string[];
    beds: string[];
    wallpapers: string[];
    decorations: string[];
  };
  equipped: {
    ribbon?: string;
    hat?: string;
    glasses?: string;
    clothes?: string;
    bed?: string;
    wallpaper?: string;
  };
  roomItems: RoomItem[];
  unlockedStickers: string[]; // sticker IDs
  lastLoginDate: string; // YYYY-MM-DD
  dailyBonusClaimedDates: string[];
  createdAt: string;
}

export interface StickerItem {
  id: string;
  name: string;
  rarity: 'normal' | 'shiny' | 'legendary';
  category: '고양이' | '간식' | '자연' | '장난감' | '마법';
  description: string;
  icon: string;
  bgColor: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'ribbon' | 'hat' | 'glasses' | 'clothes' | 'bed' | 'wallpaper' | 'decoration';
  price: number;
  description: string;
  icon: string;
  previewColor?: string;
  unlockLevel?: number;
  imageKey?: string;
  imagePath?: string;
}
