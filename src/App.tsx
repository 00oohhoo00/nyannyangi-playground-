import React, { useState, useEffect } from 'react';
import { StudentProfile, GameDifficulty } from './types';
import {
  getCurrentStudent,
  updateStudentProfile,
  addGameReward,
  setCurrentStudentId,
} from './utils/storage';
import { sound } from './utils/sound';
import { TopBar } from './components/TopBar';
import { MainDashboard } from './components/MainDashboard';

// Modals
import { WelcomeModal } from './components/modals/WelcomeModal';
import { GamesDirectoryModal } from './components/modals/GamesDirectoryModal';
import { ChocoCollectModal } from './components/modals/ChocoCollectModal';
import { ChocoShopModal } from './components/modals/ChocoShopModal';
import { MyCatModal } from './components/modals/MyCatModal';
import { CatRoomModal } from './components/modals/CatRoomModal';
import { StickerBookModal } from './components/modals/StickerBookModal';
import { LearningRecordModal } from './components/modals/LearningRecordModal';
import { TeacherSimpleModal } from './components/modals/TeacherSimpleModal';
import { TeacherLoginModal } from './components/modals/TeacherLoginModal';
import { FirebaseStatusModal } from './components/modals/FirebaseStatusModal';

// Games 1 to 10
import { Game1FishCatch } from './components/games/Game1FishCatch';
import { Game2SnackFinder } from './components/games/Game2SnackFinder';
import { Game3GiftBox } from './components/games/Game3GiftBox';
import { Game4FishBasket } from './components/games/Game4FishBasket';
import { Game5PawMaze } from './components/games/Game5PawMaze';
import { Game6CatPuzzle } from './components/games/Game6CatPuzzle';
import { Game7StarCatch } from './components/games/Game7StarCatch';
import { Game8CatColoring } from './components/games/Game8CatColoring';
import { Game9ContextMenu } from './components/games/Game9ContextMenu';
import { Game10ChocoTyping } from './components/games/Game10ChocoTyping';

type ModalType =
  | 'none'
  | 'welcome'
  | 'gamesDirectory'
  | 'chocoCollect'
  | 'chocoShop'
  | 'myCat'
  | 'catRoom'
  | 'stickers'
  | 'records'
  | 'teacher'
  | 'firebaseGuide';

