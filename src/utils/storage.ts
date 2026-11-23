import { StudentProfile, CatSpeciesId } from '../types';
import { PreRegisteredStudent, GasTeacherStudentItem } from '../types/gas';
import { DEFAULT_STUDENTS } from '../data/defaultStudents';
import { getLevelInfo } from '../data/cats';
import { hashEntranceCode, fastHash } from './crypto';
import {
  getGasConfig,
  gasVerifyStudent,
  gasSetCatPartner,
  gasSaveStudent,
  gasTeacherLogin,
  gasTeacherGetStudents,
  gasTeacherRegisterStudent,
  gasTeacherUpdateCode,
} from '../services/gasService';

const STORAGE_KEY_STUDENTS = 'nyang_all_students_v2';
const STORAGE_KEY_CURRENT_ID = 'nyang_current_student_id_v2';
const STORAGE_KEY_LOGIN_FAILURES = 'nyang_login_failures_v2';
const STORAGE_KEY_PREREGISTERED = 'nyang_preregistered_roster_v1';
const STORAGE_KEY_LOCAL_TEACHER = 'nyang_teacher_local_creds_v1';

// Default pre-registered students for testing teacher's first-entry flow (4-digit code)
const DEFAULT_PREREGISTERED_ROSTER: PreRegisteredStudent[] = [
  { name: '강다은', entranceCode: '7777', preRegisteredAt: '2026-11-10', memo: '선생님 등록 (첫 입장 대기)' },
  { name: '정예원', entranceCode: '1234', preRegisteredAt: '2026-11-10', memo: '선생님 등록 (첫 입장 대기)' },
  { name: '송우진', entranceCode: '9876', preRegisteredAt: '2026-11-10', memo: '선생님 등록 (첫 입장 대기)' },
];

/**
 * Validate entrance code: numeric string of 4 to 8 digits
 */
export function isValidEntranceCode(code: string): boolean {
  const clean = code.trim();
  return /^[0-9]{4,8}$/.test(clean);
}

function deduplicateStudentInventory(student: StudentProfile): StudentProfile {
  if (!student || !student.inventory) return student;
  return {
    ...student,
    inventory: {
      ...student.inventory,
      ribbons: Array.from(new Set(student.inventory.ribbons || [])),
      hats: Array.from(new Set(student.inventory.hats || [])),
      glasses: Array.from(new Set(student.inventory.glasses || [])),
      clothes: Array.from(new Set(student.inventory.clothes || [])),
      beds: Array.from(new Set(student.inventory.beds || [])),
      wallpapers: Array.from(new Set(student.inventory.wallpapers || [])),
      decorations: Array.from(new Set(student.inventory.decorations || [])),
    },
  };
}

export function getAllStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(deduplicateStudentInventory);
      }
    }
  } catch (e) {
    console.error('Failed to parse students from localStorage', e);
  }
  // Initialize with defaults if empty, preserving existing data
  const defaults = DEFAULT_STUDENTS.map(deduplicateStudentInventory);
  saveAllStudents(defaults);
  return defaults;
}

export function saveAllStudents(students: StudentProfile[]) {
  try {
    const cleanStudents = students.map(deduplicateStudentInventory);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(cleanStudents));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function getCurrentStudent(): StudentProfile | null {
  const all = getAllStudents();
  const currentId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
  if (!currentId) return null;
  const found = all.find((s) => s.id === currentId);
  return found || null;
}

export function setCurrentStudentId(id: string | null) {
  if (id) {
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_ID);
  }
}

export function updateStudentProfile(updated: StudentProfile): StudentProfile {
  const all = getAllStudents();
  const index = all.findIndex((s) => s.id === updated.id);
  let newAll: StudentProfile[];
  if (index >= 0) {
    newAll = [...all];
    newAll[index] = updated;
  } else {
    newAll = [...all, updated];
  }
  saveAllStudents(newAll);

  // If online mode is enabled, trigger asynchronous save to Google Apps Script
  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    gasSaveStudent(updated).catch((err) => {
      console.warn('Background online save to Google Apps Script failed:', err);
    });
  }

  return updated;
}

/**
 * Pre-registered Roster Management (선생님이 사전에 등록해 둔 학생 명단)
 */
export function getPreRegisteredRoster(): PreRegisteredStudent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREREGISTERED);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse pre-registered roster', e);
  }
  savePreRegisteredRoster(DEFAULT_PREREGISTERED_ROSTER);
  return DEFAULT_PREREGISTERED_ROSTER;
}

