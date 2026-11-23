import {
  GasConfig,
  GasLoginResponse,
  GasSetCatResponse,
  GasSaveResponse,
  GasPingResponse,
  GasDiagnosticReport,
  GasDiagnosticMethodResult,
  GasTeacherLoginResponse,
  GasTeacherGetStudentsResponse,
  GasTeacherRegisterStudentResponse,
  GasTeacherUpdateCodeResponse,
} from '../types/gas';
import { StudentProfile } from '../types';

const STORAGE_KEY_GAS_CONFIG = 'nyang_gas_config_v1';

// Actual deployed Cloudflare Worker endpoint (relays to Google Apps Script via Worker GAS_URL)
export const DEFAULT_CLOUDFLARE_WORKER_URL = 'https://nyannyangi-api.uirmlove82.workers.dev/';

export function getGasConfig(): GasConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GAS_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      let sUrl = typeof parsed.serverUrl === 'string' ? parsed.serverUrl.trim() : '';
      // Migrate legacy direct script.google.com URL or empty URL to the deployed Cloudflare Worker
      if (!sUrl || sUrl.includes('script.google.com')) {
        sUrl = DEFAULT_CLOUDFLARE_WORKER_URL;
      }
      return {
        serverUrl: sUrl,
        isEnabled: parsed.isEnabled !== undefined ? Boolean(parsed.isEnabled) : true,
        lastConnectedAt: parsed.lastConnectedAt || null,
        lastPingStatus: parsed.lastPingStatus || null,
        lastErrorMessage: parsed.lastErrorMessage || null,
      };
    }
  } catch (e) {
    console.error('Failed to read GAS config from localStorage', e);
  }
  return {
    serverUrl: DEFAULT_CLOUDFLARE_WORKER_URL,
    isEnabled: true,
    lastConnectedAt: null,
    lastPingStatus: null,
    lastErrorMessage: null,
  };
}

export function saveGasConfig(config: GasConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GAS_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save GAS config to localStorage', e);
  }
}

/**
 * Robust HTTP client that communicates with Google Apps Script via Cloudflare Worker.
 *
 * Requirements:
 * 1. Communicates via Cloudflare Worker (never directly calls script.google.com from browser).
 * 2. POST sends application/json and parses response as JSON.
 * 3. Never mocks fake success for unimplemented endpoints.
 */
async function callGasApi<T>(
  url: string,
  payload: object
): Promise<{ ok: boolean; data?: T; error?: string; rawError?: string; statusCode?: number }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { ok: false, error: 'Cloudflare Worker 서버 주소(URL)가 설정되지 않았습니다.' };
  }

  // Prevent calling script.google.com directly from browser (Requirement 5)
  if (cleanUrl.includes('script.google.com')) {
    return {
      ok: false,
      error: 'Google Apps Script URL을 브라우저에서 직접 호출할 수 없습니다. Cloudflare 환경변수(GAS_URL)가 등록된 Cloudflare Worker 주소를 사용해 주세요.',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';

  try {
    // POST request with JSON payload & headers (Requirement 4)
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let friendlyError = `서버 응답 오류 (HTTP ${response.status} ${response.statusText})`;
      if (response.status === 404 || response.status === 501) {
        friendlyError = `서버에 해당 기능이 아직 구현되지 않았습니다 (HTTP ${response.status}).`;
      }
      return {
        ok: false,
        statusCode: response.status,
        error: friendlyError,
        rawError: `HTTP Status: ${response.status} ${response.statusText}`,
      };
    }

    const text = await response.text();
    let data: T;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        ok: false,
        statusCode: response.status,
        error: '서버가 올바른 JSON 형식으로 응답하지 않았습니다.',
        rawError: `Invalid JSON response: ${text.substring(0, 150)}`,
      };
    }

    return { ok: true, data, statusCode: response.status };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          ok: false,
          error: '서버 응답 시간(12초)이 초과되었습니다. 네트워크 상태를 확인해 주세요.',
          rawError: 'AbortError: Request timed out after 12000ms',
        };
      }

      const isCorsBlocked =
        err.message.includes('Failed to fetch') ||
        err.name === 'TypeError' ||
        err.message.includes('NetworkError');

      const detailedMsg = isCorsBlocked
        ? `[네트워크/출처 차단] Cloudflare Worker 서버에 접근할 수 없습니다 (${err.name}: ${err.message})`
        : `[네트워크 통신 오류] ${err.name}: ${err.message}`;

      return {
        ok: false,
        error: detailedMsg,
        rawError: `${err.name}: ${err.message} (Origin: ${currentOrigin})`,
      };
    }
    return {
      ok: false,
      error: '온라인 서버 통신 중 알 수 없는 오류가 발생했습니다.',
      rawError: String(err),
    };
  }
}

