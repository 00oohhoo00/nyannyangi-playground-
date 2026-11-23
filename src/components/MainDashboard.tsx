import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Gift,
  Star,
  ArrowRight,
  Play,
  Heart,
  Store,
  Home,
  BookmarkCheck,
  BarChart3,
  MousePointer,
  Keyboard,
  BookOpen,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { CAT_SPECIES, getLevelInfo } from '../data/cats';
import { CatAvatar } from './CatAvatar';
import { sound } from '../utils/sound';
import { GameCard } from './GameCard';
import {
  BasketFishVignette,
  CatPuzzleVignette,
  ContextMenuVignette,
  ArrowKeysVignette,
  SpaceJumpVignette,
  HomeRowVignette,
  TopRowVignette,
  BottomRowVignette,
  StorySentenceVignette,
} from './FairytaleVignettes';

// Image paths from batch generation
const IMG_FISH_BALLOON = '/src/assets/images/card_fish_balloon_1794240491027.jpg';
const IMG_SNACK_TREASURE = '/src/assets/images/card_snack_treasure_1794240516444.jpg';
const IMG_GIFT_BOX = '/src/assets/images/card_gift_box_1794240520187.jpg';
const IMG_PAW_MAZE = '/src/assets/images/card_paw_maze_1794240491694.jpg';
const IMG_STAR_CATCH = '/src/assets/images/card_star_catch_1794240492637.jpg';
const IMG_COLOR_PAINT = '/src/assets/images/card_color_paint_1794240519130.jpg';
const IMG_KEYBOARD_QUEST = '/src/assets/images/card_keyboard_quest_1794240493375.jpg';
const IMG_KEYBOARD_PIANO = '/src/assets/images/card_keyboard_piano_1794240517912.jpg';
const IMG_TYPING_DESK = '/src/assets/images/card_typing_desk_1794240494159.jpg';

interface MainDashboardProps {
  student: StudentProfile;
  onSelectGame: (gameId: number) => void;
  onOpenGames: () => void;
  onOpenCollect: () => void;
  onOpenShop: () => void;
  onOpenMyCat: () => void;
  onOpenRoom: () => void;
  onOpenStickers: () => void;
  onOpenRecords: () => void;
}

const CAT_QUOTES = [
  '동화책 속 컴퓨터 놀이터에서 신나게 모험하자냥! 🐾',
  '마우스 버튼을 딸깍딸깍 눌러봐냥! 🖱️',
  '오늘도 달콤한 초코 모으러 가볼까냥? 🍫',
  '나를 톡톡 클릭하면 기분 좋은 골골송을 불러줄게냥! 💖',
  '반짝이는 스티커를 모아서 도감을 채워보자냥! 🌟',
];

