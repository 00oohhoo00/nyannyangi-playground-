import React from 'react';
import { Volume2, VolumeX, UserCheck, ShieldCheck, CloudOff, Cloud, LogOut } from 'lucide-react';
import { StudentProfile } from '../types';
import { getLevelInfo } from '../data/cats';
import { sound } from '../utils/sound';
import { getGasConfig } from '../services/gasService';

interface TopBarProps {
  student: StudentProfile | null;
  onOpenGames: () => void;
  onOpenShop: () => void;
  onOpenRoom: () => void;
  onOpenStickers: () => void;
  onOpenRecords: () => void;
  onOpenTeacher: () => void;
  onOpenProfileSwitch: () => void;
  onOpenFirebaseGuide: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  student,
  onOpenGames,
  onOpenShop,
  onOpenRoom,
  onOpenStickers,
  onOpenRecords,
  onOpenTeacher,
  onOpenProfileSwitch,
  onOpenFirebaseGuide,
  onLogout,
}) => {
  const [muted, setMuted] = React.useState(sound.isMuted);
  const gasConfig = getGasConfig();
  const levelData = student ? getLevelInfo(student.exp) : null;

  const toggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  const isOnlineActive = gasConfig.isEnabled && Boolean(gasConfig.serverUrl);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-teal-200 shadow-xs px-4 md:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playMeow();
            }}
            className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span>🐱</span>
            <span className="bg-gradient-to-r from-teal-600 via-amber-600 to-rose-500 bg-clip-text text-transparent">
              냥냥이 컴놀이터
            </span>
          </button>

          {/* Online / Local Storage Mode Badge */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenFirebaseGuide();
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 border rounded-xl text-[11px] font-extrabold transition-all cursor-pointer hover:scale-103 active:scale-97 ${
              isOnlineActive
                ? 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-900'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
            }`}
            title="온라인 클라우드 연동 상태 및 필요 설정 확인"
          >
            {isOnlineActive ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span>🌐 GAS 온라인 연동 활성</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                <span>💻 로컬 저장 모드 (온라인 연동 안내)</span>
              </>
            )}
          </button>
        </div>

        {/* Zone 2: Navigation Links (Only shown when student is logged in) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-black text-slate-600">
          {student && (
            <>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenGames();
                }}
                className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>🐾</span>
                <span>마우스게임</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenShop();
                }}
                className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>🎁</span>
                <span>초코상점</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenRoom();
                }}
                className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>🏠</span>
                <span>방꾸미기</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenStickers();
                }}
                className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>🌟</span>
                <span>스티커도감</span>
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenRecords();
                }}
                className="hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>📊</span>
                <span>학습기록</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action & Student Stats Strip */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {student ? (
            <>
              {/* Choco Counter */}
              <button
                onClick={() => {
                  sound.playChoco();
                  onOpenShop();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-2xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="초코 상점 열기"
              >
                <span className="text-lg">🍫</span>
                <span className="text-xs font-black text-amber-950 tabular-nums">
                  {student.choco}
                </span>
              </button>

              {/* Student & Cat Mini Profile Pill */}
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenProfileSwitch();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 rounded-2xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="학생 정보 확인"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-black text-slate-800 leading-tight">
                    {student.name}의 {student.catName}
                  </div>
                  {levelData && (
                    <div className="text-[10px] text-teal-700 font-bold leading-tight">
                      Lv.{levelData.currentLevel.level} {levelData.currentLevel.title}
                    </div>
                  )}
                </div>
                <UserCheck className="w-4 h-4 text-teal-700" />
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  onLogout();
                }}
                className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-2xl border border-slate-300 transition-colors cursor-pointer"
                title="로그아웃 (다른 학생 입장하기)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenProfileSwitch}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-2xl border border-amber-500 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              놀이터 입장하기
            </button>
          )}

          {/* Teacher Mode Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenTeacher();
            }}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs rounded-2xl border-2 border-emerald-300 shadow-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="선생님 모드"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">선생님 모드</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={muted ? '소리 켜기' : '소리 끄기'}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-teal-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