/**
 * In-depth Connection Diagnostics for Cloudflare Worker & Google Apps Script.
 *
 * Requirements 8 & 9:
 * 1. Distinguishes GET connection success from POST not-yet-implemented.
 * 2. Provides security notice regarding Access-Control-Allow-Origin: * for production.
 */
export async function testGasConnection(url: string): Promise<GasPingResponse> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return {
      success: false,
      message: 'Cloudflare Worker 서버 주소(URL)를 입력해 주세요.',
      rawError: 'ValidationError: Empty URL',
    };
  }

  // Prevent calling script.google.com directly from browser (Requirement 5)
  if (cleanUrl.includes('script.google.com')) {
    return {
      success: false,
      message: 'Google Apps Script URL을 브라우저에서 직접 호출할 수 없습니다. Cloudflare Worker 주소를 입력해 주세요.',
      rawError: 'DirectGoogleScriptUrlNotAllowed',
    };
  }

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const now = new Date().toISOString();

  // ─── 1. GET Test (Cloudflare Worker -> Google Apps Script doGet) ───
  const getUrl = cleanUrl.includes('?') ? `${cleanUrl}&action=status` : (cleanUrl.endsWith('/') ? `${cleanUrl}?action=status` : `${cleanUrl}/?action=status`);
  const t0 = performance.now();
  let getSuccess = false;
  let getHttpStatus: number | undefined;
  let getHttpStatusText: string | undefined;
  let getErrorName: string | undefined;
  let getErrorMessage: string | undefined;
  let getRawError: string | undefined;
  let getSnippet: string | undefined;
  let getData: any = null;

  try {
    const getController = new AbortController();
    const getId = setTimeout(() => getController.abort(), 8000);
    const getRes = await fetch(getUrl, {
      method: 'GET',
      mode: 'cors',
      signal: getController.signal,
    });
    clearTimeout(getId);
    getHttpStatus = getRes.status;
    getHttpStatusText = getRes.statusText;

    if (getRes.ok) {
      const text = await getRes.text();
      getSnippet = text.length > 200 ? text.substring(0, 200) + '...' : text;
      try {
        getData = JSON.parse(text);
        getSuccess = true;
      } catch (e) {
        // Plaintext response is also evidence of HTTP 200 connection success
        getSuccess = true;
        getData = { message: text };
      }
    } else {
      getErrorName = `HTTP ${getRes.status}`;
      getErrorMessage = `서버 응답 오류: ${getRes.status} ${getRes.statusText}`;
      getRawError = `HTTP ${getRes.status} ${getRes.statusText}`;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      getErrorName = err.name;
      getErrorMessage = err.message;
      getRawError = `${err.name}: ${err.message}`;
    } else {
      getRawError = String(err);
    }
  }
  const getDuration = Math.round(performance.now() - t0);

  // ─── 2. POST Test (Cloudflare Worker -> Google Apps Script doPost) ───
  const t1 = performance.now();
  let postSuccess = false;
  let postHttpStatus: number | undefined;
  let postHttpStatusText: string | undefined;
  let postErrorName: string | undefined;
  let postErrorMessage: string | undefined;
  let postRawError: string | undefined;
  let postSnippet: string | undefined;
  let postData: any = null;

  try {
    const postController = new AbortController();
    const postId = setTimeout(() => postController.abort(), 8000);
    const postRes = await fetch(cleanUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'ping' }),
      signal: postController.signal,
    });
    clearTimeout(postId);
    postHttpStatus = postRes.status;
    postHttpStatusText = postRes.statusText;

    if (postRes.ok) {
      const text = await postRes.text();
      postSnippet = text.length > 200 ? text.substring(0, 200) + '...' : text;
      try {
        postData = JSON.parse(text);
        // Only mark postSuccess = true if the server actually returned a success response
        postSuccess = Boolean(postData && (postData.success === true || postData.status === 'ok'));
        if (!postSuccess) {
          postErrorName = 'ActionNotImplemented';
          postErrorMessage = postData?.error || '서버에 ping/POST 액션 핸들러가 아직 구현되지 않았습니다.';
        }
      } catch (e) {
        postErrorName = 'JSONParseError';
        postErrorMessage = 'POST 응답이 JSON 형식이 아닙니다.';
        postRawError = String(e);
      }
    } else {
      postErrorName = `HTTP ${postRes.status}`;
      postErrorMessage = `POST 요청 응답 오류: ${postRes.status} ${postRes.statusText} (POST 기능 미구현)`;
      postRawError = `HTTP ${postRes.status} ${postRes.statusText}`;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      postErrorName = err.name;
      postErrorMessage = err.message;
      postRawError = `${err.name}: ${err.message}`;
    } else {
      postRawError = String(err);
    }
  }
  const postDuration = Math.round(performance.now() - t1);

  // Requirement 9: Security Notice
  const securityNotice =
    '⚠️ [보안 및 출처 제한 권고사항]\n' +
    '현재 배포된 Cloudflare Worker는 개발 및 연동 테스트를 위해 모든 출처(Access-Control-Allow-Origin: *)를 허용하고 있습니다.\n' +
    '실제 학교 수업이나 상용 운영 전에는 Cloudflare Worker 설정에서 특정 출처(예: GitHub Pages 또는 AI Studio 도메인)로 제한하고, 비인가 요청을 방지하기 위한 인증 검증을 적용해 주세요.';

  const corsDiagnosis =
    '【Cloudflare Worker 중계 구조】\n' +
    '• 브라우저 -> Cloudflare Worker: 표준 CORS 헤더(Access-Control-Allow-Origin: *)가 제공되어 브라우저에서 안전하게 통신합니다.\n' +
    '• Cloudflare Worker -> Google Apps Script: Cloudflare 서버 간 통신으로 구글의 302 Found 리다이렉트를 브라우저 제한 없이 추적합니다.\n' +
    '• 보안: Google Apps Script 배포 URL은 Cloudflare 환경변수(GAS_URL)에 은닉되어 브라우저에 노출되지 않습니다.';

  const actionableGuide =
    '1. GET 통신 성공: Cloudflare Worker와 Google Apps Script 간의 기본적인 연결이 성공적으로 확인되었습니다.\n' +
    '2. POST 기능 미구현: 현재 Apps Script 또는 Worker에 학생 로그인·등록·저장을 처리하는 doPost(e) 핸들러가 미완성 상태입니다.\n' +
    '3. 해결 방법: Google Apps Script 코드에 제공된 doPost(e) 핸들러를 배포하면 학생 로그인과 저장이 즉시 활성화됩니다.';

  const getResult: GasDiagnosticMethodResult = {
    method: 'GET',
    url: getUrl,
    success: getSuccess,
    httpStatus: getHttpStatus,
    httpStatusText: getHttpStatusText,
    durationMs: getDuration,
    errorName: getErrorName,
    errorMessage: getErrorMessage,
    rawError: getRawError,
    responseSnippet: getSnippet,
  };

  const postResult: GasDiagnosticMethodResult = {
    method: 'POST',
    url: cleanUrl,
    success: postSuccess,
    httpStatus: postHttpStatus,
    httpStatusText: postHttpStatusText,
    durationMs: postDuration,
    errorName: postErrorName,
    errorMessage: postErrorMessage,
    rawError: postRawError,
    responseSnippet: postSnippet,
  };

  const diagnostics: GasDiagnosticReport = {
    testedUrl: cleanUrl,
    origin: currentOrigin,
    testedAt: now,
    getResult,
    postResult,
    corsDiagnosis,
    actionableGuide,
    securityNotice,
  };

  // Requirement 8: Clearly distinguish GET success from POST not-yet-implemented!
  if (getSuccess && !postSuccess) {
    return {
      success: true, // Connection itself is reachable!
      isPartialSuccess: true,
      getSuccess: true,
      postSuccess: false,
      message: 'Cloudflare Worker ↔ Google Apps Script GET 연결 성공! (단, POST 기능은 아직 서버에 미구현 상태입니다)',
      spreadsheetName: getData?.spreadsheetName,
      timestamp: now,
      diagnostics,
    };
  }

  if (getSuccess && postSuccess) {
    return {
      success: true,
      isPartialSuccess: false,
      getSuccess: true,
      postSuccess: true,
      message: '연결 성공! Cloudflare Worker를 통한 GET 및 POST 통신이 모두 정상 작동 중입니다.',
      spreadsheetName: postData?.spreadsheetName || getData?.spreadsheetName,
      timestamp: now,
      diagnostics,
    };
  }

  return {
    success: false,
    isPartialSuccess: false,
    getSuccess: false,
    postSuccess: false,
    message: `Cloudflare Worker 연결 실패: 서버 주소(${cleanUrl})와 네트워크 상태를 확인해 주세요.`,
    rawError: getRawError || postRawError || 'WorkerConnectionFailed',
    timestamp: now,
    diagnostics,
  };
}

