import React, { useState } from 'react';
import { X, Sparkles, Star, Award, Gift } from 'lucide-react';
import { StudentProfile, StickerItem } from '../../types';
import { STICKERS } from '../../data/stickers';
import { sound } from '../../utils/sound';

interface Props {
  student: StudentProfile;
  onClose: () => void;
  onOpenShop: () => void;
}

export const StickerBookModal: React.FC<Props> = ({
  student,
  onClose,
  onOpenShop,
}) => {
  const [filterRarity, setFilterRarity] = useState<'all' | 'normal' | 'shiny' | 'legendary'>('all');
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);

  const unlockedSet = new Set(student.unlockedStickers || []);
  const totalCount = STICKERS.length;
  const collectedCount = student.unlockedStickers?.length || 0;
  const percent = Math.min(100, Math.round((collectedCount / totalCount) * 100));

  const filteredStickers = STICKERS.filter((s) => {
    if (filterRarity === 'all') return true;
    return s.rarity === filterRarity;
  });

  const handleStickerClick = (sticker: StickerItem) => {
    if (!unlockedSet.has(sticker.id)) {
      sound.playMiss();
      return;
    }
    sound.playStar(1);
    setSelectedSticker(sticker);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-purple-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🌟</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">냥냥 스티커 도감</h2>
              <p className="text-xs text-slate-600 font-bold">
                총 50종의 아기자기한 스티커를 모아 나만의 보물 도감을 완성해보세요!
              </p>
            </div>
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

        {/* Progress Summary Strip */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs font-black text-amber-900 whitespace-nowrap">
              수집률: {collectedCount} / {totalCount}개 ({percent}%)
            </div>
            <div className="flex-1 sm:w-48 h-3.5 bg-white rounded-full border border-amber-300 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
              onOpenShop();
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>상점에서 새 스티커 뽑기</span>
          </button>
        </div>

        {/* Rarity Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-white border-b border-slate-200 shrink-0">
          {[
            { id: 'all', label: `전체 (${totalCount})` },
            { id: 'normal', label: '🌱 일반 스티커 (30)' },
            { id: 'shiny', label: '✨ 반짝 스티커 (15)' },
            { id: 'legendary', label: '👑 전설 스티커 (5)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playPop();
                setFilterRarity(tab.id as typeof filterRarity);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterRarity === tab.id
                  ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stickers Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredStickers.map((sticker) => {
              const isUnlocked = unlockedSet.has(sticker.id);
              const rarityBorder =
                sticker.rarity === 'legendary'
                  ? 'border-purple-400 ring-2 ring-purple-200'
                  : sticker.rarity === 'shiny'
                  ? 'border-amber-400 ring-1 ring-amber-200'
                  : 'border-slate-200';

              return (
                <button
                  key={sticker.id}
                  onClick={() => handleStickerClick(sticker)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                    isUnlocked
                      ? `${rarityBorder} shadow-xs hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer`
                      : 'border-dashed border-slate-300 bg-slate-100 opacity-60 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: isUnlocked ? sticker.bgColor : '#F1F5F9' }}
                >
                  {isUnlocked ? (
                    <>
                      <span className="text-4xl mb-1 filter drop-shadow-xs">{sticker.icon}</span>
                      <span className="text-[11px] font-black text-slate-800 line-clamp-1">
                        {sticker.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl mb-1 text-slate-400">❓</span>
                      <span className="text-[10px] font-bold text-slate-400">미발견</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticker Inspect Detail Modal */}
        {selectedSticker && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 max-w-sm w-full text-center animate-in zoom-in-90 duration-200">
              <div className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block mb-3">
                {selectedSticker.rarity === 'legendary'
                  ? '👑 전설 스티커'
                  : selectedSticker.rarity === 'shiny'
                  ? '✨ 반짝 스티커'
                  : '🌱 일반 스티커'}
              </div>

              <div
                className="w-28 h-28 mx-auto rounded-3xl border-3 border-slate-200 shadow-md flex items-center justify-center text-6xl mb-3 animate-bounce"
                style={{ backgroundColor: selectedSticker.bgColor }}
              >
                {selectedSticker.icon}
              </div>

              <h4 className="text-xl font-black text-slate-800 mb-1">{selectedSticker.name}</h4>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                {selectedSticker.description}
              </p>

              <button
                onClick={() => {
                  sound.playPop();
                  setSelectedSticker(null);
                }}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs rounded-xl shadow-md border border-teal-600"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
