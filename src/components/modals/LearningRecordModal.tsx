import React from 'react';
import { X, Star, Award, Trophy, CheckCircle, BarChart3 } from 'lucide-react';
import { StudentProfile } from '../../types';
import { CAT_SPECIES, getLevelInfo } from '../../data/cats';
import { sound } from '../../utils/sound';

interface Props {
  student: StudentProfile;
  onClose: () => void;
}

const GAME_NAMES: Record<number, { name: string; icon: string; category: string }> = {
  1: { name: '생선 톡톡', icon: '🐟', category: '클릭 반응' },
  2: { name: '고양이 간식 찾기', icon: '🥫', category: '정밀 탐색' },
  3: { name: '선물상자 열기', icon: '🎁', category: '더블클릭' },
  4: { name: '생선 바구니', icon: '🧺', category: '드래그 & 드롭' },
  5: { name: '발자국 미로', icon: '🐾', category: '경로 제어' },
  6: { name: '고양이 퍼즐', icon: '🧩', category: '위치 맞추기' },
  7: { name: '별을 잡아라', icon: '⭐', category: '순발력 클릭' },
  8: { name: '고양이 색칠놀이', icon: '🎨', category: '영역 색칠' },
  9: { name: '냥냥이 메뉴 선택', icon: '🖱️', category: '마우스 우클릭' },
  10: { name: '초코 타자 챌린지', icon: '⌨️', category: '한글 타자' },
};

export const LearningRecordModal: React.FC<Props> = ({ student, onClose }) => {
  const species = CAT_SPECIES[student.catType] || CAT_SPECIES.cheesenyang;
  const levelData = getLevelInfo(student.exp);

  let totalPlays = 0;
  let totalStars = 0;
  let completedGameCount = 0;

  Object.values(student.gameStats || {}).forEach((stats) => {
    totalPlays += stats.playCount || 0;
    const isCompleted = stats.easy?.completed || stats.normal?.completed || stats.hard?.completed;
    if (isCompleted) completedGameCount++;
    totalStars += (stats.easy?.stars || 0) + (stats.normal?.stars || 0) + (stats.hard?.stars || 0);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">📊</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                {student.name}의 컴퓨터 학습 기록
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                지금까지 배우고 성장한 나의 컴퓨터 놀이터 기록장이에요!
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

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {/* Top Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🐱</span>
              <span className="text-[11px] font-bold text-slate-500">파트너 냥냥이</span>
              <span className="text-sm font-black text-slate-800">{student.catName}</span>
              <span className="text-[10px] text-amber-700 font-bold mt-0.5">
                Lv.{levelData.currentLevel.level} {levelData.currentLevel.title}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🎮</span>
              <span className="text-[11px] font-bold text-slate-500">완료한 게임</span>
              <span className="text-xl font-black text-teal-700 tabular-nums">
                {completedGameCount} / 10개
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                누적 {totalPlays}회 플레이
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">⭐</span>
              <span className="text-[11px] font-bold text-slate-500">획득한 별점</span>
              <span className="text-xl font-black text-amber-500 tabular-nums">{totalStars}개</span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">별 3개 목표!</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🆔</span>
              <span className="text-[11px] font-bold text-slate-500">개인 학습 코드</span>
              <span className="text-xs font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 mt-1">
                {student.personalCode}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">
                {student.school} {student.gradeClass}
              </span>
            </div>
          </div>

          {/* 10 Games Breakdown Table */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs p-4">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>10개 마우스 & 키보드 게임별 세부 현황</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-amber-50/80 border-b border-amber-200 text-slate-700 font-black">
                    <th className="py-2.5 px-3">게임 이름</th>
                    <th className="py-2.5 px-3">학습 영역</th>
                    <th className="py-2.5 px-3 text-center">쉬움 단계</th>
                    <th className="py-2.5 px-3 text-center">보통 단계</th>
                    <th className="py-2.5 px-3 text-center">어려움 단계</th>
                    <th className="py-2.5 px-3 text-right">최고 점수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const gameId = i + 1;
                    const gameMeta = GAME_NAMES[gameId];
                    const stats = student.gameStats?.[gameId];

                    const easyCleared = stats?.easy?.completed;
                    const normalCleared = stats?.normal?.completed;
                    const hardCleared = stats?.hard?.completed;

                    const maxScore = Math.max(
                      stats?.easy?.bestScore || 0,
                      stats?.normal?.bestScore || 0,
                      stats?.hard?.bestScore || 0
                    );

                    return (
                      <tr key={gameId} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-2">
                          <span className="text-lg">{gameMeta.icon}</span>
                          <span>
                            {gameId}. {gameMeta.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-medium">
                          {gameMeta.category}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {easyCleared ? (
                            <span className="inline-flex items-center gap-0.5 text-teal-600 font-black">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{stats?.easy?.stars}★</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {normalCleared ? (
                            <span className="inline-flex items-center gap-0.5 text-teal-600 font-black">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{stats?.normal?.stars}★</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {hardCleared ? (
                            <span className="inline-flex items-center gap-0.5 text-teal-600 font-black">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{stats?.hard?.stars}★</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-800 tabular-nums">
                          {maxScore > 0 ? `${maxScore}점` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
