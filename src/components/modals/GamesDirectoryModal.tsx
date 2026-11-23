import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { StudentProfile } from '../../types';
import { sound } from '../../utils/sound';
import { GameCard } from '../GameCard';
import {
  BasketFishVignette,
  CatPuzzleVignette,
  ContextMenuVignette,
} from '../FairytaleVignettes';

interface Props {
  student: StudentProfile;
  onSelectGame: (gameId: number) => void;
  onClose: () => void;
}

const IMG_FISH_BALLOON = '/src/assets/images/card_fish_balloon_1794240491027.jpg';
const IMG_SNACK_TREASURE = '/src/assets/images/card_snack_treasure_1794240516444.jpg';
const IMG_GIFT_BOX = '/src/assets/images/card_gift_box_1794240520187.jpg';
const IMG_PAW_MAZE = '/src/assets/images/card_paw_maze_1794240491694.jpg';
const IMG_STAR_CATCH = '/src/assets/images/card_star_catch_1794240492637.jpg';
const IMG_COLOR_PAINT = '/src/assets/images/card_color_paint_1794240519130.jpg';
const IMG_TYPING_DESK = '/src/assets/images/card_typing_desk_1794240494159.jpg';

export const GamesDirectoryModal: React.FC<Props> = ({
  student,
  onSelectGame,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#FFFDF9] rounded-3xl md:rounded-[36px] border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-3 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl p-2 bg-white/90 rounded-2xl shadow-xs">🐾</span>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/80 rounded-full text-xs font-black text-amber-950 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>동화책 속 모험 게임 모음</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                마우스 & 키보드 게임 모음
              </h2>
              <p className="text-xs md:text-sm text-slate-600 font-bold">
                쉬움, 보통, 어려움 3단계로 도전하고 달콤한 초코와 경험치를 모아보세요!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Games Grid */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
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

            {/* Game 2: 냥냥 보물찾기 */}
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

            {/* Game 10: 초코 타자 챌린지 */}
            <GameCard
              id={10}
              title="초코 타자 챌린지"
              categoryTag="한글 키보드 타자"
              description="화면에 나타나는 귀여운 한글 단어들을 키보드로 바르게 입력해보세요!"
              imageSrc={IMG_TYPING_DESK}
              tapeColor="mint"
              cardBgColor="bg-[#F0FDF4] border-[#BBF7D0]"
              stats={student.gameStats?.[10]}
              onClick={() => onSelectGame(10)}
              badgeText="★ 게임 10 ★"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