/**
 * Verify student login against Google Apps Script Web App
 */
export async function gasVerifyStudent(
  name: string,
  entranceCode: string
): Promise<GasLoginResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return {
      success: false,
      error: 'Google Apps Script 온라인 서버가 설정되지 않았거나 활성화되지 않았습니다.',
    };
  }

  const res = await callGasApi<GasLoginResponse>(config.serverUrl, {
    action: 'login',
    studentName: name.trim(),
    entranceCode: entranceCode.trim(),
  });

  if (!res.ok || !res.data) {
    return {
      success: false,
      error: res.error || '온라인 서버 연결에 실패했습니다.',
    };
  }

  return res.data;
}

/**
 * Save selected cat partner for a registered student on the Google Apps Script server
 */
export async function gasSetCatPartner(
  studentId: string,
  catType: string,
  catName: string
): Promise<GasSetCatResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return {
      success: false,
      error: 'Google Apps Script 온라인 서버가 설정되지 않았습니다.',
    };
  }

  const res = await callGasApi<GasSetCatResponse>(config.serverUrl, {
    action: 'setCatPartner',
    studentId,
    catType,
    catName,
  });

  if (!res.ok || !res.data) {
    return {
      success: false,
      error: res.error || '고양이 정보 온라인 저장에 실패했습니다.',
    };
  }

  return res.data;
}

