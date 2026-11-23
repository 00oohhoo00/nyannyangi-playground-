import { StickerItem } from '../types';

export const STICKERS: StickerItem[] = [
  // 30 일반 스티커 (normal)
  { id: 'st_apple', name: '새콤 사과', rarity: 'normal', category: '간식', description: '아삭아삭 상큼한 빨간 사과', icon: '🍎', bgColor: '#FEE2E2' },
  { id: 'st_fish', name: '통통 붕어빵', rarity: 'normal', category: '간식', description: '겨울철 따끈따끈 달콤한 간식', icon: '🐟', bgColor: '#FEF3C7' },
  { id: 'st_strawberry', name: '달콤 딸기', rarity: 'normal', category: '간식', description: '싱싱하고 빨간 꿀딸기 스티커', icon: '🍓', bgColor: '#FFE4E6' },
  { id: 'st_cupcake', name: '체리 컵케이크', rarity: 'normal', category: '간식', description: '부드러운 크림이 올라간 컵케이크', icon: '🧁', bgColor: '#FCE7F3' },
  { id: 'st_candy', name: '줄무늬 사탕', rarity: 'normal', category: '간식', description: '알록달록 달콤한 롤리팝 사탕', icon: '🍭', bgColor: '#F3E8FF' },
  { id: 'st_cookie', name: '초코칩 쿠키', rarity: 'normal', category: '간식', description: '초콜릿 칩이 콕콕 박힌 고소한 쿠키', icon: '🍪', bgColor: '#FED7AA' },
  { id: 'st_icecream', name: '삼색 아이스크림', rarity: 'normal', category: '간식', description: '시원하고 달콤한 콘 아이스크림', icon: '🍦', bgColor: '#FEF9C3' },
  { id: 'st_cheese', name: '삼각 치즈', rarity: 'normal', category: '간식', description: '고소하고 짭조름한 노란 치즈', icon: '🧀', bgColor: '#FEF08A' },
  { id: 'st_milk', name: '고소한 우유팩', rarity: 'normal', category: '간식', description: '뼈가 튼튼해지는 신선한 흰 우유', icon: '🥛', bgColor: '#E0F2FE' },
  { id: 'st_donut', name: '핑크 도넛', rarity: 'normal', category: '간식', description: '스프링클이 뿌려진 딸기 도넛', icon: '🍩', bgColor: '#FBCFE8' },

  { id: 'st_paw', name: '핑크 발바닥', rarity: 'normal', category: '고양이', description: '말랑말랑 분홍 젤리 발바닥', icon: '🐾', bgColor: '#FCE7F3' },
  { id: 'st_yarn', name: '무지개 털실공', rarity: 'normal', category: '장난감', description: '냥냥이가 굴리며 노는 털실', icon: '🧶', bgColor: '#E0E7FF' },
  { id: 'st_bell', name: '딸랑딸랑 방울', rarity: 'normal', category: '장난감', description: '흔들면 맑은 소리가 나는 방울', icon: '🔔', bgColor: '#FEF08A' },
  { id: 'st_ribbon', name: '체크 리본', rarity: 'normal', category: '장난감', description: '목에 매어주는 예쁜 리본', icon: '🎀', bgColor: '#FFE4E6' },
  { id: 'st_toy_mouse', name: '태엽 장난감 쥐', rarity: 'normal', category: '장난감', description: '도르륵 굴러가는 작은 쥐 인형', icon: '🐁', bgColor: '#F1F5F9' },
  { id: 'st_feather', name: '팔랑 깃털 낚싯대', rarity: 'normal', category: '장난감', description: '살랑살랑 흔들면 고양이가 점프!', icon: '🪶', bgColor: '#E0F2FE' },
  { id: 'st_duck', name: '노란 오리 인형', rarity: 'normal', category: '장난감', description: '삑삑 소리가 나는 물오리', icon: '🦆', bgColor: '#FEF9C3' },
  { id: 'st_balloon', name: '둥실 하트 풍선', rarity: 'normal', category: '장난감', description: '하늘로 둥실 떠오르는 풍선', icon: '🎈', bgColor: '#FEE2E2' },
  { id: 'st_bear', name: '젤리 곰인형', rarity: 'normal', category: '장난감', description: '말랑말랑 폭신한 곰인형', icon: '🧸', bgColor: '#FFEDD5' },
  { id: 'st_cat_box', name: '포근한 종이 상자', rarity: 'normal', category: '장난감', description: '냥이들이 쏙 들어가는 행복 박스', icon: '📦', bgColor: '#FEF3C7' },

  { id: 'st_clover', name: '초록 세잎클로버', rarity: 'normal', category: '자연', description: '풀밭에 싱그럽게 피어난 클로버', icon: '☘️', bgColor: '#DCFCE7' },
  { id: 'st_flower', name: '분홍 벚꽃잎', rarity: 'normal', category: '자연', description: '봄바람에 흩날리는 벚꽃잎', icon: '🌸', bgColor: '#FCE7F3' },
  { id: 'st_sunflower', name: '방긋 해바라기', rarity: 'normal', category: '자연', description: '햇살을 향해 방긋 웃는 해바라기', icon: '🌻', bgColor: '#FEF08A' },
  { id: 'st_butterfly', name: '노랑 나비', rarity: 'normal', category: '자연', description: '꽃밭을 살랑살랑 날아다니는 나비', icon: '🦋', bgColor: '#E0F2FE' },
  { id: 'st_cloud', name: '몽실 구름', rarity: 'normal', category: '자연', description: '맑은 하늘에 떠 있는 솜사탕 구름', icon: '☁️', bgColor: '#F1F5F9' },
  { id: 'st_sprout', name: '파릇파릇 새싹', rarity: 'normal', category: '자연', description: '화분에서 쏘옥 돋아난 작은 새싹', icon: '🌱', bgColor: '#DCFCE7' },
  { id: 'st_acorn', name: '통통 도토리', rarity: 'normal', category: '자연', description: '다람쥐가 숨겨놓은 알밤과 도토리', icon: '🌰', bgColor: '#FED7AA' },
  { id: 'st_music', name: '즐거운 음표', rarity: 'normal', category: '자연', description: '신나는 동요 소리가 들려와요', icon: '🎵', bgColor: '#F3E8FF' },
  { id: 'st_star_candy', name: '반짝 별사탕', rarity: 'normal', category: '간식', description: '입안에서 사르르 녹는 작은 별사탕', icon: '⭐', bgColor: '#FEF08A' },
  { id: 'st_shell', name: '무지개 조개', rarity: 'normal', category: '자연', description: '파도 소리가 들리는 바닷가 조개', icon: '🐚', bgColor: '#EDE9FE' },

  // 15 반짝 스티커 (shiny)
  { id: 'st_sh_goldstar', name: '빛나는 황금별', rarity: 'shiny', category: '마법', description: '컴퓨터 마우스 영웅에게 주는 빛나는 별!', icon: '🌟', bgColor: '#FEF08A' },
  { id: 'st_sh_rainbow', name: '일곱빛깔 무지개', rarity: 'shiny', category: '마법', description: '비 온 뒤 하늘에 걸린 꿈결 무지개', icon: '🌈', bgColor: '#FEE2E2' },
  { id: 'st_sh_wand', name: '마법 요술봉', rarity: 'shiny', category: '마법', description: '흔들면 반짝이는 가루가 흩날려요', icon: '🪄', bgColor: '#FCE7F3' },
  { id: 'st_sh_moon', name: '은빛 초승달', rarity: 'shiny', category: '마법', description: '포근한 밤을 지켜주는 은빛 달님', icon: '🌙', bgColor: '#FEF9C3' },
  { id: 'st_sh_crystal', name: '크리스탈 방울', rarity: 'shiny', category: '마법', description: '유리알처럼 맑고 투명한 마법 방울', icon: '🔮', bgColor: '#EDE9FE' },
  { id: 'st_sh_treasure', name: '황금 보물상자', rarity: 'shiny', category: '마법', description: '보석과 초콜릿이 가득 찬 보물상자', icon: '💎', bgColor: '#CFFAFE' },
  { id: 'st_sh_heartwing', name: '날개 달린 하트', rarity: 'shiny', category: '마법', description: '따뜻한 마음이 날개를 달고 날아가요', icon: '💖', bgColor: '#FFE4E6' },
  { id: 'st_sh_shinyfish', name: '황금 비늘 물고기', rarity: 'shiny', category: '간식', description: '물속에서 반짝반짝 빛나는 신비 물고기', icon: '🐠', bgColor: '#FEF08A' },
  { id: 'st_sh_fourclover', name: '행운의 네잎클로버', rarity: 'shiny', category: '자연', description: '발견하는 사람에게 행운을 주는 클로버', icon: '🍀', bgColor: '#BBF7D0' },
  { id: 'st_sh_aurora', name: '오로라 솜구름', rarity: 'shiny', category: '자연', description: '초록과 보랏빛으로 물든 오로라', icon: '🌌', bgColor: '#DDD6FE' },
  { id: 'st_sh_shinypaw', name: '황금 발자국', rarity: 'shiny', category: '고양이', description: '걸을 때마다 반짝이가 묻어나는 발자국', icon: '✨', bgColor: '#FEF3C7' },
  { id: 'st_sh_crown', name: '미니 왕관', rarity: 'shiny', category: '마법', description: '컴퓨터 마우스 챔피언을 위한 왕관', icon: '👑', bgColor: '#FEF08A' },
  { id: 'st_sh_chocotower', name: '초콜릿 탑', rarity: 'shiny', category: '간식', description: '달콤한 초콜릿이 퐁퐁 솟아나는 분수', icon: '🍫', bgColor: '#FFEDD5' },
  { id: 'st_sh_wizardhat', name: '별빛 마법사 모자', rarity: 'shiny', category: '마법', description: '비밀 주문이 깃든 꼬깔 마법 모자', icon: '🧙‍♀️', bgColor: '#E0E7FF' },
  { id: 'st_sh_comet', name: '소원 혜성', rarity: 'shiny', category: '마법', description: '하늘을 가로지르는 반짝이는 꼬리별', icon: '💫', bgColor: '#FEF9C3' },

  // 5 전설 스티커 (legendary)
  { id: 'st_leg_tuna', name: '전설의 황금 참치', rarity: 'legendary', category: '간식', description: '바다 깊은 곳에서 온 고양이들의 최고 영양 간식!', icon: '👑🐟', bgColor: '#FEF08A' },
  { id: 'st_leg_rainbowcrown', name: '무지개 냥냥 크라운', rarity: 'legendary', category: '마법', description: '컴퓨터 놀이터의 모든 게임을 정복한 냥이의 왕관!', icon: '🌈👑', bgColor: '#DDD6FE' },
  { id: 'st_leg_angelwings', name: '천사냥의 날개', rarity: 'legendary', category: '마법', description: '하늘을 자유롭게 날아다니는 순백의 천사 날개!', icon: '🪽✨', bgColor: '#E0F2FE' },
  { id: 'st_leg_spacecat', name: '은하계 우주냥이', rarity: 'legendary', category: '고양이', description: '우주선을 타고 별나라를 탐험하는 우주 비행사 냥이!', icon: '🚀🐱', bgColor: '#C7D2FE' },
  { id: 'st_leg_galaxy', name: '찬란한 은하수 보석', rarity: 'legendary', category: '마법', description: '수억 개의 별빛이 모여 만든 신비로운 우주 보석!', icon: '🪐💎', bgColor: '#FBCFE8' },
];

export const STICKER_MAP = new Map(STICKERS.map((s) => [s.id, s]));
