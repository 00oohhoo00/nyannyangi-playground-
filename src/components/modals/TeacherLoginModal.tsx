import React, { useState, useRef } from 'react';
import { X, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { teacherAuthenticate } from '../../utils/storage';
import { sound } from '../../utils/sound';

interface Props {
  onSuccess: (token: string, name: string) => void;
  onClose: () => void;
}

export const TeacherLoginModal: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Input ref for Enter key focus navigation
  const adminPwRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // 중복 요청 방지
    setError(null);

    const cleanId = adminId.trim();
    const cleanPw = adminPw.trim();

    if (!cleanId || !cleanPw) {
      sound.playMiss();
      setError('선생님 아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    const res = await teacherAuthenticate(cleanId, cleanPw);
    setIsLoading(false);

    if (res.success && res.teacherToken) {
      sound.playStar(1);
      onSuccess(res.teacherToken, res.teacherName || '선생님');
    } else {
      sound.playMiss();
      setError(res.error || '관리자 아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-2xl p-6 md:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2 border border-purple-300 shadow-xs">
            👩‍🏫
          </div>
          <h3 className="text-lg font-black text-slate-800">선생님 관리자 로그인</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            학생 등록 및 입장번호 관리를 위해 로그인해 주세요.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-black text-slate-700 mb-1">
              선생님 관리자 아이디
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  adminPwRef.current?.focus();
                }
              }}
              placeholder="관리자 아이디 입력"
              className="w-full py-2.5 px-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-sm focus:bg-white focus:border-purple-400 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block font-black text-slate-700 mb-1">
              선생님 관리자 비밀번호
            </label>
            <div className="relative">
              <input
                ref={adminPwRef}
                type={showAdminPw ? 'text' : 'password'}
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                placeholder="관리자 비밀번호 입력"
                className="w-full py-2.5 pl-3.5 pr-10 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-sm focus:bg-white focus:border-purple-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminPw(!showAdminPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showAdminPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? '인증 확인 중...' : '선생님 로그인'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-bold text-center cursor-pointer"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