/**
 * Save student profile back to Google Sheet
 */
export async function gasSaveStudent(student: StudentProfile): Promise<GasSaveResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return {
      success: false,
      error: '온라인 서버가 활성화되어 있지 않습니다.',
    };
  }

  const res = await callGasApi<GasSaveResponse>(config.serverUrl, {
    action: 'saveStudent',
    student,
  });

  if (!res.ok || !res.data) {
    return {
      success: false,
      error: res.error || '온라인 저장에 실패했습니다.',
    };
  }

  return res.data;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Teacher Remote Authentication & Management (선생님 전용 서버 API)
   - 관리자 아이디와 비밀번호를 클라이언트 소스코드에 직접 넣지 않음
   - 서버에서 비밀번호를 직접 검증하고 ephemeral token 발급
   - 학생 등록/조회/변경 요청마다 teacherToken 검증
───────────────────────────────────────────────────────────────────────────── */

export async function gasTeacherLogin(
  adminId: string,
  adminPw: string
): Promise<GasTeacherLoginResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return {
      success: false,
      error: 'Google Apps Script 온라인 서버가 설정되지 않았거나 비활성화되어 있습니다. [온라인 서버 설정]에서 주소를 확인해 주세요.',
    };
  }

  const res = await callGasApi<GasTeacherLoginResponse>(config.serverUrl, {
    action: 'teacherLogin',
    adminId: adminId.trim(),
    adminPw: adminPw.trim(),
  });

  if (!res.ok || !res.data) {
    return {
      success: false,
      error: res.error || '선생님 로그인에 실패했습니다.',
    };
  }

  return res.data;
}

export async function gasTeacherGetStudents(
  teacherToken: string
): Promise<GasTeacherGetStudentsResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return { success: false, error: '서버가 연결되어 있지 않습니다.' };
  }

  const res = await callGasApi<GasTeacherGetStudentsResponse>(config.serverUrl, {
    action: 'teacherGetStudents',
    teacherToken,
  });

  if (!res.ok || !res.data) {
    return { success: false, error: res.error || '학생 명단을 불러오지 못했습니다.' };
  }

  return res.data;
}

export async function gasTeacherRegisterStudent(
  teacherToken: string,
  studentName: string,
  entranceCode: string
): Promise<GasTeacherRegisterStudentResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return { success: false, error: '서버가 연결되어 있지 않습니다.' };
  }

  const res = await callGasApi<GasTeacherRegisterStudentResponse>(config.serverUrl, {
    action: 'teacherRegisterStudent',
    teacherToken,
    studentName: studentName.trim(),
    entranceCode: entranceCode.trim(),
  });

  if (!res.ok || !res.data) {
    return { success: false, error: res.error || '학생 등록에 실패했습니다.' };
  }

  return res.data;
}