export function savePreRegisteredRoster(roster: PreRegisteredStudent[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PREREGISTERED, JSON.stringify(roster));
  } catch (e) {
    console.error('Failed to save pre-registered roster', e);
  }
}

export function addPreRegisteredStudent(name: string, entranceCode: string, memo: string = ''): boolean {
  const cleanName = name.trim();
  const cleanCode = entranceCode.trim();
  if (!cleanName || !isValidEntranceCode(cleanCode)) return false;

  const roster = getPreRegisteredRoster();
  const exists = roster.some((r) => r.name === cleanName && r.entranceCode === cleanCode);
  if (exists) return false;

  const updated = [
    ...roster,
    {
      name: cleanName,
      entranceCode: cleanCode,
      preRegisteredAt: new Date().toISOString().split('T')[0],
      memo: memo || '선생님 등록',
    },
  ];
  savePreRegisteredRoster(updated);
  return true;
}

export function removePreRegisteredStudent(name: string, entranceCode: string) {
  const roster = getPreRegisteredRoster();
  const updated = roster.filter(
    (r) => !(r.name === name.trim() && r.entranceCode === entranceCode.trim())
  );
  savePreRegisteredRoster(updated);
}

/**
 * Unified Student Verification
 *
 * 1. 학생 이름과 선생님이 지정한 입장번호 입력
 * 2. 정상 인증되면 기존 냥냥이 놀이터로 이동
 * 3. 첫 입장 학생은 고양이 선택 화면으로 이동
 * 4. 기존 학생은 저장된 고양이와 학습 기록 불러오기
 * 5. 미등록 학생은 '등록된 정보가 없어요. 선생님께 문의해 주세요.' 반환
 */
export async function verifyStudentLogin(
  name: string,
  entranceCode: string
): Promise<{
  success: boolean;
  student?: StudentProfile;
  hasChosenCat?: boolean;
  error?: string;
  remainingLockSeconds?: number;
}> {
  const cleanName = name.trim();
  const cleanCode = entranceCode.trim();

  if (!cleanName) {
    return { success: false, error: '친구의 이름을 입력해 주세요!' };
  }

  if (!cleanCode) {
    return { success: false, error: '선생님이 지정해 주신 비밀 입장번호를 입력해 주세요!' };
  }

  if (!isValidEntranceCode(cleanCode)) {
    return {
      success: false,
      error: '입장번호는 4~8자리 숫자로 입력해 주세요! (예: 1011)',
    };
  }

  // ─── 1. Google Apps Script Online Mode ───
  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    const onlineRes = await gasVerifyStudent(cleanName, cleanCode);
    if (onlineRes.success && onlineRes.student) {
      const cleanStudent = deduplicateStudentInventory(onlineRes.student);
      const all = getAllStudents();
      const existingIdx = all.findIndex((s) => s.id === cleanStudent.id || s.name === cleanStudent.name);
      if (existingIdx >= 0) {
        all[existingIdx] = cleanStudent;
        saveAllStudents(all);
      } else {
        saveAllStudents([cleanStudent, ...all]);
      }
      setCurrentStudentId(cleanStudent.id);
      return {
        success: true,
        student: cleanStudent,
        hasChosenCat: Boolean(onlineRes.hasChosenCat ?? cleanStudent.hasChosenCat),
      };
    } else {
      // Do NOT mock fake success!
      return {
        success: false,
        error: onlineRes.error || '등록된 정보가 없어요. 선생님께 문의해 주세요.',
      };
    }
  }

  // ─── 2. Local Storage / Offline Mode ───
  const now = Date.now();
  try {
    const failureDataRaw = localStorage.getItem(STORAGE_KEY_LOGIN_FAILURES);
    if (failureDataRaw) {
      const failureData = JSON.parse(failureDataRaw);
      if (failureData.lockedUntil && failureData.lockedUntil > now) {
        const remainingSeconds = Math.ceil((failureData.lockedUntil - now) / 1000);
        return {
          success: false,
          error: `로그인 시도 횟수를 초과했어요. ${remainingSeconds}초 후에 다시 시도해 주세요.`,
          remainingLockSeconds: remainingSeconds,
        };
      }
    }
  } catch {
    // Ignore error
  }

  const all = getAllStudents();
  const codeHash = await hashEntranceCode(cleanCode);
  const codeFastHash = fastHash(cleanCode);

  // Check already registered student list
  const matchedExisting = all.find(
    (s) => s.name === cleanName && (s.entranceCodeHash === codeHash || s.entranceCodeHash === codeFastHash)
  );

  if (matchedExisting) {
    localStorage.removeItem(STORAGE_KEY_LOGIN_FAILURES);
    setCurrentStudentId(matchedExisting.id);
    const hasChosen = matchedExisting.hasChosenCat !== false && Boolean(matchedExisting.catType);
    return {
      success: true,
      student: matchedExisting,
      hasChosenCat: hasChosen,
    };
  }

  // If not in active registered list, check teacher pre-registered roster!
  const preRoster = getPreRegisteredRoster();
  const preMatched = preRoster.find(
    (r) => r.name === cleanName && r.entranceCode === cleanCode
  );

  if (preMatched) {
    localStorage.removeItem(STORAGE_KEY_LOGIN_FAILURES);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const personalCode = `NYANG-${cleanCode}`;
    const today = new Date().toISOString().split('T')[0];

    const initialStudent: StudentProfile = {
      id: `std_${Date.now()}_${randomSuffix}`,
      personalCode,
      entranceCodeHash: codeHash,
      name: cleanName,
      school: '',
      gradeClass: '',
      catType: 'cheesenyang',
      catName: '치즈냥',
      hasChosenCat: false, // First-time student: has not chosen cat yet
      level: 1,
      exp: 0,
      choco: 30,
      gameStats: {},
      inventory: {
        ribbons: ['ribbon_red'],
        hats: [],
        glasses: [],
        clothes: [],
        beds: [],
        wallpapers: [],
        decorations: ['rf_cushion'],
      },
      equipped: {
        ribbon: 'ribbon_red',
      },
      roomItems: [
        { id: `rm_${Date.now()}`, itemId: 'rf_cushion', name: '하트 솜쿠션', category: 'cushion', icon: '💖', x: 50, y: 70 },
      ],
      unlockedStickers: ['st_paw', 'st_fish'],
      lastLoginDate: today,
      dailyBonusClaimedDates: [today],
      createdAt: today,
    };

    saveAllStudents([initialStudent, ...all]);
    setCurrentStudentId(initialStudent.id);
    removePreRegisteredStudent(cleanName, cleanCode);

    return {
      success: true,
      student: initialStudent,
      hasChosenCat: false,
    };
  }

  // Not found in either existing students or pre-registered list:
  recordLoginFailure();
  return {
    success: false,
    error: '등록된 정보가 없어요. 선생님께 문의해 주세요.',
  };
}