export default function App() {
  const initialStudent = getCurrentStudent();
  const [student, setStudent] = useState<StudentProfile | null>(initialStudent);
  const [activeModal, setActiveModal] = useState<ModalType>(initialStudent ? 'none' : 'welcome');
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>('easy');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [teacherSession, setTeacherSession] = useState<{ token: string; name: string } | null>(null);

  // Trigger Save Notification
  const notifySave = (message: string = '기록이 안전하게 저장되었습니다.') => {
    setSaveToast(`💾 ${message}`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Sync profile update
  const handleUpdateStudent = (updated: StudentProfile) => {
    updateStudentProfile(updated);
    setStudent(updated);
    notifySave('성장 기록 및 아이템이 저장되었습니다.');
  };

  // Login / Switch student
  const handleSuccessLogin = (newStudent: StudentProfile) => {
    setStudent(newStudent);
    setCurrentStudentId(newStudent.id);
    setActiveModal('none');
    notifySave(`${newStudent.name} 학생의 기록을 성공적으로 불러왔습니다.`);
  };

  const handleLogout = () => {
    setCurrentStudentId(null);
    setStudent(null);
    setActiveModal('welcome');
  };

  // Handle Game completion reward
  const handleGameComplete = (
    gameId: number,
    diff: GameDifficulty,
    score: number,
    stars: number
  ) => {
    if (!student) {
      return { earnedChoco: 0, earnedExp: 0, isFirstClear: false };
    }
    const result = addGameReward(student, gameId, diff, score, stars);
    setStudent(result.updatedStudent);
    notifySave('게임 점수와 초코 보상이 저장되었습니다.');
    if (result.leveledUp) {
      sound.playLevelUp();
    }
    return {
      earnedChoco: result.earnedChoco,
      earnedExp: result.earnedExp,
      isFirstClear: result.isFirstClear,
    };
  };

  const handleLaunchGame = (gameId: number) => {
    setActiveModal('none');
    setActiveGameId(gameId);
  };

  const handleCloseGame = () => {
    setActiveGameId(null);
  };

  return (
    <div className="min-h-screen bg-mint-grid flex flex-col antialiased text-slate-800">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        student={student}
        onOpenGames={() => setActiveModal('gamesDirectory')}
        onOpenShop={() => setActiveModal('chocoShop')}
        onOpenRoom={() => setActiveModal('catRoom')}
        onOpenStickers={() => setActiveModal('stickers')}
        onOpenRecords={() => setActiveModal('records')}
        onOpenTeacher={() => setActiveModal('teacher')}
        onOpenProfileSwitch={() => setActiveModal('welcome')}
        onOpenFirebaseGuide={() => setActiveModal('firebaseGuide')}
        onLogout={handleLogout}
      />

      {/* Save Toast Notification Bar */}
      {saveToast && (
        <div className="sticky top-14 z-30 w-full bg-teal-500 text-white font-black text-xs py-1.5 px-4 text-center shadow-sm animate-in fade-in duration-150 flex items-center justify-center gap-1.5">
          <span>{saveToast}</span>
          <span className="text-[10px] opacity-80 font-normal">(로컬 저장 완료)</span>
        </div>
      )}

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
        {student ? (
          <MainDashboard
            student={student}
            onSelectGame={handleLaunchGame}
            onOpenGames={() => setActiveModal('gamesDirectory')}
            onOpenCollect={() => setActiveModal('chocoCollect')}
            onOpenShop={() => setActiveModal('chocoShop')}
            onOpenMyCat={() => setActiveModal('myCat')}
            onOpenRoom={() => setActiveModal('catRoom')}
            onOpenStickers={() => setActiveModal('stickers')}
            onOpenRecords={() => setActiveModal('records')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md">
            <div className="text-7xl mb-4 animate-bounce">🐱</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">냥냥이 컴놀이터</h2>
            <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              친구의 이름과 입장번호를 입력하고 신나는 컴퓨터 모험을 시작해 보세요!
            </p>
            <button
              onClick={() => setActiveModal('welcome')}
              className="py-3.5 px-8 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base rounded-2xl shadow-md border-2 border-amber-500 hover:scale-105 active:scale-95 transition-all"
            >
              🔑 놀이터 입장하기 (이름 + 입장번호)
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-teal-200/80 bg-white/70 backdrop-blur-xs text-center text-xs font-bold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🐱 냥냥이 컴놀이터</span>
            <span>·</span>
            <span>초등학교 1~2학년을 위한 컴퓨터 기초 모험</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setActiveModal('firebaseGuide')}
              className="hover:text-purple-700 underline transition-colors cursor-pointer"
            >
              온라인 연동 안내 (Google Apps Script)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('teacher')}
              className="hover:text-teal-700 underline transition-colors"
            >
              선생님 관리 모드
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'welcome' && (
        <WelcomeModal
          onSuccessLogin={handleSuccessLogin}
          onClose={() => student && setActiveModal('none')}
          canClose={Boolean(student)}
        />
      )}

      {student && activeModal === 'gamesDirectory' && (
        <GamesDirectoryModal
          student={student}
          onSelectGame={handleLaunchGame}
          onClose={() => setActiveModal('none')}
        />
      )}

      {student && activeModal === 'chocoCollect' && (
        <ChocoCollectModal
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setActiveModal('none')}
          onOpenGames={() => {
            setActiveModal('gamesDirectory');
          }}
        />
      )}

      {student && activeModal === 'chocoShop' && (
        <ChocoShopModal
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setActiveModal('none')}
        />
      )}

      {student && activeModal === 'myCat' && (
        <MyCatModal
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setActiveModal('none')}
          onOpenShop={() => setActiveModal('chocoShop')}
        />
      )}

      {student && activeModal === 'catRoom' && (
        <CatRoomModal
          student={student}
          onUpdateStudent={handleUpdateStudent}
          onClose={() => setActiveModal('none')}
          onOpenShop={() => setActiveModal('chocoShop')}
        />
      )}

      {student && activeModal === 'stickers' && (
        <StickerBookModal
          student={student}
          onClose={() => setActiveModal('none')}
          onOpenShop={() => setActiveModal('chocoShop')}
        />
      )}

      {student && activeModal === 'records' && (
        <LearningRecordModal
          student={student}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'teacher' && (
        teacherSession ? (
          <TeacherSimpleModal
            teacherToken={teacherSession.token}
            teacherName={teacherSession.name}
            onLogout={() => {
              setTeacherSession(null);
              setActiveModal('welcome');
              setStudent(null);
            }}
            onClose={() => setActiveModal('none')}
          />
        ) : (
          <TeacherLoginModal
            onSuccess={(token, name) => {
              setTeacherSession({ token, name });
            }}
            onClose={() => setActiveModal('none')}
          />
        )
      )}

      {activeModal === 'firebaseGuide' && (
        <FirebaseStatusModal onClose={() => setActiveModal('none')} />
      )}

      {/* Active Game 1 to 10 Launches */}
      {student && activeGameId === 1 && (
        <Game1FishCatch
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 2 && (
        <Game2SnackFinder
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 3 && (
        <Game3GiftBox
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 4 && (
        <Game4FishBasket
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 5 && (
        <Game5PawMaze
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 6 && (
        <Game6CatPuzzle
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 7 && (
        <Game7StarCatch
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 8 && (
        <Game8CatColoring
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 9 && (
        <Game9ContextMenu
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}

      {student && activeGameId === 10 && (
        <Game10ChocoTyping
          difficulty={gameDifficulty}
          onDifficultyChange={setGameDifficulty}
          onGameComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}
    </div>
  );
}
