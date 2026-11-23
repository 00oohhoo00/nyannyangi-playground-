import React, { useState } from 'react';
import { X, Edit2, Check, Sparkles, Lock } from 'lucide-react';
import { StudentProfile, ShopItem } from '../../types';
import { CAT_SPECIES, getLevelInfo } from '../../data/cats';
import { SHOP_ITEMS } from '../../data/shopItems';
import { CatAvatar } from '../CatAvatar';
import { sound } from '../../utils/sound';
import { ItemIllustration } from '../ItemIllustrations';

interface Props {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onClose: () => void;
  onOpenShop: () => void;
}

export const MyCatModal: React.FC<Props> = ({
  student,
  onUpdateStudent,
  onClose,
  onOpenShop,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempCatName, setTempCatName] = useState(student.catName);
  const [activeTab, setActiveTab] = useState<'ribbon' | 'hat' | 'glasses' | 'clothes' | 'bed'>('bed');
  const [hoveredItem, setHoveredItem] = useState<ShopItem | null>(null);

  const species = CAT_SPECIES[student.catType] || CAT_SPECIES.cheesenyang;
  const levelData = getLevelInfo(student.exp);

  const handleSaveCatName = () => {
    if (!tempCatName.trim()) return;
    sound.playPop();
    const updated: StudentProfile = {
      ...student,
      catName: tempCatName.trim(),
    };
    onUpdateStudent(updated);
    setIsEditingName(false);
  };

  const handleToggleEquip = (category: 'ribbon' | 'hat' | 'glasses' | 'clothes' | 'bed', itemId: string) => {
    sound.playPop();
    const current = student.equipped[category];
    const newEquipped = { ...student.equipped };

    if (current === itemId) {
      delete newEquipped[category];
    } else {
      newEquipped[category] = itemId;
    }

    const updated: StudentProfile = {
      ...student,
      equipped: newEquipped,
    };
    onUpdateStudent(updated);
  };

  // Filter owned items for current active category (strictly unique IDs)
  const ownedItemIds = React.useMemo(() => {
    const rawList = {
      ribbon: student.inventory.ribbons,
      hat: student.inventory.hats,
      glasses: student.inventory.glasses,
      clothes: student.inventory.clothes,
      bed: student.inventory.beds,
    }[activeTab] || [];
    return Array.from(new Set(rawList));
  }, [student.inventory, activeTab]);

  // Strictly deduplicated items by ID for active category
  const categoryItems = React.useMemo(() => {
    const items = SHOP_ITEMS.filter((item) => item.category === activeTab);
    const seen = new Set<string>();
    const unique: typeof items = [];
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return unique;
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-[#FFFDF9] rounded-3xl md:rounded-[36px] border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-3 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🐱</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                {student.name}의 사랑스러운 고양이
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                포근한 이불을 덮어주고, 예쁜 옷과 액세서리로 꾸며주세요!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Cat Stage & Right Dressing Drawer */}
        <div className="flex-1 p-5 md:p-7 overflow-y-auto flex flex-col md:flex-row gap-6">
          {/* Left: Big Interactive Cat Stage & Stats */}
          <div className="w-full md:w-80 flex flex-col items-center p-5 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-3 border-amber-200 shadow-sm shrink-0">
            {/* Cat Name & Edit */}
            <div className="flex items-center gap-2 mb-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempCatName}
                    onChange={(e) => setTempCatName(e.target.value)}
                    maxLength={10}
                    className="py-1 px-3 text-base font-black text-slate-800 bg-white rounded-xl border-2 border-teal-400 w-32 text-center"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveCatName}
                    className="p-1.5 bg-teal-500 text-white rounded-xl hover:bg-teal-400 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-800">{student.catName}</span>
                  <button
                    onClick={() => {
                      sound.playPop();
                      setIsEditingName(true);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="이름 바꾸기"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-1 rounded-full mb-2">
              {species.name} · {species.tagline}
            </div>

            {/* Live Cat Avatar (Clean, no text overlap!) */}
            <div className="p-4 my-2 relative">
              <CatAvatar
                speciesId={student.catType}
                size="lg"
                equipped={student.equipped}
                showBed={true}
                interactive={true}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-bold mb-3 text-center">
              👆 클릭하면 고양이가 기뻐하며 야옹 소리를 내요!
            </span>

            {/* Level & EXP Box */}
            <div className="w-full p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-amber-900">
                  Lv.{levelData.currentLevel.level} {levelData.currentLevel.title}
                </span>
                <span className="text-xs font-bold text-slate-500 tabular-nums">
                  {student.exp} EXP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-500 rounded-full"
                  style={{ width: `${levelData.progressPercent}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>다음 레벨까지</span>
                <span className="font-bold text-teal-700">
                  {levelData.nextLevel
                    ? `${levelData.nextLevel.minExp - student.exp} EXP 남음`
                    : '최고 레벨 도달!'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Dressing Room Drawer with Pure Illustration Square Slots */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-800">냥냥 옷장 & 포근 이불</h3>
                </div>
                <button
                  onClick={() => {
                    sound.playPop();
                    onClose();
                    onOpenShop();
                  }}
                  className="text-xs font-black text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors cursor-pointer"
                >
                  + 상점에서 더 사기
                </button>
              </div>

              {/* Category Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-2xl mb-4 overflow-x-auto">
                {[
                  { id: 'bed', label: '🛏️ 포근 이불 & 침대' },
                  { id: 'ribbon', label: '🎀 리본' },
                  { id: 'hat', label: '🎉 모자' },
                  { id: 'glasses', label: '👓 안경' },
                  { id: 'clothes', label: '👕 옷' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playPop();
                      setActiveTab(tab.id as typeof activeTab);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-sm font-black scale-102 border border-amber-300'
                        : 'text-slate-600 hover:text-slate-900 font-bold'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 
                Square Item Slots (Pure Artwork, NO text inside square slot!)
                Fills 80-90% of the box, with hover tooltips and clean borders
              */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-h-[360px] overflow-y-auto p-1">
                {categoryItems.map((item) => {
                  const isOwned = ownedItemIds.includes(item.id);
                  const isEquipped = student.equipped[activeTab] === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (isOwned) {
                          handleToggleEquip(activeTab, item.id);
                        } else {
                          sound.playMiss();
                        }
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      title={`${item.name} - ${item.description}${isOwned ? ' (클릭하여 착용/해제)' : ' (상점에서 구매 필요)'}`}
                      className={`group relative aspect-square rounded-[26px] border-3 transition-all flex items-center justify-center p-2.5 ${
                        !isOwned
                          ? 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed'
                          : isEquipped
                          ? 'bg-amber-100/80 border-amber-500 shadow-md ring-4 ring-amber-300/80 scale-103 cursor-pointer'
                          : 'bg-white border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/50 hover:scale-105 shadow-sm cursor-pointer'
                      }`}
                    >
                      {/* 2D Item Illustration (Fills 80~90% of slot, ZERO TEXT inside!) */}
                      <div className="w-[86%] h-[86%] flex items-center justify-center pointer-events-none transition-transform duration-200 group-hover:scale-108">
                        <ItemIllustration itemId={item.id} className="w-full h-full object-contain" />
                      </div>

                      {/* Equipped Status Badge (Top-Right subtle checkmark, unobtrusive) */}
                      {isEquipped && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 border-white pointer-events-none animate-in zoom-in-50">
                          ✓
                        </div>
                      )}

                      {/* Unowned Lock Badge */}
                      {!isOwned && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-xs shadow-xs pointer-events-none">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tooltip / Information Bar (Outside the square boxes) */}
            <div className="mt-4 p-3.5 bg-amber-50/90 rounded-2xl border-2 border-amber-200/80 flex items-center justify-between text-xs">
              {hoveredItem ? (
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 text-sm">
                    {hoveredItem.name}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-bold">
                    {hoveredItem.description}
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 font-bold flex items-center gap-1.5">
                  <span>💡</span>
                  <span>
                    아이템 네모 칸을 클릭하면 고양이에게 바로 착용되거나 벗겨져요! 마우스를 올리면 이름을 확인할 수 있어요.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
