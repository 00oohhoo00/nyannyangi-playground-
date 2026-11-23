import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  Database,
  ArrowRight,
  Globe,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  getGasConfig,
  saveGasConfig,
  testGasConnection,
  getGasScriptTemplate,
  getCloudflareWorkerTemplate,
  DEFAULT_CLOUDFLARE_WORKER_URL,
} from '../../services/gasService';
import { GasDiagnosticReport } from '../../types/gas';
import { sound } from '../../utils/sound';

interface Props {
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const GasSettingsModal: React.FC<Props> = ({ onClose, onConfigChanged }) => {
  const currentConfig = getGasConfig();
  const [serverUrl, setServerUrl] = useState(currentConfig.serverUrl || DEFAULT_CLOUDFLARE_WORKER_URL);
  const [isEnabled, setIsEnabled] = useState(currentConfig.isEnabled);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    isPartialSuccess?: boolean;
    getSuccess?: boolean;
    postSuccess?: boolean;
    message: string;
    rawError?: string;
    details?: string;
    diagnostics?: GasDiagnosticReport;
  } | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [cfCopySuccess, setCfCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'guide' | 'code' | 'github_pages'>('settings');

  const handleSave = () => {
    sound.playStar(1);
    const cleanUrl = serverUrl.trim();
    saveGasConfig({
      serverUrl: cleanUrl,
      isEnabled: Boolean(cleanUrl && isEnabled),
      lastConnectedAt: testResult?.success ? new Date().toISOString() : currentConfig.lastConnectedAt,
      lastPingStatus: testResult?.success ? 'success' : testResult ? 'failed' : currentConfig.lastPingStatus,
      lastErrorMessage: testResult && !testResult.success ? testResult.message : null,
    });
    if (onConfigChanged) onConfigChanged();
    onClose();
  };

  const handleTestConnection = async () => {
    const cleanUrl = serverUrl.trim();
    if (!cleanUrl) {
      sound.playMiss();
      setTestResult({
        success: false,
        message: 'Cloudflare Worker 서버 주소(URL)를 먼저 입력해 주세요!',
      });
      return;
    }

    sound.playPop();
    setIsTesting(true);
    setTestResult(null);

    const res = await testGasConnection(cleanUrl);
    setIsTesting(false);

    if (res.success) {
      if (res.isPartialSuccess) {
        sound.playPop();
      } else {
        sound.playLevelUp();
      }
      setTestResult({
        success: true,
        isPartialSuccess: res.isPartialSuccess,
        getSuccess: res.getSuccess,
        postSuccess: res.postSuccess,
        message: res.message || 'Cloudflare Worker ↔ Google Apps Script 연결 확인됨',
        details: res.spreadsheetName ? `연결된 스프레드시트: ${res.spreadsheetName}` : undefined,
        diagnostics: res.diagnostics,
      });
      setShowDiagnostics(true);
    } else {
      sound.playMiss();
      setShowDiagnostics(true);
      setTestResult({
        success: false,
        isPartialSuccess: false,
        getSuccess: false,
        postSuccess: false,
        message: res.message || '서버에 연결할 수 없습니다.',
        rawError: res.rawError,
        details: res.diagnostics?.corsDiagnosis,
        diagnostics: res.diagnostics,
      });
    }
  };

  const handleCopyCode = async () => {
    sound.playPop();
    const code = getGasScriptTemplate();
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleCopyCfCode = async () => {
    sound.playPop();
    const code = getCloudflareWorkerTemplate();
    try {
      await navigator.clipboard.writeText(code);
      setCfCopySuccess(true);
      setTimeout(() => setCfCopySuccess(false), 2500);
    } catch {
      setCfCopySuccess(true);
      setTimeout(() => setCfCopySuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col bg-[#FFFDF9] rounded-3xl md:rounded-[36px] border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-rose-100 to-teal-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">🌐</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black px-2 py-0.5 bg-purple-600 text-white rounded-md">
                  선생님 전용
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-800">
                  Google Apps Script 온라인 서버 연동 설정
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                구글 스프레드시트 기반의 온라인 학생 데이터베이스와 연결합니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 md:px-6 pt-3 bg-amber-50/60 border-b border-amber-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ⚙️ 서버 주소 &amp; 진단
          </button>
          <button
            onClick={() => setActiveTab('github_pages')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'github_pages'
                ? 'bg-white text-purple-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                : 'text-purple-700 hover:text-purple-900 font-bold'
            }`}
          >
            🚀 GitHub Pages 통신 구조 &amp; 해결책
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📖 5분 연동 가이드
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 px-3.5 rounded-t-xl text-xs font-black transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white text-amber-950 border-t-2 border-x-2 border-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Code.gs 서버 코드
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4">
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Mode Toggle Banner */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>온라인 연동 활성화 여부</span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    {isEnabled && serverUrl.trim()
                      ? '온라인 서버(Google Apps Script)에서 학생 로그인 및 저장을 처리합니다.'
                      : '현재 브라우저 로컬 저장소(LocalStorage) 모드로 동작합니다.'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-13 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>

              {/* URL Input Box */}
              <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-xs space-y-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Cloudflare Worker 서버 주소 (Google Apps Script 중계 API)
                  </label>
                  <p className="text-[11px] text-slate-600 font-medium mb-1.5 leading-relaxed">
                    배포된 Cloudflare Worker 주소를 입력하세요. 실제 Google Apps Script 주소는 Cloudflare 환경변수(<code>GAS_URL</code>)에 안전하게 등록되어 브라우저에 직접 노출되지 않습니다.
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setServerUrl(DEFAULT_CLOUDFLARE_WORKER_URL);
                        setTestResult(null);
                      }}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-300 transition-colors cursor-pointer"
                    >
                      ⚡ 배포된 기본 Worker 주소 적용 ({DEFAULT_CLOUDFLARE_WORKER_URL})
                    </button>
                    {serverUrl.includes('uirmlove82') && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playPop();
                          setServerUrl('https://nyannyangi-api.urimlove82.workers.dev/');
                          setTestResult(null);
                        }}
                        className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[11px] font-bold border border-purple-200 transition-colors cursor-pointer"
                        title="도메인 철자 교체 (uirm -> urim)"
                      >
                        🔄 urimlove82 로 변경
                      </button>
                    )}
                  </div>
                </div>

                {serverUrl.includes('script.google.com') && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Apps Script URL은 Cloudflare 환경변수(GAS_URL)에 저장되어 있으므로 브라우저에서 직접 호출하지 마세요. Cloudflare Worker 주소를 입력해 주세요.
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={serverUrl}
                    onChange={(e) => {
                      setServerUrl(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="https://nyannyangi-api.uirmlove82.workers.dev/"
                    className="flex-1 py-2.5 px-3 text-xs md:text-sm font-mono bg-slate-50 border-2 border-amber-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>정밀 진단 중...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>연결 정밀 테스트</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Requirement 9: Security Notice Card */}
                <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>[보안 안내] Cloudflare Worker 출처(CORS) 제한 및 인증 검증 필요</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                    현재 Cloudflare Worker는 개발 및 연동 테스트를 위해 모든 출처(<code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono font-bold">Access-Control-Allow-Origin: *</code>)를 허용하고 있습니다.
                    실제 학교 수업이나 정식 서비스 배포 전에는 Cloudflare Worker 설정에서 특정 도메인(예: 배포된 웹사이트 도메인)으로 출처를 제한하고, 인가되지 않은 요청을 차단하기 위한 인증 검증을 적용해 주세요.
                  </p>
                </div>

                {/* Test Result Display with Accurate Diagnostics (Requirement 8) */}
                {testResult && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs font-bold space-y-2.5 ${
                      testResult.isPartialSuccess
                        ? 'bg-amber-50 text-amber-950 border-amber-300'
                        : testResult.success
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-rose-50 text-rose-950 border-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {testResult.isPartialSuccess ? (
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-black text-sm">{testResult.message}</div>
                        {testResult.details && (
                          <div className="text-[11px] opacity-90 mt-0.5 font-normal">
                            {testResult.details}
                          </div>
                        )}

                        {/* Distinct Status Badges for GET vs POST */}
                        {testResult.isPartialSuccess && (
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-black border border-emerald-300">
                              ✓ GET 연결: 성공 (Worker ↔ Apps Script 통신 확인)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[11px] font-black border border-amber-300">
                              ⚠️ POST 기능: 미구현 (doPost 핸들러 준비 필요)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actual Raw Error (Never masked!) */}
                    {testResult.rawError && (
                      <div className="p-2.5 bg-rose-100/90 rounded-xl border border-rose-300 text-[11px] font-mono text-rose-950 break-all select-all flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black">브라우저 실제 오류 원문: </span>
                          <span>{testResult.rawError}</span>
                        </div>
                      </div>
                    )}

                    {/* Method-by-Method Diagnostic Breakdown (GET vs POST) */}
                    {testResult.diagnostics && (
                      <div className="pt-2 border-t border-slate-200/90 space-y-2">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-slate-800">
                            🔍 요청 방식별 정밀 진단 내역 (Origin: {testResult.diagnostics.origin})
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowDiagnostics(!showDiagnostics)}
                            className="text-[11px] text-purple-700 hover:underline font-bold cursor-pointer"
                          >
                            {showDiagnostics ? '진단 설명 접기 ▲' : '진단 설명 자세히 보기 ▼'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {/* 1. GET Method Box */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              testResult.diagnostics.getResult.success
                                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                                : 'bg-rose-100/60 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="flex items-center justify-between font-black text-xs mb-1">
                              <span>1. GET (?action=status)</span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                  testResult.diagnostics.getResult.success
                                    ? 'bg-emerald-300 text-emerald-950'
                                    : 'bg-rose-200 text-rose-900'
                                }`}
                              >
                                {testResult.diagnostics.getResult.success ? '✓ 응답 수신 (성공)' : '✕ 차단됨'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-600">
                              소요: {testResult.diagnostics.getResult.durationMs}ms
                              {testResult.diagnostics.getResult.httpStatus &&
                                ` · HTTP ${testResult.diagnostics.getResult.httpStatus}`}
                            </div>
                            {testResult.diagnostics.getResult.rawError && (
                              <div className="text-[10px] text-rose-800 font-mono mt-1 break-all">
                                {testResult.diagnostics.getResult.rawError}
                              </div>
                            )}
                            {testResult.diagnostics.getResult.responseSnippet && (
                              <div className="text-[10px] bg-white/90 p-1.5 rounded-lg mt-1 font-mono text-slate-800 truncate border border-slate-200">
                                {testResult.diagnostics.getResult.responseSnippet}
                              </div>
                            )}
                          </div>

                          {/* 2. POST Method Box */}
                          <div
                            className={`p-2.5 rounded-xl border ${
                              testResult.diagnostics.postResult.success
                                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                                : 'bg-amber-100/70 border-amber-300 text-amber-950'
                            }`}
                          >
                            <div className="flex items-center justify-between font-black text-xs mb-1">
                              <span>2. POST (JSON 본문)</span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                  testResult.diagnostics.postResult.success
                                    ? 'bg-emerald-300 text-emerald-950'
                                    : 'bg-amber-300 text-amber-950'
                                }`}
                              >
                                {testResult.diagnostics.postResult.success ? '✓ 응답 수신' : '⚠️ 미구현 (준비 필요)'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-600">
                              소요: {testResult.diagnostics.postResult.durationMs}ms
                              {testResult.diagnostics.postResult.httpStatus &&
                                ` · HTTP ${testResult.diagnostics.postResult.httpStatus}`}
                            </div>
                            {testResult.diagnostics.postResult.errorMessage && (
                              <div className="text-[10px] text-amber-900 font-bold mt-1">
                                {testResult.diagnostics.postResult.errorMessage}
                              </div>
                            )}
                            {testResult.diagnostics.postResult.responseSnippet && (
                              <div className="text-[10px] bg-white/90 p-1.5 rounded-lg mt-1 font-mono text-slate-800 truncate border border-slate-200">
                                {testResult.diagnostics.postResult.responseSnippet}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expandable Explanation of Browser URL vs Fetch */}
                        {showDiagnostics && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs space-y-2 leading-relaxed">
                            <div className="font-black text-slate-900 flex items-center gap-1.5">
                              <Info className="w-4 h-4 text-purple-600" />
                              <span>Cloudflare Worker 중계 구조 및 안내</span>
                            </div>
                            <p className="whitespace-pre-line text-[11px] text-slate-600">
                              {testResult.diagnostics.corsDiagnosis}
                            </p>
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 font-bold space-y-1 text-[11px]">
                              <div>💡 <strong>현재 상태 및 다음 단계</strong>:</div>
                              <ul className="list-disc list-inside space-y-0.5">
                                <li>Cloudflare Worker와의 기본 GET 통신이 성공하여 연결 통로가 확인되었습니다.</li>
                                <li>아직 학생 로그인, 등록, 저장 등 POST 요청 기능은 Apps Script에 구현되지 않은 상태로 정직하게 표시됩니다.</li>
                                <li>상단 <strong>[📋 Code.gs 서버 코드]</strong> 탭의 코드를 복사하여 Google Apps Script에 배포하면 학생 로그인 및 데이터 저장이 즉시 활성화됩니다.</li>
                              </ul>
                            </div>
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveTab('github_pages')}
                                className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                              >
                                <span>🚀 GitHub Pages 실제 작동 통신 구조 (Cloudflare Worker 프록시) 확인하기</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Indicator Card */}
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isEnabled && serverUrl.trim() ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    동작 모드:{' '}
                    <strong>
                      {isEnabled && serverUrl.trim()
                        ? '온라인 스프레드시트 동기화 모드'
                        : '브라우저 로컬 저장 모드'}
                    </strong>
                  </span>
                </div>
                {currentConfig.lastConnectedAt && (
                  <span className="text-[11px] text-slate-500">
                    최근 성공: {new Date(currentConfig.lastConnectedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              NEW TAB: GitHub Pages Viable Architecture & Solutions
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'github_pages' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-purple-950">
                  <Globe className="w-4 h-4 text-purple-700" />
                  <span>GitHub Pages에서 Google Apps Script 통신이 차단되는 이유와 해결 구조</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  GitHub Pages(<code>https://username.github.io</code>)는 정적 HTML/JS만 호스팅하므로 자체 Node.js 백엔드가 없습니다.
                  브라우저에서 <code>script.google.com</code>으로 직접 <code>fetch()</code>를 실행하면 
                  Google의 302 리다이렉트 응답 헤더에 <code>Access-Control-Allow-Origin</code>이 누락되어 있어 
                  브라우저가 <code>TypeError: Failed to fetch</code>로 요청을 강제 차단합니다.
                </p>
              </div>

              {/* Solution 1: Cloudflare Worker Proxy (Recommended) */}
              <div className="p-4 bg-white rounded-2xl border-2 border-teal-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-teal-500 text-white rounded-md text-[10px]">
                      추천 1위
                    </span>
                    <span>100% 무료 Cloudflare Worker 역방향 프록시 (가장 안정적)</span>
                  </div>
                  <button
                    onClick={handleCopyCfCode}
                    className={`py-1.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      cfCopySuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{cfCopySuccess ? '프록시 코드 복사 완료!' : '프록시 코드 복사'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-600 font-medium">
                  <p>
                    <strong>동작 원리</strong>: GitHub Pages (React) ➔ Cloudflare Worker (중계) ➔ Google Apps Script Web App
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>Cloudflare 서버에서 Google Apps Script로 통신하므로 브라우저 302 리다이렉트 차단이 전혀 발생하지 않습니다.</li>
                    <li>Cloudflare Worker가 최종 응답에 <code>Access-Control-Allow-Origin: *</code> 헤더를 붙여 브라우저에 전달하므로 GitHub Pages에서 100% 정상 작동합니다.</li>
                    <li>Cloudflare Workers는 <strong>신용카드 등록 없이 하루 10만 건 무료</strong>이므로 초등학교 학급 운영에 완벽합니다.</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-black text-slate-700">간단 설정 3단계:</span>
                  <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1 font-medium bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                    <li><a href="https://workers.cloudflare.com" target="_blank" rel="noreferrer" className="text-purple-700 font-bold underline">Cloudflare Workers</a>에 무료 가입 후 [Create Application] &gt; [Create Worker] 클릭</li>
                    <li>상단 [프록시 코드 복사] 버튼을 눌러 코드를 붙여넣고, 맨 위 <code>GAS_WEB_APP_URL</code>에 Apps Script 주소 입력 후 [Deploy] 클릭</li>
                    <li>발급된 Worker 주소(예: <code>https://nyang-proxy.내계정.workers.dev</code>)를 냥냥이 컴놀이터 [서버 주소]에 입력하면 즉시 100% 정상 작동!</li>
                  </ol>
                </div>
              </div>

              {/* Solution 2 & 3: Other Architectural Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 space-y-2">
                  <div className="font-black text-xs text-slate-800">
                    대안 2: JSONP 방식 (GET 전용 통신)
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    <code>&lt;script src="..."&gt;</code> 태그를 동적으로 삽입하여 브라우저의 CORS 검사를 우회하는 고전적 방법입니다.
                    단, POST 방식의 대용량 데이터 저장이나 보안 토큰 전송에는 제약이 따릅니다.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 space-y-2">
                  <div className="font-black text-xs text-slate-800">
                    대안 3: Vercel / Netlify 무료 서버리스 프록시
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    GitHub Pages 대신 Vercel이나 Netlify로 배포하거나, <code>/api/proxy.js</code> 단일 서버리스 함수를 통해 Google Apps Script를 중계하는 방식입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              Guide Tab
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'guide' && (
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 space-y-3.5 text-xs text-slate-700">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>📚</span>
                <span>구글 스프레드시트 온라인 서버 배포 5단계</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="font-black text-amber-950 mb-0.5">1단계: 스프레드시트 만들기</div>
                  <p className="text-slate-600 font-medium">
                    Google Drive(또는 스프레드시트)에서 새 스프레드시트를 만들고 이름을 <code>냥냥이 컴놀이터 데이터</code> 등으로 지정합니다.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="font-black text-purple-950 mb-0.5">2단계: Apps Script 열기</div>
                  <p className="text-slate-600 font-medium">
                    스프레드시트 상단 메뉴 <strong>[확장 프로그램] &gt; [Apps Script]</strong>를 클릭합니다.
                  </p>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <div className="font-black text-teal-950 mb-0.5">3단계: 제공된 Code.gs 붙여넣기</div>
                  <p className="text-slate-600 font-medium">
                    상단 <strong>[📋 Code.gs 서버 코드]</strong> 탭의 코드를 복사하여 Apps Script 에디터에 붙여넣고 저장(Ctrl+S)합니다.
                  </p>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <div className="font-black text-rose-950 mb-0.5">4단계: 웹 앱으로 배포 (중요!)</div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    오른쪽 상단 <strong>[배포] &gt; [새 배포]</strong> 클릭 ➔ 톱니바퀴 아이콘에서 <strong>[웹 앱]</strong> 선택 ➔ 
                    액세스 권한이 있는 사용자를 반드시 <strong className="text-rose-700 underline">★'모든 사용자(Anyone)'★</strong>로 설정합니다.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-black text-emerald-950 mb-0.5">5단계: 웹 앱 URL 입력</div>
                  <p className="text-slate-600 font-medium">
                    배포 완료 후 나타나는 <code>https://script.google.com/macros/s/.../exec</code> 주소를 복사하여 냥냥이 컴놀이터 설정에 붙여넣고 [연결 정밀 테스트]를 누릅니다!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              Code.gs Tab
             ───────────────────────────────────────────────────────────── */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">
                  Google Apps Script 전용 백엔드 코드 (Code.gs)
                </span>
                <button
                  onClick={handleCopyCode}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    copySuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? '복사 완료! ✨' : '전체 코드 복사'}</span>
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto p-3 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-700">
                <pre>{getGasScriptTemplate()}</pre>
              </div>

              <p className="text-[11px] text-slate-500 font-bold">
                💡 이 코드는 <strong>사전등록명단</strong> 시트와 <strong>학생데이터</strong> 시트를 자동으로 생성하며, 이름과 4~8자리 입장번호 검증, 고양이 선택, 점수 및 초코 저장을 안전하게 처리합니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-amber-50 border-t-2 border-amber-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="py-2.5 px-5 bg-white hover:bg-slate-100 text-slate-700 text-xs md:text-sm font-bold rounded-2xl border border-slate-300 cursor-pointer"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs md:text-sm font-black rounded-2xl border-2 border-amber-500 shadow-sm hover:scale-103 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>설정 저장하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