/**
 * Set and save chosen cat partner for the student
 */
export async function setStudentCatPartner(
  studentId: string,
  catType: CatSpeciesId,
  catName: string
): Promise<{ success: boolean; student: StudentProfile; error?: string }> {
  const all = getAllStudents();
  const target = all.find((s) => s.id === studentId);
  if (!target) {
    return { success: false, student: target!, error: '학생 정보를 찾을 수 없습니다.' };
  }

  const updated: StudentProfile = {
    ...target,
    catType,
    catName: catName.trim() || '야옹이',
    hasChosenCat: true,
  };

  updateStudentProfile(updated);
  setCurrentStudentId(updated.id);

  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    await gasSetCatPartner(studentId, catType, catName.trim() || '야옹이');
  }

  return { success: true, student: updated };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Teacher Security & Student Management Functions
   - 관리자 아이디/비밀번호 하드코딩 절대 금지
   - Google Apps Script 서버에서 권한 검증 및 세션 토큰 확인
   - 학생 등록, 중복 확인, 입장번호 변경 지원
───────────────────────────────────────────────────────────────────────────── */

/**
 * Teacher Login
 * - If GAS is enabled, verifies against the spreadsheet server.
 * - If GAS is not enabled, checks local secure hash (or initializes on first teacher setup).
 */
