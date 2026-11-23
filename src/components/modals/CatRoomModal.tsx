import React, { useState, useRef } from 'react';
import { X, Save, Sparkles, Check, Trash2 } from 'lucide-react';
import { StudentProfile, RoomItem } from '../../types';
import { ROOM_FURNITURE_PRESETS, SHOP_ITEMS } from '../../data/shopItems';
import { CatAvatar } from '../CatAvatar';
import { sound } from '../../utils/sound';
import { ItemIllustration } from '../ItemIllustrations';

interface Props {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onClose: () => void;
  onOpenShop: () => void;
}

export const CatRoomModal: React.FC<Props> = ({
  student,
  onUpdateStudent,
  onClose,
  onOpenShop,
}) => {
  const [roomItems, setRoomItems] = useState<RoomItem[]>(student.roomItems || []);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'furniture' | 'theme'>('theme');

  const roomRef = useRef<HTMLDivElement | null>(null);

  const wallpaper = student.equipped.wallpaper || 'bg_mint_classroom';

  // Room theme wallpapers in shop
  const roomWallpapers = SHOP_ITEMS.filter((item) => item.category === 'wallpaper');

  const handleSelectWallpaper = (themeId: string) => {
    sound.playPop();
    const updated: StudentProfile = {
      ...student,
      equipped: {
        ...student.equipped,
        wallpaper: themeId,
      },
    };
    onUpdateStudent(updated);
  };

  const handleRoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingItemId || !roomRef.current) return;
    const rect = roomRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));

    setRoomItems((prev) =>
      prev.map((item) => (item.id === draggingItemId ? { ...item, x, y } : item))
    );
  };

  const handleRoomMouseUp = () => {
    if (draggingItemId) {
      sound.playPop();
      setDraggingItemId(null);
      const updated: StudentProfile = {
        ...student,
        roomItems,
      };
      onUpdateStudent(updated);
    }
  };

  const handleAddFurniture = (preset: typeof ROOM_FURNITURE_PRESETS[0]) => {
    sound.playPop();
    const newItem: RoomItem = {
      id: `rm_${Date.now()}_${Math.random()}`,
      itemId: preset.id,
      name: preset.name,
      category: preset.category,
      icon: preset.icon,
      x: 30 + Math.floor(Math.random() * 40),
      y: 40 + Math.floor(Math.random() * 40),
    };

    const nextItems = [...roomItems, newItem];
    setRoomItems(nextItems);

    const updated: StudentProfile = {
      ...student,
      roomItems: nextItems,
    };
    onUpdateStudent(updated);
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    const nextItems = roomItems.filter((i) => i.id !== id);
    setRoomItems(nextItems);
    const updated: StudentProfile = {
      ...student,
      roomItems: nextItems,
    };
    onUpdateStudent(updated);
  };

  const handleManualSave = () => {
    sound.playChoco();
    const updated: StudentProfile = {
      ...student,
      roomItems,
    };
    onUpdateStudent(updated);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🏠</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                {student.catName}의 아기자기한 방 꾸미기
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                방 테마 배경을 바꾸고 소품을 마우스로 자유롭게 배치해 보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSave}
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>방 저장하기</span>
            </button>
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

        {saveNotice && (
          <div className="px-6 py-2 bg-teal-500 text-white font-black text-xs text-center border-b border-teal-600 animate-in fade-in">
            ✨ 고양이 방 상태가 안전하게 저장되었어요!
          </div>
        )}

        {/* Room Stage & Decoration Controls */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col lg:flex-row gap-6">
          {/* Main Visual Room */}
          <div
            ref={roomRef}
            onMouseMove={handleRoomMouseMove}
            onMouseUp={handleRoomMouseUp}
            className="relative flex-1 min-h-[420px] rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden select-none cursor-default bg-slate-50"
          >
            {/* Background 4:3 Room Artwork Backdrop */}
            <div className="absolute inset-0 pointer-events-none opacity-90">
              <ItemIllustration itemId={wallpaper} className="w-full h-full object-cover" />
            </div>

            {/* Room Greeting Tag */}
            <div className="absolute top-4 right-6 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-800 shadow-sm border border-amber-300 pointer-events-none z-10 flex items-center gap-1.5">
              <span>🏠</span>
              <span>{student.name}의 {student.catName} 방</span>
            </div>

            {/* Cat Mascot in Center */}
            <div
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: '50%', top: '65%' }}
            >
              <CatAvatar
                speciesId={student.catType}
                size="md"
                equipped={student.equipped}
                showBed={true}
                interactive={true}
              />
            </div>

            {/* Placed Furniture Items */}
            {roomItems.map((item) => (
              <div
                key={item.id}
                onMouseDown={() => setDraggingItemId(item.id)}
                className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 bg-white/90 hover:bg-white rounded-2xl border-2 border-amber-300 shadow-md hover:scale-115 active:scale-95 transition-all group ${
                  draggingItemId === item.id ? 'scale-125 ring-2 ring-teal-400 z-50' : ''
                }`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                title={`${item.name} (드래그하여 이동)`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-[10px] font-black text-slate-700 mt-0.5 whitespace-nowrap">
                    {item.name}
                  </span>
                </div>

                <button
                  onClick={(e) => handleRemoveItem(item.id, e)}
                  className="absolute -top-2 -right-2 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                  title="삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Right: Controls Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
            {/* Tab switch between Themes and Furniture */}
            <div className="flex gap-1.5 p-1 bg-amber-100/70 rounded-2xl border border-amber-200">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveRightTab('theme');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
                  activeRightTab === 'theme'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                🏡 방 테마 선택
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveRightTab('furniture');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
                  activeRightTab === 'furniture'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                🪴 소품 배치
              </button>
            </div>

            {activeRightTab === 'theme' ? (
              <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto p-2 bg-amber-50/60 rounded-2xl border-2 border-amber-200">
                <div className="text-[11px] font-bold text-slate-600 px-1">
                  원하는 방 테마를 클릭하면 즉시 배경이 바뀌어요!
                </div>

                {roomWallpapers.map((theme) => {
                  const isOwned = student.inventory.wallpapers.includes(theme.id) || theme.id === 'bg_mint_classroom';
                  const isEquipped = wallpaper === theme.id;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        if (isOwned) {
                          handleSelectWallpaper(theme.id);
                        } else {
                          sound.playPop();
                          onClose();
                          onOpenShop();
                        }
                      }}
                      className={`relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-102 active:scale-98 ${
                        isEquipped
                          ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
                          : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                      }`}
                    >
                      <div className="flex gap-2.5 items-center">
                        {/* 4:3 Small Thumbnail */}
                        <div className="w-20 aspect-[4/3] rounded-xl overflow-hidden border border-amber-200 shrink-0 bg-slate-100">
                          <ItemIllustration itemId={theme.id} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-800 truncate">{theme.name}</span>
                            {isEquipped && (
                              <span className="px-1.5 py-0.2 bg-teal-500 text-white text-[9px] font-black rounded-md flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> 적용 중
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                            {theme.description}
                          </p>

                          {!isOwned && (
                            <span className="inline-block mt-1 text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                              🔒 상점에서 구매 필요 ({theme.price} 초코)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    sound.playPop();
                    onClose();
                    onOpenShop();
                  }}
                  className="mt-1 w-full py-2 bg-gradient-to-r from-amber-400 to-rose-300 text-amber-950 font-black text-xs rounded-xl shadow-xs border border-amber-400 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>더 많은 방 테마 상점에서 보기</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto p-2 bg-amber-50/60 rounded-2xl border-2 border-amber-200">
                  {ROOM_FURNITURE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleAddFurniture(preset)}
                      className="p-2.5 bg-white hover:bg-amber-100/60 rounded-xl border border-slate-200 hover:border-amber-400 shadow-xs flex flex-col items-center justify-center transition-all hover:scale-102 active:scale-95"
                    >
                      <span className="text-3xl mb-1">{preset.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 text-center line-clamp-1">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-teal-600 font-extrabold mt-0.5">
                        + 방에 놓기
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 font-bold leading-relaxed">
                  💡 팁: 방에 놓인 소품을 마우스로 잡고 이리저리 끌어서 예쁜 위치에 놓아보세요!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
