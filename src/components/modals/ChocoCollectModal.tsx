import React, { useState } from 'react';
import { X, Sparkles, Check, Gift, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../../types';
import { checkDailyBonus } from '../../utils/storage';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface Props {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onClose: () => void;
  onOpenGames: () => void;
}

export const ChocoCollectModal: React.FC<Props> = ({
  student,
  onUpdateStudent,
  onClose,
  onOpenGames,
}) => {
  const [bonusClaimedNotice, setBonusClaimedNotice] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const isDailyClaimed = student.dailyBonusClaimedDates?.includes(today);

  const handleClaimDailyBonus = () => {
    if (isDailyClaimed) return;
    const res = checkDailyBonus(student);
    if (res.eligible && res.updatedProfile) {
      sound.playChoco();
      sound.playStar(2);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateStudent(res.updatedProfile);
      setBonusClaimedNotice('🎉 오늘 첫 접속 보너스! 달콤한 초코 10개를 받았어요!');
      setTimeout(() => setBonusClaimedNotice(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-orange-100 to-amber-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🍫</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">초코 모으기 본부</h2>
              <p className="text-xs text-slate-600 font-bold">
                매일매일 접속하고 마우스 게임을 완료하여 달콤한 초코를 모아보세요!
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

        {bonusClaimedNotice && (
          <div className="px-6 py-2.5 bg-amber-400 text-amber-950 font-black text-xs text-center border-b border-amber-500 animate-in fade-in">
            {bonusClaimedNotice}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
          {/* Daily Attendance Card */}
          <div className="p-5 bg-gradient-to-r from-amber-100 via-rose-50 to-orange-100 rounded-2xl border-3 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center text-4xl animate-bounce">
                🎁
              </div>
              <div>
                <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                  매일 1회 선물
                </span>
                <h3 className="text-lg font-black text-slate-800 mt-1">오늘 첫 접속 보상</h3>
                <p className="text-xs text-slate-600 font-bold">
                  매일 접속할 때마다 초코 10개를 선물로 드려요!
                </p>
              </div>
            </div>

            {isDailyClaimed ? (
              <div className="px-4 py-2.5 bg-slate-200 text-slate-500 font-black text-xs rounded-xl flex items-center gap-1.5 border border-slate-300">
                <Check className="w-4 h-4 text-teal-600" />
                <span>오늘 보상 수령 완료</span>
              </div>
            ) : (
              <button
                onClick={handleClaimDailyBonus}
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-sm rounded-xl shadow-md border-2 border-amber-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>초코 10개 받기!</span>
              </button>
            )}
          </div>

          {/* How to earn choco guide */}
          <div className="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-1.5">
              <span>📋</span>
              <span>초코를 모으는 방법 안내</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-teal-900">🌱 쉬움 난이도 완료</div>
                  <div className="text-[11px] text-teal-700">기본 마우스 연습 클리어</div>
                </div>
                <span className="font-black text-amber-900 text-sm">초코 5개</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-sky-900">🌸 보통 난이도 완료</div>
                  <div className="text-[11px] text-sky-700">실력 쑥쑥 단계 클리어</div>
                </div>
                <span className="font-black text-amber-900 text-sm">초코 10개</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-rose-900">🔥 어려움 난이도 완료</div>
                  <div className="text-[11px] text-rose-700">최고 난이도 도전 클리어</div>
                </div>
                <span className="font-black text-amber-900 text-sm">초코 15개</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-amber-900">⭐ 별 3개 달성 보너스</div>
                  <div className="text-[11px] text-amber-700">만점 실력 발휘 보상</div>
                </div>
                <span className="font-black text-amber-900 text-sm">추가 초코 5개</span>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between sm:col-span-2">
                <div>
                  <div className="font-black text-purple-900">✨ 최초 단계 완료 보너스</div>
                  <div className="text-[11px] text-purple-700">처음으로 단계를 깼을 때 드리는 축하 선물!</div>
                </div>
                <span className="font-black text-amber-900 text-sm">추가 초코 5개</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                  onOpenGames();
                }}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
              >
                <span>지금 마우스 게임 하러 가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