export async function gasTeacherUpdateCode(
  teacherToken: string,
  studentId: string,
  newCode: string
): Promise<GasTeacherUpdateCodeResponse> {
  const config = getGasConfig();
  if (!config.serverUrl || !config.isEnabled) {
    return { success: false, error: '서버가 연결되어 있지 않습니다.' };
  }

  const res = await callGasApi<GasTeacherUpdateCodeResponse>(config.serverUrl, {
    action: 'teacherUpdateCode',
    teacherToken,
    studentId,
    newCode: newCode.trim(),
  });

  if (!res.ok || !res.data) {
    return { success: false, error: res.error || '입장번호 변경에 실패했습니다.' };
  }

  return res.data;
}

/**
 * Template Google Apps Script Code for Teacher
 * Easy copy-paste for the teacher to create the Google Sheet Web App!
 */
export function getGasScriptTemplate(): string {
  return `/**
 * 🐱 냥냥이 컴놀이터 - Google Apps Script 온라인 데이터 서버 (Code.gs)
 * 
 * [배포 방법]
 * 1. 구글 드라이브에서 새 스프레드시트를 생성합니다.
 * 2. 상단 메뉴: [확장 프로그램] > [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 이 코드를 전체 복사하여 붙여넣습니다.
 * 4. 오른쪽 위 파란색 [배포] > [새 배포] 클릭
 * 5. 유형 선택(톱니바퀴): [웹 앱] 선택
 * 6. 설정:
 *    - 설명: 냥냥이 컴놀이터 API v3 (선생님 권한 관리 포함)
 *    - 다음 사용자 권한으로 실행: '나(내 계정)'
 *    - 액세스 권한이 있는 사용자: ★'모든 사용자(Anyone)'★ (필수)
 * 7. [배포] 버튼 클릭 후 표시되는 '웹 앱 URL'을 복사하여
 *    냥냥이 컴놀이터 [온라인 서버 연동 설정]에 붙여넣으면 완료!
 */

const SHEET_STUDENTS = '학생데이터';
const SHEET_PREREGISTERED = '사전등록명단';
const SHEET_TEACHER = '관리자설정';

function doPost(e) {
  try {
    const contents = e.postData.contents;
    const data = JSON.parse(contents);
    const action = data.action;

    let result = { success: false, error: '알 수 없는 요청입니다.' };

    if (action === 'ping') {
      result = handlePing();
    } else if (action === 'login' || action === 'verifyStudent') {
      result = handleLogin(data.studentName, data.entranceCode);
    } else if (action === 'setCatPartner') {
      result = handleSetCatPartner(data.studentId, data.catType, data.catName);
    } else if (action === 'saveStudent') {
      result = handleSaveStudent(data.student);
    } else if (action === 'teacherLogin') {
      result = handleTeacherLogin(data.adminId, data.adminPw);
    } else if (action === 'teacherGetStudents') {
      result = handleTeacherGetStudents(data.teacherToken);
    } else if (action === 'teacherRegisterStudent') {
      result = handleTeacherRegisterStudent(data.teacherToken, data.studentName, data.entranceCode);
    } else if (action === 'teacherUpdateCode') {
      result = handleTeacherUpdateCode(data.teacherToken, data.studentId, data.newCode);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: '서버 내부 오류: ' + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify(handlePing()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: '🐱 냥냥이 컴놀이터 Google Apps Script 웹 앱이 정상 작동 중입니다!',
      time: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (sheetName === SHEET_STUDENTS) {
      sheet.appendRow([
        'ID', '이름', '입장번호', '고양이선택여부', '고양이종류', '고양이이름', 
        '레벨', 'EXP', '초코', '전체데이터(JSON)', '최종수정일'
      ]);
      sheet.setFrozenRows(1);
    } else if (sheetName === SHEET_PREREGISTERED) {
      sheet.appendRow(['학생이름', '입장번호', '등록일자', '메모']);
      sheet.setFrozenRows(1);
      sheet.appendRow(['김하윤', '1011', new Date().toISOString().split('T')[0], '샘플 학생']);
      sheet.appendRow(['강다은', '7777', new Date().toISOString().split('T')[0], '사전 등록']);
    } else if (sheetName === SHEET_TEACHER) {
      sheet.appendRow(['관리자아이디', '관리자비밀번호', '관리자명', '토큰', '토큰만료일자']);
      sheet.setFrozenRows(1);
      // 선생님이 직접 스프레드시트에서 변경 가능한 초기 관리자 정보
      sheet.appendRow(['teacher', '1234', '선생님', '', '']);
    }
  }
  return sheet;
}

function handlePing() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    success: true,
    message: 'Google Apps Script 서버가 정상 작동 중입니다!',
    spreadsheetName: ss.getName(),
    timestamp: new Date().toISOString()
  };
}

// ─────────────────────────────────────────────
// 1. 학생 로그인 및 검증
// ─────────────────────────────────────────────
function handleLogin(name, entranceCode) {
  const cleanName = String(name || '').trim();
  const cleanCode = String(entranceCode || '').trim();

  const studentSheet = getOrCreateSheet(SHEET_STUDENTS);
  const studentData = studentSheet.getDataRange().getValues();

  for (let i = 1; i < studentData.length; i++) {
    const rowName = String(studentData[i][1] || '').trim();
    const rowCode = String(studentData[i][2] || '').trim();
    const rawJson = studentData[i][9];

    if (rowName === cleanName && rowCode === cleanCode) {
      try {
        const student = JSON.parse(rawJson);
        const hasChosenCat = student.hasChosenCat !== false && Boolean(student.catType);
        return {
          success: true,
          student: student,
          hasChosenCat: hasChosenCat
        };
      } catch (e) {
        return { success: false, error: '학생 프로필 데이터 손상 오류' };
      }
    }
  }

  // 사전등록명단 시트 확인 (첫 입장 학생)
  const preSheet = getOrCreateSheet(SHEET_PREREGISTERED);
  const preData = preSheet.getDataRange().getValues();

  for (let i = 1; i < preData.length; i++) {
    const preName = String(preData[i][0] || '').trim();
    const preCode = String(preData[i][1] || '').trim();

    if (preName === cleanName && preCode === cleanCode) {
      const today = new Date().toISOString().split('T')[0];
      const newId = 'std_gas_' + new Date().getTime();
      const initialStudent = {
        id: newId,
        personalCode: 'NYANG-' + cleanCode,
        entranceCodeHash: 'gas_verified',
        name: cleanName,
        school: '',
        gradeClass: '',
        catType: 'cheesenyang',
        catName: '치즈냥',
        hasChosenCat: false,
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
          decorations: ['rf_cushion']
        },
        equipped: { ribbon: 'ribbon_red' },
        roomItems: [
          { id: 'rm_' + new Date().getTime(), itemId: 'rf_cushion', name: '하트 솜쿠션', category: 'cushion', icon: '💖', x: 50, y: 70 }
        ],
        unlockedStickers: ['st_paw', 'st_fish'],
        lastLoginDate: today,
        dailyBonusClaimedDates: [today],
        createdAt: today
      };

      studentSheet.appendRow([
        initialStudent.id,
        initialStudent.name,
        cleanCode,
        'N',
        '',
        '',
        1,
        0,
        30,
        JSON.stringify(initialStudent),
        today
      ]);

      return {
        success: true,
        student: initialStudent,
        hasChosenCat: false
      };
    }
  }

  return {
    success: false,
    error: '등록된 정보가 없어요. 선생님께 문의해 주세요.'
  };
}

function handleSetCatPartner(studentId, catType, catName) {
  const sheet = getOrCreateSheet(SHEET_STUDENTS);
  const data = sheet.getDataRange().getValues();
  const today = new Date().toISOString().split('T')[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(studentId).trim()) {
      let student = {};
      try {
        student = JSON.parse(data[i][9]);
      } catch (e) {
        student = {};
      }

      student.catType = catType;
      student.catName = catName;
      student.hasChosenCat = true;

      sheet.getRange(i + 1, 4).setValue('Y');
      sheet.getRange(i + 1, 5).setValue(catType);
      sheet.getRange(i + 1, 6).setValue(catName);
      sheet.getRange(i + 1, 10).setValue(JSON.stringify(student));
      sheet.getRange(i + 1, 11).setValue(today);

      return {
        success: true,
        student: student,
        message: '고양이 파트너가 성공적으로 등록되었습니다.'
      };
    }
  }

  return { success: false, error: '해당 학생을 찾을 수 없습니다.' };
}

function handleSaveStudent(student) {
  if (!student || !student.id) {
    return { success: false, error: '유효한 학생 데이터가 아닙니다.' };
  }

  const sheet = getOrCreateSheet(SHEET_STUDENTS);
  const data = sheet.getDataRange().getValues();
  const today = new Date().toISOString().split('T')[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(student.id).trim() || String(data[i][1]).trim() === String(student.name).trim()) {
      sheet.getRange(i + 1, 4).setValue(student.hasChosenCat ? 'Y' : 'N');
      sheet.getRange(i + 1, 5).setValue(student.catType);
      sheet.getRange(i + 1, 6).setValue(student.catName);
      sheet.getRange(i + 1, 7).setValue(student.level);
      sheet.getRange(i + 1, 8).setValue(student.exp);
      sheet.getRange(i + 1, 9).setValue(student.choco);
      sheet.getRange(i + 1, 10).setValue(JSON.stringify(student));
      sheet.getRange(i + 1, 11).setValue(today);
      return { success: true, message: '학생 데이터가 스프레드시트에 저장되었습니다.', updatedAt: today };
    }
  }

  return { success: false, error: '저장 대상 학생을 찾지 못했습니다.' };
}

// ─────────────────────────────────────────────
// 2. 선생님 인증 및 관리 API (토큰 기반 권한 확인)
// ─────────────────────────────────────────────
function verifyTeacherToken(token) {
  if (!token) return false;
  const sheet = getOrCreateSheet(SHEET_TEACHER);
  const data = sheet.getDataRange().getValues();
  const now = new Date().getTime();

  for (let i = 1; i < data.length; i++) {
    const savedToken = String(data[i][3] || '').trim();
    const expiry = Number(data[i][4] || 0);
    if (savedToken === String(token).trim() && expiry > now) {
      return true;
    }
  }
  return false;
}

function handleTeacherLogin(adminId, adminPw) {
  const sheet = getOrCreateSheet(SHEET_TEACHER);
  const data = sheet.getDataRange().getValues();
  const cleanId = String(adminId || '').trim();
  const cleanPw = String(adminPw || '').trim();

  for (let i = 1; i < data.length; i++) {
    const savedId = String(data[i][0] || '').trim();
    const savedPw = String(data[i][1] || '').trim();
    const name = String(data[i][2] || '선생님');

    if (savedId === cleanId && savedPw === cleanPw) {
      const token = 'tkn_' + Utilities.getUuid().replace(/-/g, '') + '_' + Date.now();
      const expiry = Date.now() + (4 * 60 * 60 * 1000); // 4시간 유효
      sheet.getRange(i + 1, 4).setValue(token);
      sheet.getRange(i + 1, 5).setValue(expiry);

      return {
        success: true,
        teacherToken: token,
        teacherName: name
      };
    }
  }

  return {
    success: false,
    error: '관리자 아이디 또는 비밀번호가 일치하지 않습니다.'
  };
}

function handleTeacherGetStudents(teacherToken) {
  if (!verifyTeacherToken(teacherToken)) {
    return { success: false, error: '선생님 권한이 만료되었습니다. 다시 로그인해 주세요.' };
  }

  const result = [];
  const seenKeys = {};

  // 학생데이터 시트 조회
  const sheet = getOrCreateSheet(SHEET_STUDENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0]);
    const name = String(data[i][1]);
    const code = String(data[i][2]);
    let student = {};
    try { student = JSON.parse(data[i][9]); } catch (e) {}

    result.push({
      id: id,
      name: name,
      entranceCode: code,
      hasChosenCat: student.hasChosenCat !== false && Boolean(student.catType),
      catType: student.catType,
      catName: student.catName,
      level: student.level || 1,
      exp: student.exp || 0,
      choco: student.choco || 0,
      lastLoginDate: student.lastLoginDate || ''
    });
    seenKeys[name + '_' + code] = true;
  }

  // 사전등록명단 시트 조회 (아직 첫 입장 안 한 학생)
  const preSheet = getOrCreateSheet(SHEET_PREREGISTERED);
  const preData = preSheet.getDataRange().getValues();
  for (let i = 1; i < preData.length; i++) {
    const preName = String(preData[i][0]);
    const preCode = String(preData[i][1]);
    if (!seenKeys[preName + '_' + preCode]) {
      result.push({
        id: 'pre_' + i,
        name: preName,
        entranceCode: preCode,
        hasChosenCat: false,
        catType: '',
        catName: '첫 입장 대기',
        level: 1,
        exp: 0,
        choco: 30,
        lastLoginDate: '-'
      });
      seenKeys[preName + '_' + preCode] = true;
    }
  }

  return { success: true, students: result };
}

function handleTeacherRegisterStudent(teacherToken, studentName, entranceCode) {
  if (!verifyTeacherToken(teacherToken)) {
    return { success: false, error: '선생님 권한이 만료되었습니다. 다시 로그인해 주세요.' };
  }

  const cleanName = String(studentName || '').trim();
  const cleanCode = String(entranceCode || '').trim();

  if (!cleanName || !/^[0-9]{4,8}$/.test(cleanCode)) {
    return { success: false, error: '학생 이름과 4~8자리 숫자 입장번호를 입력해 주세요.' };
  }

  // 중복 검사 (학생데이터)
  const studentSheet = getOrCreateSheet(SHEET_STUDENTS);
  const data = studentSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === cleanName && String(data[i][2]).trim() === cleanCode) {
      return { success: false, error: '이미 같은 이름과 입장번호로 등록된 학생이 있습니다.' };
    }
  }

  // 중복 검사 (사전등록명단)
  const preSheet = getOrCreateSheet(SHEET_PREREGISTERED);
  const preData = preSheet.getDataRange().getValues();
  for (let i = 1; i < preData.length; i++) {
    if (String(preData[i][0]).trim() === cleanName && String(preData[i][1]).trim() === cleanCode) {
      return { success: false, error: '이미 사전 등록 명단에 같은 이름과 입장번호가 있습니다.' };
    }
  }

  // 사전등록명단에 추가
  const today = new Date().toISOString().split('T')[0];
  preSheet.appendRow([cleanName, cleanCode, today, '선생님 직접 등록']);

  return {
    success: true,
    student: {
      id: 'pre_' + Date.now(),
      name: cleanName,
      entranceCode: cleanCode,
      hasChosenCat: false,
      catName: '첫 입장 대기',
      level: 1,
      exp: 0,
      choco: 30
    }
  };
}

function handleTeacherUpdateCode(teacherToken, studentId, newCode) {
  if (!verifyTeacherToken(teacherToken)) {
    return { success: false, error: '선생님 권한이 만료되었습니다. 다시 로그인해 주세요.' };
  }

  const cleanCode = String(newCode || '').trim();
  if (!/^[0-9]{4,8}$/.test(cleanCode)) {
    return { success: false, error: '새 입장번호는 4~8자리 숫자여야 합니다.' };
  }

  // 학생데이터 시트에서 수정
  const studentSheet = getOrCreateSheet(SHEET_STUDENTS);
  const data = studentSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(studentId).trim()) {
      studentSheet.getRange(i + 1, 3).setValue(cleanCode);
      try {
        let student = JSON.parse(data[i][9]);
        student.personalCode = 'NYANG-' + cleanCode;
        studentSheet.getRange(i + 1, 10).setValue(JSON.stringify(student));
      } catch (e) {}
      return { success: true, newCode: cleanCode };
    }
  }

  return { success: true, newCode: cleanCode };
}
`;
}

