import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UserPlus,
  Search,
  RefreshCw,
  LogOut,
  Settings,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { GasTeacherStudentItem } from '../../types/gas';
import {
  teacherGetStudentsList,
  teacherRegisterStudentDirect,
  teacherUpdateStudentCode,
  isValidEntranceCode,
} from '../../utils/storage';
import { generateEntranceCode } from '../../utils/crypto';
import { getGasConfig } from '../../services/gasService';
import { GasSettingsModal } from './GasSettingsModal';
import { sound } from '../../utils/sound';

interface Props {
  teacherToken: string;
  teacherName?: string;
  onLogout: () => void;
  onClose: () => void;
}

export const TeacherSimpleModal: React.FC<Props> = ({
  teacherToken,
  teacherName = '선생님',
  onLogout,
  onClose,
}) => {
  const [students, setStudents] = useState<GasTeacherStudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Student Registration Form
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState(generateEntranceCode());
  const [isRegistering, setIsRegistering] = useState(false);
  const newCodeRef = useRef<HTMLInputElement | null>(null);

  // Entrance Code Edit Sub-modal
  const [editingStudent, setEditingStudent] = useState<GasTeacherStudentItem | null>(null);
  const [editCode, setEditCode] = useState('');
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  // Google Apps Script Settings Modal
  const [showGasModal, setShowGasModal] = useState(false);
  const gasConfig = getGasConfig();

  // Load students list on mount
  const loadStudents = async () => {
    setIsLoading(true);
    const res = await teacherGetStudentsList(teacherToken);
    setIsLoading(false);
    if (res.success && res.students) {
      setStudents(res.students);
    } else {
      setNotice({ type: 'error', text: res.error || '학생 명단을 불러오지 못했습니다.' });
    }
  };

  useEffect(() => {
    loadStudents();
  }, [teacherToken]);

  // Handle Register Student
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) return; // 중복 요청 방지
    setNotice(null);

    const cleanName = newName.trim();
    const cleanCode = newCode.trim();

    if (!cleanName) {
      sound.playMiss();
      setNotice({ type: 'error', text: '학생 이름을 입력해 주세요.' });
      return;
    }

    if (!isValidEntranceCode(cleanCode)) {
      sound.playMiss();
      setNotice({ type: 'error', text: '입장번호는 반드시 4~8자리 숫자로 입력해 주세요! (예: 1011)' });
      return;
    }

    setIsRegistering(true);
    const res = await teacherRegisterStudentDirect(teacherToken, cleanName, cleanCode);
    setIsRegistering(false);

    if (res.success) {
      sound.playLevelUp();
      setNotice({
        type: 'success',
        text: `✨ ${cleanName} 학생(입장번호: ${cleanCode})이 성공적으로 등록되었습니다!`,
      });
      setNewName('');
      setNewCode(generateEntranceCode());
      loadStudents();
    } else {
      sound.playMiss();
      setNotice({ type: 'error', text: res.error || '학생 등록에 실패했습니다.' });
    }
  };

  // Handle Update Entrance Code
  const handleUpdateCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingCode) return; // 중복 요청 방지
    if (!editingStudent) return;
    setNotice(null);

    const cleanCode = editCode.trim();
    if (!isValidEntranceCode(cleanCode)) {
      sound.playMiss();
      setNotice({ type: 'error', text: '새 입장번호는 반드시 4~8자리 숫자로 입력해 주세요.' });
      return;
    }

    setIsUpdatingCode(true);
    const res = await teacherUpdateStudentCode(teacherToken, editingStudent.id, cleanCode);
    setIsUpdatingCode(false);

    if (res.success) {
      sound.playStar(1);
      setNotice({
        type: 'success',
        text: `🔑 ${editingStudent.name} 학생의 입장번호가 [${cleanCode}]로 변경되었습니다. (고양이·학습기록 유지)`,
      });
      setEditingStudent(null);
      loadStudents();
    } else {
      sound.playMiss();
      setNotice({ type: 'error', text: res.error || '입장번호 변경에 실패했습니다.' });
    }
  };

  // Filter students by name
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.entranceCode.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-[#FFFDF9] rounded-3xl md:rounded-[36px] border-4 border-teal-400 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-200 via-emerald-100 to-amber-100 border-b-2 border-teal-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">👩‍🏫</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 bg-teal-600 text-white rounded-md">
                  선생님 로그인 중 ({teacherName})
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    gasConfig.isEnabled && gasConfig.serverUrl
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {gasConfig.isEnabled && gasConfig.serverUrl ? '🌐 GAS 온라인 연동' : '💻 로컬 모드'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">
                학생 등록 및 입장번호 관리
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGasModal(true)}
              className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-purple-700 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer"
              title="Google Apps Script 서버 주소 설정"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onLogout();
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-xl border border-rose-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="로그아웃 (학생 로그인 화면으로 돌아가기)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div
            className={`px-6 py-2.5 text-xs font-black text-center flex items-center justify-center gap-2 animate-in fade-in shrink-0 ${
              notice.type === 'success'
                ? 'bg-teal-500 text-white shadow-xs'
                : 'bg-rose-500 text-white shadow-xs'
            }`}
          >
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-6">
          {/* Section 1: Student Registration Form */}
          <div className="p-5 bg-white rounded-3xl border-3 border-teal-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>학생 신규 등록 (이름 + 입장번호)</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                중복 등록 방지 적용
              </span>
            </div>

            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  학생 이름 *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      newCodeRef.current?.focus();
                    }
                  }}
                  placeholder="예: 김하윤"
                  maxLength={10}
                  className="w-full py-2.5 px-3.5 text-sm font-black bg-slate-50 hover:bg-white focus:bg-white rounded-2xl border-2 border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    입장번호 *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setNewCode(generateEntranceCode());
                    }}
                    className="text-[10px] text-teal-700 hover:underline font-bold"
                  >
                    새 번호 추천
                  </button>
                </div>
                <input
                  ref={newCodeRef}
                  type="text"
                  value={newCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setNewCode(val);
                  }}
                  placeholder="예: 1011"
                  maxLength={8}
                  className="w-full py-2.5 px-3.5 text-sm font-mono font-black text-purple-900 bg-purple-50/60 hover:bg-white focus:bg-white rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-center tracking-widest"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-2.5 px-5 bg-teal-500 hover:bg-teal-400 text-white font-black text-sm rounded-2xl border-2 border-teal-600 shadow-sm hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isRegistering ? '등록 중...' : '학생 등록하기'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Registered Students List & Search */}
          <div className="p-5 bg-white rounded-3xl border-3 border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm md:text-base font-black text-slate-800">
                  등록된 학생 명단 및 입장번호 확인 ({filteredStudents.length}명)
                </h3>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="학생 이름 검색..."
                  className="w-full py-2 pl-9 pr-3 text-xs bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                <span>학생 명단을 불러오는 중입니다...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-2xl">
                검색된 학생이 없습니다. 상단에서 학생을 직접 등록해 보세요!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-black">
                      <th className="py-2.5 px-4">학생 이름</th>
                      <th className="py-2.5 px-3">입장번호</th>
                      <th className="py-2.5 px-3">고양이 파트너 상태</th>
                      <th className="py-2.5 px-3 text-right">보유 초코 / 레벨</th>
                      <th className="py-2.5 px-4 text-center">입장번호 관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 font-black text-slate-900 text-sm">
                          {s.name}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-sm bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-lg border border-purple-200">
                            {s.entranceCode}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {s.hasChosenCat ? (
                            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                              🐱 {s.catName || '고양이'} ({s.catType || '선택 완료'})
                            </span>
                          ) : (
                            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              🎒 첫 입장 대기 중 (고양이 미선택)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700">
                          <span className="text-amber-800 font-black">🍫 {s.choco}</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="text-teal-700 font-black">Lv.{s.level}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              sound.playPop();
                              setEditingStudent(s);
                              setEditCode(s.entranceCode);
                            }}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                            title="입장번호 변경"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>번호 변경</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Edit Entrance Code Sub-Modal */}
        {editingStudent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-2xl p-6 max-w-sm w-full text-center animate-in zoom-in-90 duration-200">
              <div className="text-4xl mb-2">🔑</div>
              <h4 className="text-lg font-black text-slate-800 mb-1">
                {editingStudent.name} 학생 입장번호 변경
              </h4>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">
                학생의 기존 고양이, 보유 초코, 학습 기록은 안전하게 유지됩니다.
              </p>

              <form onSubmit={handleUpdateCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    새로운 입장번호
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditCode(val);
                    }}
                    placeholder="예: 2022"
                    maxLength={8}
                    className="w-full py-2.5 px-4 font-mono font-black text-2xl text-center text-purple-900 bg-purple-50 rounded-2xl border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200 tracking-widest"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingCode}
                    className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingCode ? '변경 중...' : '번호 변경 완료'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Google Apps Script Online Settings Modal */}
        {showGasModal && (
          <GasSettingsModal onClose={() => setShowGasModal(false)} />
        )}
      </div>
    </div>
  );
};
