import React, { useState } from 'react';
import { X, Cloud, CloudOff, ShieldAlert, CheckCircle2, Lock, Database, Settings, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/sound';
import { getGasConfig } from '../../services/gasService';
import { GasSettingsModal } from './GasSettingsModal';

interface Props {
  onClose: () => void;
}

export const FirebaseStatusModal: React.FC<Props> = ({ onClose }) => {
  const [showGasSettings, setShowGasSettings] = useState(false);
  const gasConfig = getGasConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#FFFDF9] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-200 via-orange-100 to-rose-100 border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs">☁️</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 bg-purple-600 text-white rounded-md">
                  저장 상태 안내
                </span>
                <h2 className="text-xl font-black text-slate-800">온라인 데이터 저장 안내</h2>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                Google Apps Script 온라인 스프레드시트 연동 준비 상태를 확인합니다.
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

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 text-slate-700">
          {/* Current Mode Banner */}
          <div
            className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
              gasConfig.isEnabled && gasConfig.serverUrl
                ? 'bg-purple-50 border-purple-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            {gasConfig.isEnabled && gasConfig.serverUrl ? (
              <Cloud className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
            ) : (
              <CloudOff className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="text-sm font-black text-slate-900 mb-1 flex items-center justify-between">
                <span>
                  현재 상태:{' '}
                  {gasConfig.isEnabled && gasConfig.serverUrl
                    ? 'Google Apps Script 온라인 연동 모드'
                    : '브라우저 로컬 저장 모드'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    gasConfig.isEnabled && gasConfig.serverUrl
                      ? 'bg-purple-200 text-purple-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {gasConfig.isEnabled && gasConfig.serverUrl ? '온라인 연결 활성' : '기기 내 안전 보관'}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {gasConfig.isEnabled && gasConfig.serverUrl
                  ? '설정된 Google Apps Script Web App을 통해 학생 프로필, 입장번호 검증, 게임 점수, 초코가 구글 스프레드시트에 실시간 동기화됩니다.'
                  : '학생 기록(이름, 입장번호, 고양이, 레벨, 초코, 게임 점수, 스티커, 방 꾸미기)이 현재 접속 중인 컴퓨터의 웹 브라우저(LocalStorage)에 안전하게 자동 저장됩니다.'}
              </p>
            </div>
          </div>

          {/* GAS Architecture Checklist */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              <span>Google Apps Script 온라인 연동 구조 준비 현황</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">1. 숫자 4~8자리 입장번호 인증 체계</span>
                  <p className="text-slate-500 mt-0.5">
                    숫자 4~8자리 입장번호를 지원하며, SHA-256 단방향 암호화 및 30초 연속 실패 락아웃을 지원합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">2. 사전 등록 명단(Whitelist) 검증 및 중복 등록 방지</span>
                  <p className="text-slate-500 mt-0.5">
                    학생이 임의로 번호를 생성할 수 없으며, 선생님이 사전에 등록한 학생만 첫 고양이를 선택해 등록할 수 있습니다. 이미 등록된 학생은 중복 등록이 차단됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">3. GitHub Pages & CORS 호환 Simple POST 통신</span>
                  <p className="text-slate-500 mt-0.5">
                    브라우저 preflight OPTIONS 요청을 방지하기 위해 <code>text/plain;charset=utf-8</code> 전송 방식을 적용하여 GitHub Pages에서도 안전하게 작동합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">4. 가짜 성공 없는 엄격한 온라인 응답 검증</span>
                  <p className="text-slate-500 mt-0.5">
                    서버에 로그인/저장 API가 미구현된 상태에서 임의의 가짜 성공을 반환하지 않으며, 실제 스프레드시트 서버 응답을 확인한 경우에만 학생 기록을 불러옵니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button for GAS Settings */}
          <button
            onClick={() => {
              sound.playPop();
              setShowGasSettings(true);
            }}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Google Apps Script 웹 앱 주소 설정 및 Code.gs 복사하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showGasSettings && (
        <GasSettingsModal onClose={() => setShowGasSettings(false)} />
      )}
    </div>
  );
};
