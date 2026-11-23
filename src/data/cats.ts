import { CatSpecies, CatSpeciesId } from '../types';

export const CAT_SPECIES: Record<CatSpeciesId, CatSpecies> = {
  cheesenyang: {
    id: 'cheesenyang',
    name: '치즈냥',
    tagline: '연한 살구색 줄무늬',
    description: '동글동글 말랑한 살구빛 털에 부드러운 줄무늬가 있는 귀여운 아기 고양이예요.',
    bodyColor: '#FFE7D1', // soft pastel warm apricot
    stripeColor: '#FDBA74', // soft pastel peach
    bellyColor: '#FFF7ED',
    eyeColor: '#2D231E', // soft button dark eye
    earColor: '#FFDFC2',
    earInnerColor: '#FECDD3',
    tailColor: '#FDBA74',
    personality: '호기심 많고 활발함',
  },
  somnyang: {
    id: 'somnyang',
    name: '솜냥',
    tagline: '포근한 하얀색',
    description: '마시멜로처럼 몽실몽실하고 포근한 순백색 털을 가진 순한 아기 고양이예요.',
    bodyColor: '#FFFFFF', // pure cozy fluffy white
    stripeColor: undefined,
    bellyColor: '#FAFAF9',
    eyeColor: '#2D231E',
    earColor: '#F8FAFC',
    earInnerColor: '#FDE2E4',
    tailColor: '#F8FAFC',
    personality: '순하고 다정함',
  },
  cloudnyang: {
    id: 'cloudnyang',
    name: '구름냥',
    tagline: '부드러운 연회색',
    description: '은은한 아침 안개 구름처럼 포근하고 부드러운 연회색 털을 지닌 아기 고양이예요.',
    bodyColor: '#DDE3EA', // soft pastel dove light grey
    stripeColor: '#B8C5D3',
    bellyColor: '#F1F5F9',
    eyeColor: '#2D231E',
    earColor: '#CFD8E3',
    earInnerColor: '#FECDD3',
    tailColor: '#CFD8E3',
    personality: '차분하고 관찰력 뛰어남',
  },
  starbyulnyang: {
    id: 'starbyulnyang',
    name: '별냥',
    tagline: '귀여운 파스텔 삼색',
    description: '포근한 크림색 바탕에 살구빛과 연회색 파스텔 무늬가 콕콕 박힌 사랑스러운 삼색 고양이예요.',
    bodyColor: '#FFFDF9', // soft cream base
    stripeColor: '#FED7AA', // pastel peach patches
    bellyColor: '#FFFDF9',
    eyeColor: '#2D231E',
    earColor: '#FED7AA',
    earInnerColor: '#FECDD3',
    tailColor: '#FED7AA',
    personality: '행운을 부르는 똑똑이',
  },
  bamnyang: {
    id: 'bamnyang',
    name: '밤냥',
    tagline: '부드러운 검정색',
    description: '까만 흑임자 찹쌀떡처럼 부드럽고 말랑한 짙은 차콜빛 털을 가진 귀염둥이 아기 고양이예요.',
    bodyColor: '#3C3844', // soft warm velvet dark charcoal
    stripeColor: undefined,
    bellyColor: '#4E4957',
    eyeColor: '#1A181E',
    earColor: '#33303A',
    earInnerColor: '#F472B6',
    tailColor: '#33303A',
    personality: '말랑하고 애교 많음',
  },
  mochanyang: {
    id: 'mochanyang',
    name: '모카냥',
    tagline: '연한 크림베이지색',
    description: '달콤한 바닐라 크림라떼처럼 따뜻하고 부드러운 크림베이지 털을 가진 다정한 고양이예요.',
    bodyColor: '#FDF6E4', // soft warm cream beige
    stripeColor: '#D7BFA8', // soft cocoa milk accent
    bellyColor: '#FFFBF2',
    eyeColor: '#2D231E',
    earColor: '#D7BFA8',
    earInnerColor: '#FECDD3',
    tailColor: '#D7BFA8',
    personality: '달콤하고 다정함',
  },
};

export interface LevelInfo {
  level: number;
  title: string;
  minExp: number;
  maxExp: number;
  rewardChoco: number;
  unlockDescription: string;
}

export const LEVEL_TABLE: LevelInfo[] = [
  {
    level: 1,
    title: '아기 냥냥이',
    minExp: 0,
    maxExp: 50,
    rewardChoco: 0,
    unlockDescription: '컴퓨터 모험의 첫걸음!',
  },
  {
    level: 2,
    title: '호기심 냥냥이',
    minExp: 50,
    maxExp: 120,
    rewardChoco: 15,
    unlockDescription: '예쁜 리본과 딸기 스티커가 잠금 해제되었어요!',
  },
  {
    level: 3,
    title: '냥냥 탐험가',
    minExp: 120,
    maxExp: 220,
    rewardChoco: 25,
    unlockDescription: '파티 모자와 푹신한 구름 침대가 해제되었어요!',
  },
  {
    level: 4,
    title: '똑똑한 냥냥이',
    minExp: 220,
    maxExp: 350,
    rewardChoco: 35,
    unlockDescription: '동글 안경과 아기자기한 방 꾸미기 소품 해제!',
  },
  {
    level: 5,
    title: '컴퓨터 박사냥',
    minExp: 350,
    maxExp: 500,
    rewardChoco: 50,
    unlockDescription: '초등 학교 교복과 특별한 방 배경 해제!',
  },
  {
    level: 6,
    title: '냥냥 마스터',
    minExp: 500,
    maxExp: 9999,
    rewardChoco: 100,
    unlockDescription: '전설의 황금 왕관과 최고 냥냥 칭호 획득!',
  },
];

export function getLevelInfo(exp: number): {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  progressPercent: number;
  expInCurrentLevel: number;
  expNeededForNext: number;
} {
  let currentLevel = LEVEL_TABLE[0];
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_TABLE[i].minExp) {
      currentLevel = LEVEL_TABLE[i];
      break;
    }
  }

  const nextLevel = LEVEL_TABLE.find((lvl) => lvl.level === currentLevel.level + 1) || null;
  
  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      expInCurrentLevel: exp - currentLevel.minExp,
      expNeededForNext: 0,
    };
  }

  const expInCurrentLevel = exp - currentLevel.minExp;
  const expNeededForNext = currentLevel.maxExp - currentLevel.minExp;
  const progressPercent = Math.min(100, Math.round((expInCurrentLevel / expNeededForNext) * 100));

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    expInCurrentLevel,
    expNeededForNext,
  };
}