export async function teacherAuthenticate(
  adminId: string,
  adminPw: string
): Promise<{ success: boolean; teacherToken?: string; teacherName?: string; error?: string }> {
  const cleanId = adminId.trim();
  const cleanPw = adminPw.trim();

  if (!cleanId || !cleanPw) {
    return { success: false, error: '선생님 아이디와 비밀번호를 모두 입력해 주세요.' };
  }

  // 1. Online Google Apps Script Mode
  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    const res = await gasTeacherLogin(cleanId, cleanPw);
    if (res.success && res.teacherToken) {
      return {
        success: true,
        teacherToken: res.teacherToken,
        teacherName: res.teacherName || '선생님',
      };
    }
    return {
      success: false,
      error: res.error || '관리자 아이디 또는 비밀번호가 일치하지 않습니다.',
    };
  }

  // 2. Local Mode Security (No credentials hardcoded in source code!)
  try {
    const rawLocal = localStorage.getItem(STORAGE_KEY_LOCAL_TEACHER);
    const pwHash = await hashEntranceCode(cleanPw);

    if (!rawLocal) {
      // First-time teacher credential setup on this browser
      const creds = { adminId: cleanId, pwHash, createdAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY_LOCAL_TEACHER, JSON.stringify(creds));
      const localToken = `local_teacher_${Date.now()}`;
      return { success: true, teacherToken: localToken, teacherName: '선생님' };
    }

    const saved = JSON.parse(rawLocal);
    if (saved.adminId === cleanId && saved.pwHash === pwHash) {
      const localToken = `local_teacher_${Date.now()}`;
      return { success: true, teacherToken: localToken, teacherName: '선생님' };
    }

    return { success: false, error: '관리자 아이디 또는 비밀번호가 일치하지 않습니다.' };
  } catch (err) {
    return { success: false, error: '인증 처리 중 오류가 발생했습니다.' };
  }
}

/**
 * Teacher Fetch Students List
 */
export async function teacherGetStudentsList(
  teacherToken: string
): Promise<{ success: boolean; students?: GasTeacherStudentItem[]; error?: string }> {
  if (!teacherToken) {
    return { success: false, error: '관리자 인증이 필요합니다.' };
  }

  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    return await gasTeacherGetStudents(teacherToken);
  }

  // Local mode students list
  const all = getAllStudents();
  const pre = getPreRegisteredRoster();
  const list: GasTeacherStudentItem[] = [];
  const seen = new Set<string>();

  all.forEach((s) => {
    // Determine plain 4-digit entrance code if possible or from personalCode
    const rawCode = s.personalCode.replace('NYANG-', '') || '****';
    list.push({
      id: s.id,
      name: s.name,
      entranceCode: rawCode.length === 4 ? rawCode : '1011',
      hasChosenCat: s.hasChosenCat !== false && Boolean(s.catType),
      catType: s.catType,
      catName: s.catName,
      level: s.level,
      exp: s.exp,
      choco: s.choco,
      lastLoginDate: s.lastLoginDate,
    });
    seen.add(s.name);
  });

  pre.forEach((p, idx) => {
    if (!seen.has(p.name)) {
      list.push({
        id: `pre_${idx}`,
        name: p.name,
        entranceCode: p.entranceCode,
        hasChosenCat: false,
        catType: '',
        catName: '첫 입장 대기 중',
        level: 1,
        exp: 0,
        choco: 30,
        lastLoginDate: '-',
      });
    }
  });

  return { success: true, students: list };
}

/**
 * Teacher Direct Student Registration (학생 이름 + 입장번호)
 * - 같은 이름과 입장번호 조합 중복 등록 방지
 */
export async function teacherRegisterStudentDirect(
  teacherToken: string,
  name: string,
  entranceCode: string
): Promise<{ success: boolean; student?: GasTeacherStudentItem; error?: string }> {
  if (!teacherToken) {
    return { success: false, error: '관리자 인증이 필요합니다.' };
  }

  const cleanName = name.trim();
  const cleanCode = entranceCode.trim();

  if (!cleanName) {
    return { success: false, error: '학생 이름을 입력해 주세요.' };
  }

  if (!isValidEntranceCode(cleanCode)) {
    return { success: false, error: '입장번호는 반드시 4~8자리 숫자로 입력해 주세요.' };
  }

  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    return await gasTeacherRegisterStudent(teacherToken, cleanName, cleanCode);
  }

  // Local duplicate check
  const all = getAllStudents();
  const pre = getPreRegisteredRoster();

  // Check in all registered
  const duplicateRegistered = all.some(
    (s) => s.name === cleanName && s.personalCode === `NYANG-${cleanCode}`
  );
  if (duplicateRegistered) {
    return { success: false, error: '이미 같은 이름과 입장번호로 등록된 학생이 있습니다.' };
  }

  // Check in pre-registered
  const duplicatePre = pre.some(
    (p) => p.name === cleanName && p.entranceCode === cleanCode
  );
  if (duplicatePre) {
    return { success: false, error: '이미 같은 이름과 입장번호로 등록된 학생이 있습니다.' };
  }

  addPreRegisteredStudent(cleanName, cleanCode, '선생님 직접 등록');

  return {
    success: true,
    student: {
      id: `pre_${Date.now()}`,
      name: cleanName,
      entranceCode: cleanCode,
      hasChosenCat: false,
      catName: '첫 입장 대기 중',
      level: 1,
      exp: 0,
      choco: 30,
    },
  };
}

