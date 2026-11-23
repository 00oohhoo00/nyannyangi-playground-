import { StudentProfile } from './index';

export interface GasConfig {
  serverUrl: string; // e.g. "https://script.google.com/macros/s/.../exec"
  isEnabled: boolean;
  lastConnectedAt?: string | null;
  lastPingStatus?: 'success' | 'failed' | null;
  lastErrorMessage?: string | null;
}

export interface PreRegisteredStudent {
  id?: string;
  name: string;
  entranceCode: string; // 4-digit numerical code pre-assigned by teacher
  preRegisteredAt: string;
  memo?: string;
  hasChosenCat?: boolean;
}

export interface GasLoginResponse {
  success: boolean;
  student?: StudentProfile;
  hasChosenCat?: boolean;
  error?: string;
  message?: string;
}

export interface GasSetCatResponse {
  success: boolean;
  student?: StudentProfile;
  error?: string;
  message?: string;
}

export interface GasTeacherLoginResponse {
  success: boolean;
  teacherToken?: string;
  teacherName?: string;
  error?: string;
}

export interface GasTeacherStudentItem {
  id: string;
  name: string;
  entranceCode: string; // 4-digit code
  hasChosenCat: boolean;
  catType?: string;
  catName?: string;
  level: number;
  exp: number;
  choco: number;
  lastLoginDate?: string;
}

export interface GasTeacherGetStudentsResponse {
  success: boolean;
  students?: GasTeacherStudentItem[];
  error?: string;
}

export interface GasTeacherRegisterStudentResponse {
  success: boolean;
  student?: GasTeacherStudentItem;
  error?: string;
}

export interface GasTeacherUpdateCodeResponse {
  success: boolean;
  error?: string;
  newCode?: string;
}

export interface GasSaveResponse {
  success: boolean;
  error?: string;
  message?: string;
  updatedAt?: string;
}

export interface GasDiagnosticMethodResult {
  method: 'GET' | 'POST';
  url: string;
  success: boolean;
  httpStatus?: number;
  httpStatusText?: string;
  durationMs: number;
  errorName?: string;
  errorMessage?: string;
  rawError?: string;
  responseSnippet?: string;
}

export interface GasDiagnosticReport {
  testedUrl: string;
  origin: string;
  testedAt: string;
  getResult: GasDiagnosticMethodResult;
  postResult: GasDiagnosticMethodResult;
  corsDiagnosis: string;
  actionableGuide: string;
  securityNotice?: string;
}

export interface GasPingResponse {
  success: boolean;
  isPartialSuccess?: boolean;
  getSuccess?: boolean;
  postSuccess?: boolean;
  message?: string;
  version?: string;
  spreadsheetName?: string;
  timestamp?: string;
  rawError?: string;
  diagnostics?: GasDiagnosticReport;
}