export const MainDashboard: React.FC<MainDashboardProps> = ({
  student,
  onSelectGame,
  onOpenGames,
  onOpenCollect,
  onOpenShop,
  onOpenMyCat,
  onOpenRoom,
  onOpenStickers,
  onOpenRecords,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const species = CAT_SPECIES[student.catType] || CAT_SPECIES.cheesenyang;
  const levelData = getLevelInfo(student.exp);

  const nextQuote = () => {
    sound.playPop();
    setQuoteIdx((prev) => (prev + 1) % CAT_QUOTES.length);
  };

  // Helper to calculate total earned stars
  const totalStars = Object.values(student.gameStats || {}).reduce((acc, stat) => {
    return acc + (stat.easy?.stars || 0) + (stat.normal?.stars || 0) + (stat.hard?.stars || 0);
  }, 0);

  return (
    <div className="w-full flex flex-col items-center select-none pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. 냥냥이 컴놀이터 제목과 고양이 로고
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full text-center py-6 md:py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/90 rounded-full border border-amber-300 text-xs md:text-sm font-black text-amber-950 mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>초등학교 1~2학년을 위한 아기자기 그림책 컴퓨터 놀이터</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
          <span className="text-4xl md:text-5xl">🐱</span>
          <span className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent drop-shadow-xs">
            냥냥이 컴놀이터
          </span>
          <span className="text-3xl md:text-4xl">🎨</span>
        </h1>
        <p className="text-base md:text-lg font-bold text-slate-600 mt-2">
          귀여운 동화 속 아기 고양이와 함께하는 즐거운 마우스 & 키보드 모험!
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 나의 냥냥이 / 초코 뽑기 / 스티커 도감 (Hero 3-Card Strip)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 mb-14">
        {/* Card A: 나의 냥냥이 (Hero Card, 6 cols) */}
        <div className="lg:col-span-6 p-6 md:p-7 bg-white/95 rounded-3xl border-4 border-amber-300 shadow-md flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-2 right-3 text-4xl opacity-15 pointer-events-none">🐾</div>

          <div
            onClick={nextQuote}
            className="cursor-pointer p-3 bg-gradient-to-br from-amber-100 to-rose-100 rounded-3xl border-3 border-amber-300 shadow-inner hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="고양이를 클릭하면 기분 좋은 소리와 말을 해요!"
          >
            <CatAvatar
              speciesId={student.catType}
              size="lg"
              equipped={student.equipped}
              showBed={true}
              interactive={true}
            />
          </div>

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Mascot Speech Bubble */}
            <div
              onClick={nextQuote}
              className="cursor-pointer mb-2.5 py-1.5 px-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs md:text-sm rounded-2xl border-2 border-amber-300 shadow-xs transition-transform hover:scale-102"
            >
              <span>{CAT_QUOTES[quoteIdx]}</span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-1.5">
              <span>🐱</span>
              <span>{student.name}의 {student.catName}</span>
            </h2>
            <div className="text-xs font-bold text-slate-500 mt-0.5">
              {student.school} {student.gradeClass} · {species.name}
            </div>

            {/* EXP bar */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-amber-800 font-black">
                  Lv.{levelData.currentLevel.level} {levelData.currentLevel.title}
                </span>
                <span className="text-slate-500 font-mono">
                  EXP {student.exp} / {levelData.nextLevel ? levelData.nextLevel.minExp : student.exp}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full border border-amber-300 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelData.progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onOpenMyCat();
              }}
              className="mt-3 w-full sm:w-auto py-2 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl border-2 border-amber-500 shadow-xs flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>옷 갈아입히기 & 고양이 정보</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card B: 초코 뽑기 본부 (3 cols) */}
        <div className="lg:col-span-3 p-6 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 rounded-3xl border-3 border-amber-300 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl p-2 bg-white/90 rounded-2xl shadow-xs">🍫</span>
              <span className="text-xs font-black px-2.5 py-1 bg-amber-400 text-amber-950 rounded-xl shadow-xs">
                매일 보너스
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">초코 뽑기 본부</h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              매일 출석 보너스 10초코를 받고 게임별 초코 획득 규칙을 확인해요!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">내 보유 초코</span>
              <span className="text-xl font-black text-amber-900 font-mono">{student.choco}개</span>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onOpenCollect();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-xs rounded-xl border border-amber-500 shadow-xs flex items-center justify-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
            >
              <span>초코 받으러 가기</span>
              <Gift className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card C: 스티커 도감 (3 cols) */}
        <div className="lg:col-span-3 p-6 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 rounded-3xl border-3 border-purple-300 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl p-2 bg-white/90 rounded-2xl shadow-xs">🌟</span>
              <span className="text-xs font-black px-2.5 py-1 bg-purple-500 text-white rounded-xl shadow-xs">
                50종 수집
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">냥냥 스티커 도감</h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              일반 30종, 반짝 15종, 전설 5종 스티커를 모아 도감을 가득 채워요!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">수집 현황</span>
              <span className="text-base font-black text-purple-900 font-mono">
                {student.unlockedStickers?.length || 0} / 50개
              </span>
            </div>
            <button
              onClick={() => {
                sound.playPop();
                onOpenStickers();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-xs rounded-xl border border-purple-600 shadow-xs flex items-center justify-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
            >
              <span>도감 펼치기</span>
              <BookmarkCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 마우스 놀이터 (9 Fairytale Game Cards, 4 per row on desktop)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b-3 border-teal-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-teal-100 text-teal-900 rounded-full text-xs font-black mb-1 border border-teal-300">
              <MousePointer className="w-3.5 h-3.5" />
              <span>기초 마우스 조작 집중 훈련</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>🐾</span>
              <span>마우스 놀이터</span>
            </h2>
            <p className="text-[15px] md:text-[17px] font-bold text-slate-600">
              마우스 왼쪽 클릭, 더블클릭, 드래그 앤 드롭, 우클릭을 그림책처럼 재미있게 배워요!
            </p>
          </div>
          <span className="text-xs font-black text-teal-800 bg-white/90 px-3 py-1.5 rounded-xl border border-teal-200 shrink-0">
            총 9개 마우스 게임
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Game 1: 생선 풍선 톡톡 */}
          <GameCard
            id={1}
            title="생선 풍선 톡톡"
            categoryTag="마우스 왼쪽 클릭"
            description="하늘에 둥실 떠오르는 알록달록 생선 풍선을 마우스로 톡톡 터뜨려요!"
            imageSrc={IMG_FISH_BALLOON}
            tapeColor="yellow"
            cardBgColor="bg-[#F0FDF9] border-[#99F6E4]"
            stats={student.gameStats?.[1]}
            onClick={() => onSelectGame(1)}
            badgeText="★ 게임 1 ★"
          />

          {/* Game 2: 냥냥 보물찾기 (고양이 간식 찾기) */}
          <GameCard
            id={2}
            title="냥냥 보물찾기"
            categoryTag="정밀 조준 클릭"
            description="장난감과 블록 사이에 꼭꼭 숨겨진 맛있는 생선 간식을 정확히 찾아요!"
            imageSrc={IMG_SNACK_TREASURE}
            tapeColor="pink"
            cardBgColor="bg-[#FFF7ED] border-[#FED7AA]"
            stats={student.gameStats?.[2]}
            onClick={() => onSelectGame(2)}
            badgeText="★ 게임 2 ★"
          />

          {/* Game 3: 선물상자 열기 */}
          <GameCard
            id={3}
            title="선물상자 열기"
            categoryTag="더블클릭 (두 번 톡톡)"
            description="리본 달린 선물상자를 마우스로 빠르게 두 번 톡톡 눌러서 열어보아요!"
            imageSrc={IMG_GIFT_BOX}
            tapeColor="lavender"
            cardBgColor="bg-[#FDF2F8] border-[#FBCFE8]"
            stats={student.gameStats?.[3]}
            onClick={() => onSelectGame(3)}
            badgeText="★ 게임 3 ★"
          />

          {/* Game 4: 생선 바구니 */}
          <GameCard
            id={4}
            title="생선 바구니"
            categoryTag="드래그 앤 드롭"
            description="팔딱팔딱 생선을 마우스로 꾹 잡고 같은 색깔 바구니에 퐁당 담아주세요!"
            fallbackSvg={<BasketFishVignette />}
            tapeColor="mint"
            cardBgColor="bg-[#FEFCE8] border-[#FEF08A]"
            stats={student.gameStats?.[4]}
            onClick={() => onSelectGame(4)}
            badgeText="★ 게임 4 ★"
          />

          {/* Game 5: 발자국 미로 */}
          <GameCard
            id={5}
            title="발자국 미로"
            categoryTag="섬세한 마우스 제어"
            description="벽에 닿지 않도록 마우스를 조심조심 움직여 꽃밭 미로를 탐험해요!"
            imageSrc={IMG_PAW_MAZE}
            tapeColor="peach"
            cardBgColor="bg-[#F0FDF4] border-[#BBF7D0]"
            stats={student.gameStats?.[5]}
            onClick={() => onSelectGame(5)}
            badgeText="★ 게임 5 ★"
          />

          {/* Game 6: 고양이 퍼즐 */}
          <GameCard
            id={6}
            title="고양이 퍼즐"
            categoryTag="공간 지각 맞추기"
            description="흩어진 퍼즐 조각을 알맞은 자리에 쏙쏙 맞춰 귀여운 고양이 그림을 완성해요!"
            fallbackSvg={<CatPuzzleVignette />}
            tapeColor="blue"
            cardBgColor="bg-[#EFF6FF] border-[#BFDBFE]"
            stats={student.gameStats?.[6]}
            onClick={() => onSelectGame(6)}
            badgeText="★ 게임 6 ★"
          />

          {/* Game 7: 별을 잡아라 */}
          <GameCard
            id={7}
            title="별을 잡아라"
            categoryTag="순발력 스피드 클릭"
            description="밤하늘에 반짝이며 나타나는 아기별들을 재빠르게 콕콕 잡아보세요!"
            imageSrc={IMG_STAR_CATCH}
            tapeColor="lavender"
            cardBgColor="bg-[#FAF5FF] border-[#E9D5FF]"
            stats={student.gameStats?.[7]}
            onClick={() => onSelectGame(7)}
            badgeText="★ 게임 7 ★"
          />

          {/* Game 8: 고양이 색칠놀이 */}
          <GameCard
            id={8}
            title="고양이 색칠놀이"
            categoryTag="색칠 & 파일 저장"
            description="좋아하는 무지개 물감으로 냥냥이를 칠하고 컴퓨터에 그림 파일로 저장해요!"
            imageSrc={IMG_COLOR_PAINT}
            tapeColor="pink"
            cardBgColor="bg-[#FFF1F2] border-[#FECDD3]"
            stats={student.gameStats?.[8]}
            onClick={() => onSelectGame(8)}
            badgeText="★ 게임 8 ★"
          />

          {/* Game 9: 냥냥이 메뉴 선택 */}
          <GameCard
            id={9}
            title="냥냥이 메뉴 선택"
            categoryTag="마우스 오른쪽 버튼 클릭"
            description="고양이 위에 마우스를 올리고 오른쪽 버튼을 톡 눌러 특별 메뉴를 골라요!"
            fallbackSvg={<ContextMenuVignette />}
            tapeColor="yellow"
            cardBgColor="bg-[#FFFBEB] border-[#FDE68A]"
            stats={student.gameStats?.[9]}
            onClick={() => onSelectGame(9)}
            badgeText="★ 게임 9 ★"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. 키보드 놀이터 (4 Fairytale Cards, 4 per row on desktop)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b-3 border-amber-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-black mb-1 border border-amber-300">
              <Keyboard className="w-3.5 h-3.5" />
              <span>자판과 키보드 조작 탐험</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>⌨️</span>
              <span>키보드 놀이터</span>
            </h2>
            <p className="text-[15px] md:text-[17px] font-bold text-slate-600">
              커다란 무지개 키보드와 방향키, 스페이스바를 콩콩 누르며 자판과 친해져요!
            </p>
          </div>
          <span className="text-xs font-black text-amber-900 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
            총 4개 키보드 놀이
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 키보드 탐험 */}
          <GameCard
            title="키보드 탐험"
            categoryTag="자판 구조 익히기"
            description="커다란 무지개 키보드 건반 위를 아기 고양이와 콩콩 걸으며 키를 익혀요!"
            imageSrc={IMG_KEYBOARD_QUEST}
            tapeColor="blue"
            cardBgColor="bg-[#F0F9FF] border-[#BAE6FD]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 키보드 1 ★"
          />

          {/* Card 2: 방향키 모험 */}
          <GameCard
            title="방향키 모험"
            categoryTag="상·하·좌·우 화살표"
            description="키보드 오른쪽의 상, 하, 좌, 우 방향키를 톡톡 눌러 냥냥이와 모험해요!"
            fallbackSvg={<ArrowKeysVignette />}
            tapeColor="mint"
            cardBgColor="bg-[#ECFDF5] border-[#A7F3D0]"
            stats={student.gameStats?.[5]}
            onClick={() => onSelectGame(5)}
            badgeText="★ 키보드 2 ★"
          />

          {/* Card 3: 스페이스 점프 */}
          <GameCard
            title="스페이스 점프"
            categoryTag="스페이스바 점프 타이밍"
            description="제일 길쭉한 스페이스바를 엄지손가락으로 톡 눌러 장애물을 훌쩍 뛰어넘어요!"
            fallbackSvg={<SpaceJumpVignette />}
            tapeColor="peach"
            cardBgColor="bg-[#FFF7ED] border-[#FED7AA]"
            stats={student.gameStats?.[7]}
            onClick={() => onSelectGame(7)}
            badgeText="★ 키보드 3 ★"
          />

          {/* Card 4: 키보드 피아노 */}
          <GameCard
            title="키보드 피아노"
            categoryTag="도레미파솔 연주"
            description="자판을 누르면 예쁜 멜로디와 무지개 별빛이 퐁퐁 솟아나는 키보드 피아노!"
            imageSrc={IMG_KEYBOARD_PIANO}
            tapeColor="lavender"
            cardBgColor="bg-[#F5F3FF] border-[#DDD6FE]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 키보드 4 ★"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. 냥냥 타자교실 (5 Fairytale Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b-3 border-rose-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-rose-100 text-rose-900 rounded-full text-xs font-black mb-1 border border-rose-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>단계별 한글 타자 정복</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>🏫</span>
              <span>냥냥 타자교실</span>
            </h2>
            <p className="text-[15px] md:text-[17px] font-bold text-slate-600">
              바른 손가락 자세로 기본자리부터 귀여운 낱말, 동화 문장까지 차근차근 배워요!
            </p>
          </div>
          <span className="text-xs font-black text-rose-900 bg-white/90 px-3 py-1.5 rounded-xl border border-rose-200 shrink-0">
            총 5개 타자 코스
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* 1. 기본자리 연습 */}
          <GameCard
            title="기본자리 연습"
            categoryTag="ㅁㄴㅇㄹ ㅓㅏㅣ;"
            description="타자의 기초! 키보드 중심 기본자리에 양손 손가락을 바르게 올려요."
            fallbackSvg={<HomeRowVignette />}
            tapeColor="yellow"
            cardBgColor="bg-[#FEFCE8] border-[#FEF08A]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 타자 1코스 ★"
          />

          {/* 2. 윗글쇠 연습 */}
          <GameCard
            title="윗글쇠 연습"
            categoryTag="ㅂㅈㄷㄱㅅ ㅛㅕㅑㅐㅔ"
            description="기본자리에서 한 칸 위로 톡! 윗줄 글쇠를 올바른 손가락으로 쳐보아요."
            fallbackSvg={<TopRowVignette />}
            tapeColor="lavender"
            cardBgColor="bg-[#FAF5FF] border-[#E9D5FF]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 타자 2코스 ★"
          />

          {/* 3. 아랫글쇠 연습 */}
          <GameCard
            title="아랫글쇠 연습"
            categoryTag="ㅋㅌㅊㅍ ㅠㅜㅡ"
            description="기본자리에서 한 칸 아래로 쏙! 아랫줄 글쇠를 익히는 신나는 단계예요."
            fallbackSvg={<BottomRowVignette />}
            tapeColor="mint"
            cardBgColor="bg-[#F0FDF4] border-[#BBF7D0]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 타자 3코스 ★"
          />

          {/* 4. 낱말 연습 (Game 10 - 초코 타자 챌린지) */}
          <GameCard
            id={10}
            title="낱말 연습"
            categoryTag="귀여운 단어 타자"
            description="우유, 사과, 나비, 컴퓨터 등 달콤한 한글 낱말들을 재미있게 입력해요!"
            imageSrc={IMG_TYPING_DESK}
            tapeColor="pink"
            cardBgColor="bg-[#FFF1F2] border-[#FECDD3]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 타자 4코스 ★"
          />

          {/* 5. 문장 연습 */}
          <GameCard
            title="문장 연습"
            categoryTag="동화책 짧은 문장"
            description="아기 고양이의 신나는 컴퓨터 모험 동화 한 줄을 예쁘게 완성해 보아요!"
            fallbackSvg={<StorySentenceVignette />}
            tapeColor="blue"
            cardBgColor="bg-[#F0F9FF] border-[#BAE6FD]"
            stats={student.gameStats?.[10]}
            onClick={() => onSelectGame(10)}
            badgeText="★ 타자 5코스 ★"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. 초코 상점과 고양이 방 꾸미기 (2 Large Fairytale Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b-3 border-pink-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-pink-100 text-pink-900 rounded-full text-xs font-black mb-1 border border-pink-300">
              <Store className="w-3.5 h-3.5" />
              <span>나만의 아기 고양이 꾸미기</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>🎁</span>
              <span>초코 상점과 고양이 방 꾸미기</span>
            </h2>
            <p className="text-[15px] md:text-[17px] font-bold text-slate-600">
              열심히 모은 초코로 예쁜 리본과 가구를 사고, 나만의 방을 꾸며보세요!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 냥냥 초코 상점 */}
          <div
            onClick={() => {
              sound.playPop();
              onOpenShop();
            }}
            className="group cursor-pointer p-7 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 rounded-[32px] border-4 border-pink-300 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl p-2.5 bg-white/95 rounded-2xl shadow-xs group-hover:scale-110 transition-transform">
                  🎁
                </span>
                <span className="text-xs font-black px-3.5 py-1 bg-pink-500 text-white rounded-full shadow-xs">
                  초코 상점 OPEN
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                냥냥 초코 상점
              </h3>
              <p className="text-base font-bold text-slate-600 leading-relaxed mb-4">
                모은 초코로 알록달록 리본, 왕관 모자, 멋쟁이 안경, 포근한 침대와 신비한 랜덤 스티커를 뽑아보세요!
              </p>
            </div>
            <div className="pt-4 border-t-2 border-pink-200/80 flex items-center justify-between">
              <span className="text-sm font-black text-pink-800">
                보유 초코: {student.choco}개
              </span>
              <div className="px-5 py-2.5 bg-pink-500 group-hover:bg-pink-400 text-white font-black text-sm rounded-2xl shadow-sm flex items-center gap-1.5 transition-colors">
                <span>상점 입장하기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: 고양이 방 꾸미기 */}
          <div
            onClick={() => {
              sound.playPop();
              onOpenRoom();
            }}
            className="group cursor-pointer p-7 bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 rounded-[32px] border-4 border-emerald-300 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl p-2.5 bg-white/95 rounded-2xl shadow-xs group-hover:scale-110 transition-transform">
                  🏠
                </span>
                <span className="text-xs font-black px-3.5 py-1 bg-emerald-600 text-white rounded-full shadow-xs">
                  방 인테리어
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                고양이 방 꾸미기
              </h3>
              <p className="text-base font-bold text-slate-600 leading-relaxed mb-4">
                포근한 침대, 푹신한 방석, 캣타워와 화분을 마우스 드래그로 자유롭게 옮겨 세상에 하나뿐인 방을 완성해요!
              </p>
            </div>
            <div className="pt-4 border-t-2 border-emerald-200/80 flex items-center justify-between">
              <span className="text-sm font-black text-emerald-800">
                배치된 가구: {student.roomItems?.length || 0}개
              </span>
              <div className="px-5 py-2.5 bg-emerald-600 group-hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-sm flex items-center gap-1.5 transition-colors">
                <span>방 꾸미러 가기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. 나의 학습 기록 (Detailed Statistics Card)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-2 border-b-3 border-sky-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-sky-100 text-sky-900 rounded-full text-xs font-black mb-1 border border-sky-300">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>성취도 및 분석 통계</span>
            </div>
            <h2 className="text-[28px] md:text-[32px] font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>📊</span>
              <span>나의 학습 기록</span>
            </h2>
            <p className="text-[15px] md:text-[17px] font-bold text-slate-600">
              게임별 단계 완료 기록, 획득한 별점, 최고 점수와 플레이 횟수를 한눈에 확인해요!
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white/95 rounded-[32px] border-4 border-sky-300 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-start">
            {/* Stat 1: Total Stars */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center min-w-[130px]">
              <div className="text-xs font-black text-amber-900 mb-1 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>모은 별점</span>
              </div>
              <div className="text-3xl font-black text-amber-950 font-mono">
                {totalStars}개
              </div>
            </div>

            {/* Stat 2: Choco */}
            <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 text-center min-w-[130px]">
              <div className="text-xs font-black text-orange-900 mb-1 flex items-center justify-center gap-1">
                <span>🍫</span>
                <span>보유 초코</span>
              </div>
              <div className="text-3xl font-black text-orange-950 font-mono">
                {student.choco}개
              </div>
            </div>

            {/* Stat 3: Level */}
            <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 text-center min-w-[130px]">
              <div className="text-xs font-black text-purple-900 mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>냥냥 레벨</span>
              </div>
              <div className="text-2xl font-black text-purple-950">
                Lv.{levelData.currentLevel.level}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                onOpenRecords();
              }}
              className="py-3.5 px-7 bg-sky-500 hover:bg-sky-400 text-white font-black text-base rounded-2xl shadow-md border-2 border-sky-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>전체 학습 기록표 열기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