/**
 * Teacher Update Student Entrance Code
 * - 기존 학생의 고양이·초코·학습 기록은 100% 유지!
 */
export async function teacherUpdateStudentCode(
  teacherToken: string,
  studentId: string,
  newCode: string
): Promise<{ success: boolean; newCode?: string; error?: string }> {
  if (!teacherToken) {
    return { success: false, error: '관리자 인증이 필요합니다.' };
  }

  const cleanCode = newCode.trim();
  if (!isValidEntranceCode(cleanCode)) {
    return { success: false, error: '새 입장번호는 반드시 4~8자리 숫자여야 합니다.' };
  }

  const gasConfig = getGasConfig();
  if (gasConfig.isEnabled && gasConfig.serverUrl) {
    return await gasTeacherUpdateCode(teacherToken, studentId, cleanCode);
  }

  // Local update
  const all = getAllStudents();
  const hash = await hashEntranceCode(cleanCode);
  let found = false;

  const updatedAll = all.map((s) => {
    if (s.id === studentId) {
      found = true;
      return {
        ...s,
        entranceCodeHash: hash,
        personalCode: `NYANG-${cleanCode}`,
      };
    }
    return s;
  });

  if (found) {
    saveAllStudents(updatedAll);
    return { success: true, newCode: cleanCode };
  }

  // If in pre-registered roster
  const pre = getPreRegisteredRoster();
  const updatedPre = pre.map((p) => {
    if (p.id === studentId || `pre_${p.name}` === studentId) {
      return { ...p, entranceCode: cleanCode };
    }
    return p;
  });
  savePreRegisteredRoster(updatedPre);

  return { success: true, newCode: cleanCode };
}

/**
 * Direct student creation fallback
 */
