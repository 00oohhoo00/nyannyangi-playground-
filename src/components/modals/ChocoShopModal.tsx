import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { StudentProfile, ShopItem, StickerItem } from '../../types';
import { SHOP_ITEMS } from '../../data/shopItems';
import { STICKERS } from '../../data/stickers';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { ItemIllustration } from '../ItemIllustrations';

interface Props {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onClose: () => void;
}

export const ChocoShopModal: React.FC<Props> = ({
  student,
  onUpdateStudent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'accessory' | 'costume' | 'bed' | 'wallpaper' | 'sticker'>('all');
  const [unboxedSticker, setUnboxedSticker] = useState<StickerItem | null>(null);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const categories = {
    accessory: ['ribbon', 'hat', 'glasses'],
    costume: ['clothes'],
    bed: ['bed'],
    wallpaper: ['wallpaper'],
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sticker') return false;
    if (activeTab === 'accessory') return categories.accessory.includes(item.category);
    if (activeTab === 'costume') return categories.costume.includes(item.category);
    if (activeTab === 'bed') return categories.bed.includes(item.category);
    if (activeTab === 'wallpaper') return categories.wallpaper.includes(item.category);
    return true;
  });

  const isItemOwned = (item: ShopItem) => {
    if (item.category === 'ribbon') return student.inventory.ribbons.includes(item.id);
    if (item.category === 'hat') return student.inventory.hats.includes(item.id);
    if (item.category === 'glasses') return student.inventory.glasses.includes(item.id);
    if (item.category === 'clothes') return student.inventory.clothes.includes(item.id);
    if (item.category === 'bed') return student.inventory.beds.includes(item.id);
    if (item.category === 'wallpaper') return student.inventory.wallpapers.includes(item.id);
    if (item.category === 'decoration') return student.inventory.decorations?.includes(item.id);
    return false;
  };

  const handleBuyItem = (item: ShopItem) => {
    if (isItemOwned(item)) return;

    if (student.choco < item.price) {
      sound.playMiss();
      setPurchaseNotice('초코가 부족해요! 게임을 완료하고 초코를 모아보세요.');
      setTimeout(() => setPurchaseNotice(null), 2000);
      return;
    }

    sound.playChoco();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

    const newInventory = { ...student.inventory };
    const newEquipped = { ...student.equipped };

    if (item.category === 'ribbon') {
      newInventory.ribbons = Array.from(new Set([...newInventory.ribbons, item.id]));
      newEquipped.ribbon = item.id;
    } else if (item.category === 'hat') {
      newInventory.hats = Array.from(new Set([...newInventory.hats, item.id]));
      newEquipped.hat = item.id;
    } else if (item.category === 'glasses') {
      newInventory.glasses = Array.from(new Set([...newInventory.glasses, item.id]));
      newEquipped.glasses = item.id;
    } else if (item.category === 'clothes') {
      newInventory.clothes = Array.from(new Set([...newInventory.clothes, item.id]));
      newEquipped.clothes = item.id;
    } else if (item.category === 'bed') {
      newInventory.beds = Array.from(new Set([...newInventory.beds, item.id]));
      newEquipped.bed = item.id;
    } else if (item.category === 'wallpaper') {
      newInventory.wallpapers = Array.from(new Set([...newInventory.wallpapers, item.id]));
      newEquipped.wallpaper = item.id;
    } else if (item.category === 'decoration') {
      newInventory.decorations = Array.from(new Set([...(newInventory.decorations || []), item.id]));
    }

    const updated: StudentProfile = {
      ...student,
      choco: student.choco - item.price,
      inventory: newInventory,
      equipped: newEquipped,
    };

    onUpdateStudent(updated);
    setPurchaseNotice(`🎉 [${item.name}] 구매 완료! 내 고양이에게 바로 적용되었어요.`);
    setTimeout(() => setPurchaseNotice(null), 2500);
  };

  // Random sticker gacha (초코 20개)
  const handleGachaSticker = () => {
    if (student.choco < 20) {
      sound.playMiss();
      setPurchaseNotice('초코가 부족해요! 20개 초코가 필요해요.');
      setTimeout(() => setPurchaseNotice(null), 2000);
      return;
    }

    sound.playStar(2);
    sound.playChoco();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    const unowned = STICKERS.filter((s) => !student.unlockedStickers.includes(s.id));
    const pool = unowned.length > 0 ? unowned : STICKERS;
    const drawn = pool[Math.floor(Math.random() * pool.length)];

    setUnboxedSticker(drawn);

    const updated: StudentProfile = {
      ...student,
      choco: student.choco - 20,
      unlockedStickers: Array.from(new Set([...student.unlockedStickers, drawn.id])),
    };

    onUpdateStudent(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-amber-100 border-b-2 border-amber-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🎁</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">냥냥 초코 상점</h2>
              <p className="text-xs text-slate-600 font-bold">
                열심히 모은 달콤한 초코로 나만의 고양이에게 예쁜 가구와 방 테마를 선물해 보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-2xl border-2 border-amber-300 shadow-sm">
              <span className="text-xl">🍫</span>
              <span className="text-xs font-bold text-slate-600">내 초코:</span>
              <span className="text-lg font-black text-amber-900 tabular-nums">{student.choco}개</span>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {purchaseNotice && (
          <div className="px-6 py-2 bg-amber-400 text-amber-950 font-black text-xs text-center border-b border-amber-500 animate-in fade-in duration-150">
            {purchaseNotice}
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex items-center gap-2 px-6 py-3 bg-amber-50/70 border-b border-amber-200 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: '전체 아이템' },
            { id: 'wallpaper', label: '🏡 방 테마 배경 (4종)' },
            { id: 'bed', label: '🛏️ 포근 침대 & 이불 & 상자' },
            { id: 'accessory', label: '🎀 리본 & 모자 & 안경' },
            { id: 'costume', label: '👕 예쁜 옷' },
            { id: 'sticker', label: '🌟 랜덤 스티커 뽑기' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-102 font-black'
                  : 'bg-white text-slate-600 hover:bg-amber-100/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Sticker Gacha Tab */}
          {activeTab === 'sticker' ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-100 via-pink-50 to-amber-100 rounded-3xl border-3 border-purple-200 shadow-md max-w-lg mx-auto text-center">
              <div className="text-6xl mb-3 animate-bounce">🎰</div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">
                신비한 냥냥 스티커 뽑기 머신
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                초코 20개로 50종의 귀여운 스티커 중 하나를 뽑을 수 있어요!<br />
                반짝 스티커와 전설 스티커가 나올 수도 있답니다!
              </p>

              <button
                onClick={handleGachaSticker}
                className="py-4 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-lg rounded-2xl shadow-lg border-2 border-purple-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>초코 20개로 스티커 뽑기!</span>
              </button>

              <div className="mt-4 text-xs font-bold text-slate-500">
                현재 수집한 스티커: {student.unlockedStickers.length} / 50개 (
                {Math.round((student.unlockedStickers.length / 50) * 100)}%)
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Random Sticker Card (Visible on 'all' tab) */}
              {activeTab === 'all' && (
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl border-3 border-purple-300 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl p-1 bg-white rounded-xl shadow-xs">🎰</span>
                      <span className="text-xs font-extrabold text-purple-700 bg-white/90 px-2.5 py-0.5 rounded-lg border border-purple-200">
                        인기 만점
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-800 mb-1">
                      랜덤 스티커 뽑기
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      도감에 모을 수 있는 50종의 귀여운 스티커를 뽑아보세요!
                    </p>
                  </div>

                  <button
                    onClick={handleGachaSticker}
                    className="w-full py-3 px-3 bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95 transition-all"
                  >
                    <span>🍫 초코 20개로 뽑기</span>
                  </button>
                </div>
              )}

              {/* Shop Items List */}
              {filteredItems.map((item) => {
                const owned = isItemOwned(item);
                const isRoomTheme = item.category === 'wallpaper';

                if (isRoomTheme) {
                  // 4:3 Panoramic Room Theme Card
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border-3 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                    >
                      {/* 4:3 Aspect Ratio Header Preview */}
                      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden border-b-2 border-amber-200">
                        <ItemIllustration itemId={item.id} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-xl text-[11px] font-black text-purple-700 border border-purple-200 shadow-xs">
                          방 테마 인테리어
                        </div>
                        <div className="absolute top-2 right-2 px-2.5 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-sm border border-amber-500 flex items-center gap-1">
                          <span>🍫</span>
                          <span>{item.price} 초코</span>
                        </div>
                      </div>

                      {/* Info & Buy Action */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <div className="text-base font-black text-slate-800 mb-1">{item.name}</div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {owned ? (
                          <div className="w-full py-2.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200">
                            <Check className="w-4 h-4 text-teal-600" />
                            <span>보유 중 (방 꾸미기에서 적용)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBuyItem(item)}
                            className="w-full py-3 px-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-xs border border-amber-500 flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95 transition-all"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>테마 구매하기 ({item.price} 초코)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                // Single Furniture & Accessories Card (Transparent background standalone 2D illustration)
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-3xl border-2 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        {/* Standalone 2D illustration container with transparent SVG */}
                        <div className="w-20 h-20 p-2 bg-gradient-to-br from-amber-50/70 to-orange-50/50 rounded-2xl border-2 border-amber-200/70 shadow-inner flex items-center justify-center shrink-0">
                          <ItemIllustration itemId={item.id} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-sm font-black text-slate-800 truncate">{item.name}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100/70 rounded-lg text-xs font-black text-amber-900 border border-amber-300/60 mb-1.5">
                            <span>🍫</span>
                            <span>{item.price}개</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {owned ? (
                      <div className="w-full py-2 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl flex items-center justify-center gap-1 border border-slate-200">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>보유 중</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-xs border border-amber-500 flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>구매하기 ({item.price} 초코)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Unboxed Sticker Reveal Popup */}
        {unboxedSticker && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 max-w-sm w-full text-center animate-in zoom-in-90 duration-200">
              <div className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block mb-3">
                {unboxedSticker.rarity === 'legendary'
                  ? '👑 전설 스티커 발견!'
                  : unboxedSticker.rarity === 'shiny'
                  ? '✨ 반짝 스티커 발견!'
                  : '🌱 일반 스티커 발견!'}
              </div>

              <div
                className="w-28 h-28 mx-auto rounded-3xl border-3 border-slate-200 shadow-md flex items-center justify-center text-6xl mb-3"
                style={{ backgroundColor: unboxedSticker.bgColor }}
              >
                {unboxedSticker.icon}
              </div>

              <h4 className="text-xl font-black text-slate-800 mb-1">{unboxedSticker.name}</h4>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                {unboxedSticker.description}
              </p>

              <button
                onClick={() => {
                  sound.playPop();
                  setUnboxedSticker(null);
                }}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-md border-2 border-teal-600 hover:scale-105 active:scale-95 transition-all"
              >
                스티커 도감에 넣기!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
