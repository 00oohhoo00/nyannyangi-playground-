import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  UserCheck,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  User,
  Settings,
  Heart,
  ShieldCheck,
  KeyRound,
  X,
} from 'lucide-react';
import { CatSpeciesId, StudentProfile } from '../../types';
import { CAT_SPECIES } from '../../data/cats';
import {
  verifyStudentLogin,
  setStudentCatPartner,
  isValidEntranceCode,
  teacherAuthenticate,
} from '../../utils/storage';
import { getGasConfig } from '../../services/gasService';
import { CatAvatar } from '../CatAvatar';
import { GasSettingsModal } from './GasSettingsModal';
import { TeacherSimpleModal } from './TeacherSimpleModal';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface Props {
  onSuccessLogin: (student: StudentProfile) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const WelcomeModal: React.FC<Props> = ({
  onSuccessLogin,
  onClose,
  canClose = false,
}) => {
  // Tabs for student: 'login' (기존 학생 입장) | 'first_time' (선생님이 등록한 학생의 첫 입장)
  const [tab, setTab] = useState<'login' | 'first_time'>('login');

  // Student inputs
  const [studentName, setStudentName] = useState('');
  const [entranceCode, setEntranceCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [justSelectedDemo, setJustSelectedDemo] = useState<string | null>(null);

  // Input refs for Enter key navigation
  const entranceCodeInputRef = useRef<HTMLInputElement | null>(null);
  const adminPwInputRef = useRef<HTMLInputElement | null>(null);

  // Cat Selection Screen State (for first-time student whose hasChosenCat === false)
  const [pendingStudent, setPendingStudent] = useState<StudentProfile | null>(null);
  const [selectedCat, setSelectedCat] = useState<CatSpeciesId>('cheesenyang');
  const [customCatName, setCustomCatName] = useState('');
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Teacher Login Sub-Modal State
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [teacherLoginError, setTeacherLoginError] = useState<string | null>(null);
  const [isTeacherLoggingIn, setIsTeacherLoggingIn] = useState(false);

  // Teacher Simple Management Screen State
  const [teacherSession, setTeacherSession] = useState<{ token: string; name: string } | null>(null);

  // Google Apps Script Settings Modal
  const [showGasSettings, setShowGasSettings] = useState(false);
  const gasConfig = getGasConfig();

  /**
   * 1. Student Login (학생 로그인)
   * - 학생 이름과 선생님이 지정한 입장번호 입력
   * - 정상 인증되면 기존 냥냥이 놀이터로 이동
   * - 첫 입장 학생은 고양이 선택 화면으로 이동
   * - 기존 학생은 저장된 고양이와 학습 기록 불러오기
   */
  const handleStudentAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return; // 중복 요청 방지
    setErrorMessage(null);

    const cleanName = studentName.trim();
    const cleanCode = entranceCode.trim();

    if (!cleanName || !cleanCode) {
      sound.playMiss();
      setErrorMessage('친구의 이름과 선생님이 지정해 주신 비밀 입장번호를 모두 입력해 주세요!');
      return;
    }

    if (!isValidEntranceCode(cleanCode)) {
      sound.playMiss();
      setErrorMessage('입장번호는 반드시 4~8자리 숫자로 입력해 주세요! (예: 1011)');
      return;
    }

    setIsVerifying(true);
    const result = await verifyStudentLogin(cleanName, cleanCode);
    setIsVerifying(false);

    if (result.success && result.student) {
      const student = result.student;
      const hasChosenCat = result.hasChosenCat;

      // 첫 입장 학생: 아직 고양이를 선택하지 않은 경우 -> 고양이 선택 화면으로 이동
      if (!hasChosenCat) {
        sound.playPop();
        setPendingStudent(student);
        setCustomCatName(`${CAT_SPECIES[selectedCat].name}이`);
        return;
      }

      // 기존 학생: 이미 고양이를 선택한 학생은 기존 고양이와 학습 기록을 불러와서 바로 입장!
      sound.playLevelUp();
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
      onSuccessLogin(student);
    } else {
      sound.playMiss();
      // 등록되지 않은 학생
      setErrorMessage(result.error || '등록된 정보가 없어요. 선생님께 문의해 주세요.');
    }
  };

  /**
   * Cat Selection Confirmation for First-time student
   */
  const handleConfirmCatSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingStudent) return;

    setIsSavingCat(true);
    sound.playStar(1);

    const finalCatName = customCatName.trim() || `${CAT_SPECIES[selectedCat].name}이`;
    const result = await setStudentCatPartner(pendingStudent.id, selectedCat, finalCatName);
    setIsSavingCat(false);

    if (result.success && result.student) {
      sound.playLevelUp();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onSuccessLogin(result.student);
    } else {
      sound.playMiss();
      setErrorMessage(result.error || '고양이 정보 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  /**
   * 2. Teacher Login (선생님 로그인)
   * - 관리자 아이디와 비밀번호로 로그인
   * - 소스코드에 하드코딩 금지, 서버/보안 검증
   * - 인증 성공 시 간단한 학생 등록 화면으로 이동
   */
  const handleTeacherLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTeacherLoggingIn) return; // 중복 요청 방지
    setTeacherLoginError(null);

    const cleanId = adminId.trim();
    const cleanPw = adminPw.trim();

    if (!cleanId || !cleanPw) {
      sound.playMiss();
      setTeacherLoginError('선생님 아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsTeacherLoggingIn(true);
    const res = await teacherAuthenticate(cleanId, cleanPw);
    setIsTeacherLoggingIn(false);

    if (res.success && res.teacherToken) {
      sound.playStar(1);
      setShowTeacherLogin(false);
      setAdminId('');
      setAdminPw('');
      setTeacherSession({ token: res.teacherToken, name: res.teacherName || '선생님' });
    } else {
      sound.playMiss();
      setTeacherLoginError(res.error || '관리자 아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleQuickFill = (name: string, code: string) => {
    sound.playPop();
    setStudentName(name);
    setEntranceCode(code);
    setJustSelectedDemo(name);
    setErrorMessage(null);
    setTimeout(() => setJustSelectedDemo(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[95vh] flex flex-col bg-[#FFFDF9] rounded-3xl md:rounded-[36px] border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Welcome Header */}
        <div className="p-5 md:p-7 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-3 border-amber-300 text-center shrink-0 relative">
          {/* Header Top Controls: Teacher Login Button & Server Settings */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {/* Small Teacher Login Button */}
            <button
              onClick={() => {
                sound.playPop();
                setShowTeacherLogin(true);
                setTeacherLoginError(null);
              }}
              className="px-2.5 py-1 bg-white/95 hover:bg-white text-purple-800 hover:text-purple-950 rounded-full text-[11px] font-black border-2 border-purple-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="선생님 로그인 (학생 등록 및 입장번호 관리)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>👩‍🏫 선생님 로그인</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setShowGasSettings(true);
              }}
              className="p-1 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-800 rounded-full border border-amber-300 shadow-xs transition-all cursor-pointer"
              title="온라인 서버(Google Apps Script) 설정"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 mb-2 shadow-xs border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>초등학교 1~2학년 컴퓨터 학습 놀이터</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <span>🐱</span>
            <span className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent">
              냥냥이 컴놀이터
            </span>
            <span>✨</span>
          </h1>

          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-sm md:text-base font-black text-amber-950/80">
              귀여운 냥냥이와 함께하는 신나는 컴퓨터 모험!
            </p>
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

          {/* Student Mode Switcher Tabs */}
          {!pendingStudent && (
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-4">
              <button
                onClick={() => {
                  sound.playPop();
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-5 md:px-7 rounded-2xl md:rounded-3xl text-xs md:text-sm font-black transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-amber-400 text-amber-950 shadow-md scale-105 border-2 border-amber-500'
                    : 'bg-white/85 text-slate-600 hover:bg-white hover:text-slate-800 border border-amber-200'
                }`}
              >
                🔑 놀이터 입장하기 (기존 학생)
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  setTab('first_time');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-5 md:px-7 rounded-2xl md:rounded-3xl text-xs md:text-sm font-black transition-all cursor-pointer ${
                  tab === 'first_time'
                    ? 'bg-teal-400 text-teal-950 shadow-md scale-105 border-2 border-teal-500'
                    : 'bg-white/85 text-slate-600 hover:bg-white hover:text-slate-800 border border-amber-200'
                }`}
              >
                🌱 처음 왔어요! (등록된 학생 첫 입장)
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="px-6 py-3 bg-rose-500 text-white font-black text-xs md:text-sm text-center flex items-center justify-center gap-2 animate-in fade-in shadow-inner">
            <AlertCircle className="w-5 h-5 shrink-0 animate-bounce" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto">
          {pendingStudent ? (
            /* ─────────────────────────────────────────────────────────────
               Step 2: Cat Selection Screen (등록된 학생의 첫 고양이 선택)
               ───────────────────────────────────────────────────────────── */
            <form onSubmit={handleConfirmCatSelection} className="flex flex-col gap-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-3xl border-3 border-teal-300 shadow-sm text-center">
                <span className="text-3xl mb-1 block">🎉</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">
                  {pendingStudent.name} 친구, 첫 입장을 환영해요!
                </h3>
                <p className="text-xs md:text-sm text-teal-900 font-bold mt-1">
                  선생님 명단 확인이 완료되었어요. 함께 모험을 떠날 첫 아기 고양이를 골라주세요!
                </p>
              </div>

              {/* 6 Cats Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs md:text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <span>🐾</span>
                    <span>마음에 쏙 드는 고양이를 터치해 보세요! (6종)</span>
                  </h4>
                  <span className="text-xs font-black text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300">
                    선택: {CAT_SPECIES[selectedCat].name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(CAT_SPECIES) as CatSpeciesId[]).map((speciesId) => {
                    const species = CAT_SPECIES[speciesId];
                    const isSelected = selectedCat === speciesId;
                    return (
                      <div
                        key={speciesId}
                        onClick={() => {
                          sound.playPop();
                          setSelectedCat(speciesId);
                          setCustomCatName(`${species.name}이`);
                        }}
                        className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 shadow-md ring-3 ring-amber-300 scale-103'
                            : 'bg-white border-slate-200 hover:border-amber-300 hover:scale-101'
                        }`}
                      >
                        <div className="w-20 h-20 my-1">
                          <CatAvatar speciesId={speciesId} size="sm" interactive={false} />
                        </div>
                        <div className="text-center mt-1">
                          <div className="text-sm font-black text-slate-800 flex items-center justify-center gap-1">
                            <span>{species.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold">
                            {species.tagline}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cat Name Customization */}
              <div className="p-4 bg-teal-50 rounded-2xl border-2 border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-teal-950 flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>고양이 친구의 이름을 지어줄까요?</span>
                  </div>
                  <div className="text-[11px] text-teal-700 font-bold">
                    기본 이름으로 시작하거나 내가 부르고 싶은 이름을 적어주세요.
                  </div>
                </div>
                <input
                  type="text"
                  value={customCatName}
                  onChange={(e) => setCustomCatName(e.target.value)}
                  placeholder="예: 치즈버거"
                  maxLength={10}
                  className="w-full sm:w-48 py-2.5 px-4 text-sm font-black bg-white rounded-xl border-2 border-teal-300 text-center focus:outline-none focus:ring-2 focus:ring-teal-200 shadow-inner"
                  required
                />
              </div>

              {/* Confirmation Button */}
              <button
                type="submit"
                disabled={isSavingCat}
                onMouseEnter={() => sound.playPop()}
                className="w-full py-5 px-8 bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 hover:from-teal-300 hover:to-emerald-300 text-teal-950 font-black text-2xl md:text-3xl rounded-3xl border-3 border-teal-500 shadow-[0_10px_0_#0f766e] hover:shadow-[0_6px_0_#0f766e] active:shadow-[0_2px_0_#0f766e] active:translate-y-2 transition-all flex items-center justify-center gap-3 animate-playful-bounce cursor-pointer select-none group disabled:opacity-50"
              >
                <span className="text-3xl group-hover:rotate-12 transition-transform">🐾</span>
                <span className="drop-shadow-xs tracking-tight">
                  {isSavingCat ? '고양이 친구 저장 중...' : '나만의 냥냥이와 놀이터 입장하기!'}
                </span>
                <span className="text-2xl animate-pulse">✨</span>
                <ArrowRight className="w-7 h-7 text-teal-950 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </form>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               Step 1: Student Login (학생 로그인)
               ───────────────────────────────────────────────────────────── */
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
              {/* Cute Mascot Greeting Speech Bubble tailored to selected tab */}
              <div
                className={`flex items-center gap-3.5 p-3.5 md:p-4 rounded-3xl border-2 shadow-sm transition-all ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-amber-100/90 to-orange-100/80 border-amber-300'
                    : 'bg-gradient-to-r from-teal-100/90 to-emerald-100/80 border-teal-300'
                }`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0">
                  <CatAvatar speciesId="cheesenyang" size="sm" interactive={false} />
                </div>
                <div className="flex-1">
                  <div
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-black rounded-full mb-1 ${
                      tab === 'login'
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-teal-500 text-white'
                    }`}
                  >
                    {tab === 'login' ? '치즈냥이가 마중 나왔어요! 🐾' : '선생님이 등록해 주셨나요? 🎒'}
                  </div>
                  <p className="text-sm md:text-base font-black text-slate-800 leading-snug">
                    {tab === 'login' ? (
                      <>
                        "안녕 친구야! 내 <span className="text-orange-600 underline decoration-amber-400 decoration-3">이름</span>과 <span className="text-purple-600 underline decoration-purple-300 decoration-3">입장번호</span>를 적고 아래 노란 버튼을 콩콩 눌러줘냥!"
                      </>
                    ) : (
                      <>
                        "처음 온 친구도 걱정마냥! 선생님이 알려주신 <span className="text-teal-700 underline decoration-teal-300 decoration-3">이름</span>과 <span className="text-purple-600 underline decoration-purple-300 decoration-3">입장번호</span>를 적으면 첫 고양이를 만날 수 있어요!"
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Student Input Form */}
              <form onSubmit={handleStudentAuthSubmit} className="p-6 md:p-8 bg-white rounded-[32px] border-4 border-amber-200 shadow-lg flex flex-col gap-5">
                {/* Student Name */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-base md:text-lg font-black text-slate-800">
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm shadow-xs border border-amber-300">
                        <User className="w-4 h-4 text-amber-700" />
                      </span>
                      <span>이름</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          entranceCodeInputRef.current?.focus();
                        }
                      }}
                      placeholder="예: 김하윤 또는 강다운"
                      maxLength={10}
                      className="w-full py-4 md:py-5 px-6 text-xl md:text-2xl font-black text-slate-800 placeholder-slate-400 bg-amber-50/70 hover:bg-amber-50 focus:bg-white rounded-3xl md:rounded-full border-3 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/60 focus:outline-none transition-all shadow-inner"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Entrance Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-base md:text-lg font-black text-slate-800">
                      <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm shadow-xs border border-purple-300">
                        <Lock className="w-4 h-4 text-purple-700" />
                      </span>
                      <span>입장번호</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      ref={entranceCodeInputRef}
                      type={showCode ? 'text' : 'password'}
                      value={entranceCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setEntranceCode(val);
                      }}
                      placeholder="예: 1234"
                      maxLength={8}
                      className="w-full py-4 md:py-5 pl-6 pr-14 text-xl md:text-2xl font-mono font-black text-purple-900 placeholder-slate-400 bg-purple-50/60 hover:bg-purple-50 focus:bg-white rounded-3xl md:rounded-full border-3 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/60 focus:outline-none tracking-widest transition-all shadow-inner text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full transition-colors cursor-pointer"
                      title={showCode ? '입장번호 숨기기' : '입장번호 확인하기'}
                    >
                      {showCode ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {/* Highly Bouncy Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    onMouseEnter={() => sound.playPop()}
                    className={`w-full py-5 px-8 text-2xl md:text-3xl rounded-3xl border-3 shadow-[0_10px_0_#b45309] hover:shadow-[0_6px_0_#b45309] active:shadow-[0_2px_0_#b45309] active:translate-y-2 transition-all flex items-center justify-center gap-3 animate-playful-bounce cursor-pointer select-none group disabled:opacity-50 ${
                      tab === 'login'
                        ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 border-amber-500'
                        : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 hover:from-teal-300 hover:to-emerald-300 text-teal-950 border-teal-500'
                    }`}
                  >
                    <span className="text-3xl group-hover:rotate-12 transition-transform">🐾</span>
                    <span className="drop-shadow-xs tracking-tight">
                      {isVerifying
                        ? '확인 중...'
                        : tab === 'login'
                        ? '놀이터 입장하기!!'
                        : '첫 입장하고 고양이 만나기!'}
                    </span>
                    <span className="text-2xl animate-pulse">✨</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </form>

              {/* Demo Account Quick Access Card */}
              <div className="p-4 md:p-5 bg-amber-50/90 rounded-3xl border-2 border-amber-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs md:text-sm font-black text-amber-950 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>선생님이 등록해 둔 학생 계정 빠른 선택</span>
                  </div>
                  {justSelectedDemo && (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full animate-bounce">
                      ✨ {justSelectedDemo} 입력 완료!
                    </span>
                  )}
                </div>

                {tab === 'login' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { name: '김하윤', code: '1011', cat: '치즈냥', icon: '🐱', lvl: 3, bg: 'hover:bg-amber-100 hover:border-amber-400' },
                      { name: '이민준', code: '2022', cat: '솜냥', icon: '🤍', lvl: 2, bg: 'hover:bg-sky-100 hover:border-sky-400' },
                      { name: '박서연', code: '3033', cat: '별냥', icon: '⭐', lvl: 4, bg: 'hover:bg-pink-100 hover:border-pink-400' },
                      { name: '정시우', code: '4044', cat: '밤냥', icon: '🖤', lvl: 1, bg: 'hover:bg-purple-100 hover:border-purple-400' },
                    ].map((demo) => (
                      <button
                        key={demo.name}
                        type="button"
                        onClick={() => handleQuickFill(demo.name, demo.code)}
                        className={`p-3 bg-white rounded-2xl border-2 border-amber-200/80 text-left transition-all hover:scale-103 active:scale-95 shadow-xs flex flex-col justify-between cursor-pointer ${demo.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{demo.icon}</span>
                          <span className="font-mono font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg text-xs border border-purple-200">
                            {demo.code}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="font-black text-slate-800 text-sm">{demo.name}</div>
                          <div className="text-[11px] text-slate-500 font-bold">
                            {demo.cat} · Lv.{demo.lvl}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] text-teal-800 font-bold mb-2">
                      선생님이 사전에 명단에 등록해 두었으며, 아직 첫 고양이를 선택하지 않은 학생입니다:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {[
                        { name: '강다은', code: '7777' },
                        { name: '정예원', code: '1234' },
                        { name: '송우진', code: '9876' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleQuickFill(item.name, item.code)}
                          className="p-3 bg-white rounded-2xl border-2 border-teal-200 text-left transition-all hover:scale-103 active:scale-95 shadow-xs flex flex-col justify-between cursor-pointer hover:bg-teal-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">🎒</span>
                            <span className="font-mono font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-lg text-xs border border-purple-200">
                              {item.code}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="font-black text-slate-800 text-sm">{item.name}</div>
                            <div className="text-[11px] text-teal-600 font-bold">
                              첫 고양이 선택 대기 중 ✨
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Teacher Login Sub-Modal (선생님 로그인 팝업)
          - 관리자 아이디와 비밀번호 입력
          - 소스코드에 하드코딩 금지, 서버/보안 검증
          - 인증 성공 시 TeacherSimpleModal 표시
         ───────────────────────────────────────────────────────────── */}
      {showTeacherLogin && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-2xl p-6 md:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => {
                sound.playPop();
                setShowTeacherLogin(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
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

            {teacherLoginError && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{teacherLoginError}</span>
              </div>
            )}

            <form onSubmit={handleTeacherLoginSubmit} className="space-y-3.5 text-xs">
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
                      adminPwInputRef.current?.focus();
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
                    ref={adminPwInputRef}
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
                  disabled={isTeacherLoggingIn}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isTeacherLoggingIn ? '인증 확인 중...' : '선생님 로그인'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTeacherLogin(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-bold text-center"
                >
                  돌아가기 (학생 로그인으로)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Teacher Simple Management Screen (선생님 로그인 성공 후 화면)
         ───────────────────────────────────────────────────────────── */}
      {teacherSession && (
        <TeacherSimpleModal
          teacherToken={teacherSession.token}
          teacherName={teacherSession.name}
          onLogout={() => {
            sound.playPop();
            setTeacherSession(null);
          }}
          onClose={() => setTeacherSession(null)}
        />
      )}

      {/* Google Apps Script Online Settings Modal */}
      {showGasSettings && (
        <GasSettingsModal
          onClose={() => setShowGasSettings(false)}
          onConfigChanged={() => {}}
        />
      )}
    </div>
  );
};