export async function createNewStudent(
  name: string,
  catType: CatSpeciesId = 'cheesenyang',
  catName: string = '치즈냥',
  entranceCode: string
): Promise<{ success: boolean; student?: StudentProfile; entranceCode?: string; error?: string }> {
  const cleanName = name.trim();
  const cleanCode = entranceCode.trim();

  if (!cleanName) return { success: false, error: '학생 이름을 입력해 주세요.' };
  if (!isValidEntranceCode(cleanCode)) {
    return { success: false, error: '입장번호는 4~8자리 숫자로 입력해 주세요.' };
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const personalCode = `NYANG-${cleanCode}`;
  const today = new Date().toISOString().split('T')[0];
  const hashedCode = await hashEntranceCode(cleanCode);

  const newStudent: StudentProfile = {
    id: `std_${Date.now()}_${randomSuffix}`,
    personalCode,
    entranceCodeHash: hashedCode,
    name: cleanName,
    school: '',
    gradeClass: '',
    catType,
    catName: catName.trim() || '치즈냥',
    hasChosenCat: true,
    level: 1,
    exp: 0,
    choco: 30,
    gameStats: {},
    inventory: {
      ribbons: ['ribbon_red'],
      hats: [],
      glasses: [],
      clothes: [],
      beds: [],
      wallpapers: [],
      decorations: ['rf_cushion'],
    },
    equipped: { ribbon: 'ribbon_red' },
    roomItems: [
      { id: `rm_${Date.now()}`, itemId: 'rf_cushion', name: '하트 솜쿠션', category: 'cushion', icon: '💖', x: 50, y: 70 },
    ],
    unlockedStickers: ['st_paw', 'st_fish'],
    lastLoginDate: today,
    dailyBonusClaimedDates: [today],
    createdAt: today,
  };

  const all = getAllStudents();
  saveAllStudents([newStudent, ...all]);
  return { success: true, student: newStudent, entranceCode: cleanCode };
}

function recordLoginFailure() {
  try {
    const failureDataRaw = localStorage.getItem(STORAGE_KEY_LOGIN_FAILURES);
    let attempts = 0;
    if (failureDataRaw) {
      const data = JSON.parse(failureDataRaw);
      attempts = data.attempts || 0;
    }
    attempts += 1;

    let lockedUntil = 0;
    if (attempts >= 5) {
      lockedUntil = Date.now() + 30 * 1000; // 30 second cooldown
      attempts = 0;
    }

    localStorage.setItem(
      STORAGE_KEY_LOGIN_FAILURES,
      JSON.stringify({ attempts, lockedUntil })
    );
  } catch {
    // Ignore error
  }
}

// Reissue entrance code by teacher
export async function reissueEntranceCode(
  studentId: string,
  newCode?: string
): Promise<string> {
  const code = (newCode && isValidEntranceCode(newCode))
    ? newCode.trim()
    : String(Math.floor(1000 + Math.random() * 9000));
  const hash = await hashEntranceCode(code);

  const all = getAllStudents();
  const updatedAll = all.map((s) =>
    s.id === studentId ? { ...s, entranceCodeHash: hash, personalCode: `NYANG-${code}` } : s
  );
  saveAllStudents(updatedAll);
  return code;
}

export function checkDailyBonus(student: StudentProfile): {
  eligible: boolean;
  bonusAmount: number;
  updatedProfile?: StudentProfile;
} {
  const today = new Date().toISOString().split('T')[0];
  const alreadyClaimed = student.dailyBonusClaimedDates?.includes(today);

  if (alreadyClaimed) {
    return { eligible: false, bonusAmount: 0 };
  }

  const updated: StudentProfile = {
    ...student,
    choco: student.choco + 10,
    dailyBonusClaimedDates: [...(student.dailyBonusClaimedDates || []), today],
    lastLoginDate: today,
  };

  updateStudentProfile(updated);
  return {
    eligible: true,
    bonusAmount: 10,
    updatedProfile: updated,
  };
}

export function addGameReward(
  student: StudentProfile,
  gameId: number,
  difficulty: 'easy' | 'normal' | 'hard',
  score: number,
  stars: number
): {
  earnedChoco: number;
  earnedExp: number;
  isFirstClear: boolean;
  leveledUp: boolean;
  newLevel: number;
  updatedStudent: StudentProfile;
} {
  const currentStats = student.gameStats[gameId] || {
    easy: { completed: false, bestScore: 0, stars: 0, firstClearRewardClaimed: false },
    normal: { completed: false, bestScore: 0, stars: 0, firstClearRewardClaimed: false },
    hard: { completed: false, bestScore: 0, stars: 0, firstClearRewardClaimed: false },
    playCount: 0,
  };

  const diffRecord = currentStats[difficulty] || {
    completed: false,
    bestScore: 0,
    stars: 0,
    firstClearRewardClaimed: false,
  };

  const isFirstClear = !diffRecord.completed;

  // Base choco
  let earnedChoco = 5;
  let earnedExp = 15;
  if (difficulty === 'normal') {
    earnedChoco = 10;
    earnedExp = 25;
  } else if (difficulty === 'hard') {
    earnedChoco = 15;
    earnedExp = 40;
  }

  // 3-star bonus
  if (stars === 3) {
    earnedChoco += 5;
  }

  // First time clear bonus
  if (isFirstClear) {
    earnedChoco += 5;
    earnedExp += 15;
  }

  const newScore = Math.max(diffRecord.bestScore, score);
  const newStars = Math.max(diffRecord.stars, stars);

  const updatedStats = {
    ...student.gameStats,
    [gameId]: {
      ...currentStats,
      [difficulty]: {
        completed: true,
        bestScore: newScore,
        stars: newStars,
        firstClearRewardClaimed: true,
      },
      playCount: currentStats.playCount + 1,
    },
  };

  const newTotalExp = student.exp + earnedExp;
  const newLevelInfo = getLevelInfo(newTotalExp);
  const leveledUp = newLevelInfo.currentLevel.level > student.level;
  const newLevel = newLevelInfo.currentLevel.level;

  let extraLevelChoco = 0;
  if (leveledUp) {
    extraLevelChoco = newLevelInfo.currentLevel.rewardChoco;
  }

  const updatedStudent: StudentProfile = {
    ...student,
    choco: student.choco + earnedChoco + extraLevelChoco,
    exp: newTotalExp,
    level: newLevel,
    gameStats: updatedStats,
  };

  updateStudentProfile(updatedStudent);

  return {
    earnedChoco: earnedChoco + extraLevelChoco,
    earnedExp,
    isFirstClear,
    leveledUp,
    newLevel,
    updatedStudent,
  };
}