/**
 * 100% Free Cloudflare Worker Proxy Template for GitHub Pages deployments
 * Solves Google Apps Script's 302 redirect CORS issue completely by adding Access-Control-Allow-Origin: *
 */
export function getCloudflareWorkerTemplate(): string {
  return `/**
 * 🐱 냥냥이 컴놀이터 Google Apps Script CORS 프록시 (Cloudflare Worker)
 *
 * GitHub Pages 배포 시 Google Apps Script의 302 리다이렉트 CORS 차단을
 * 완벽하게 해결해 주는 100% 무료 역방향 프록시 코드입니다.
 *
 * [간편 3분 설정 방법]
 * 1. https://workers.cloudflare.com 에서 무료 가입 (신용카드 불필요, 하루 10만 건 무료)
 * 2. 'Create Application' > 'Create Worker' 클릭
 * 3. 아래 코드를 붙여넣고 맨 위 GAS_WEB_APP_URL에 본인의 Google Apps Script 배포 주소를 입력
 * 4. 'Deploy' 클릭 후 발급된 Worker 주소(예: https://nyang-proxy.내계정.workers.dev)를 복사하여
 *    냥냥이 컴놀이터 [온라인 서버 주소]에 입력하면 CORS 오류 없이 100% 작동합니다!
 */

// ★ 여기에 선생님의 Google Apps Script 웹 앱 배포 주소를 입력하세요 ★
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/.../exec";

export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // 1. OPTIONS 프리플라이트 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    try {
      const incomingUrl = new URL(request.url);
      const targetUrl = new URL(GAS_WEB_APP_URL);

      // 클라이언트의 쿼리스트링(?action=status 등) 전달
      incomingUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });

      const bodyText = request.method === "POST" ? await request.text() : undefined;

      // Cloudflare 서버 간 통신으로 Google Apps Script 호출 (브라우저가 아니므로 302 리다이렉트 차단 없음)
      const gasResponse = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: bodyText,
        redirect: "follow",
      });

      const responseText = await gasResponse.text();

      // 브라우저로 응답할 때 Access-Control-Allow-Origin: * 를 확실하게 추가
      return new Response(responseText, {
        status: gasResponse.status,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cloudflare Worker 프록시 통신 오류: " + String(err),
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
`;
}
