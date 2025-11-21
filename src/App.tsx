import { useEffect, useState, useMemo, useRef } from 'react';
import { useTypewriter } from './hooks/useTypewriter';
import { useProgress } from './hooks/useProgress';
import { useLearnedWords } from './hooks/useLearnedWords';
import { useSettings } from './hooks/useSettings';
import { words } from './data/words'; // C2 English
import { c1Words } from './data/c1-words';
import { finnishB1Words } from './data/finnish-b1-words';
import { finnishB2Words } from './data/finnish-b2-words';
import { TypewriterDisplay } from './components/TypewriterDisplay';
import { Navigation } from './components/Navigation';
import { MemoryView } from './components/MemoryView';
import { SettingsPanel } from './components/SettingsPanel';
import { audioManager } from './utils/audio';
import type { ViewMode, WordData } from './types';

function App() {
  const { progress, incrementProgress, resetAll } = useProgress();
  const { learnedWords, learnedWordsCount, addLearnedWord, clearLearnedWords, getLearnedWordsSorted } = useLearnedWords();
  const { settings, updateLanguage, updateTranslationLanguage, updateEnglishLevel, updateFinnishLevel } = useSettings();
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);


  // Get words based on current language and level settings
  const wordsForLanguageAndLevel = useMemo((): WordData[] => {
    if (settings.currentLanguage === 'finnish') {
      return settings.finnishLevel === 'B1' ? finnishB1Words : finnishB2Words;
    }

    // English words
    const englishWords = settings.englishLevel === 'C1' ? c1Words : words;

    // Apply translation preference for English
    return englishWords.map(word => ({
      ...word,
      // Use Chinese translation if selected and available, otherwise fall back to Japanese
      translation: settings.translationLanguage === 'chinese' && word.translationChinese
        ? word.translationChinese
        : word.translation
    }));
  }, [settings.currentLanguage, settings.englishLevel, settings.finnishLevel, settings.translationLanguage]);

  // Memoize words based on view mode to prevent unnecessary re-renders
  const wordsForMode = useMemo((): WordData[] => {
    if (viewMode === 'review') {
      // Only show learned words in review mode
      return learnedWords.map(lw => ({
        word: lw.word,
        translation: lw.translation,
        definition: lw.definition
      }));
    }
    // Default: show language-filtered words for 'learn' mode
    return wordsForLanguageAndLevel;
  }, [viewMode, learnedWords, wordsForLanguageAndLevel]);

  const { currentWord, typedText, isError, nextWord, reset: resetGame, handleInput, handleKeyDown } = useTypewriter({
    words: wordsForMode,
    onWordComplete: (word) => {
      audioManager.playSuccessSound();
      incrementProgress();
      addLearnedWord(word); // Track learned word
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        nextWord();
      }, 800); // Short delay to show full word
    },
    onMistake: () => {
      audioManager.playErrorSound();
    }
  });


  // Wait, I need to import useRef.
  // I will use a separate edit to add imports if needed, or just assume they are there?
  // Imports are at the top. I can't see them in this chunk.
  // I'll assume I need to add useRef to imports in a separate chunk or use React.useRef if I can't see imports.
  // Actually, I viewed the file, imports are: import { useEffect, useState, useMemo } from 'react';
  // I need to add useRef.

  // Let's do the logic first.
  const [inputValue, setInputValue] = useState(' ');
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't focus if clicking a button or interactive element
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.interactive')) return;
    if (showSettings || showResetConfirm) return;
    hiddenInputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 1) {
      // Typed a character
      const char = val.slice(-1);
      handleInput(char);
    } else if (val.length < 1) {
      // Backspace
      handleInput('Backspace');
    }
    setInputValue(' ');
  };

  // Play sound on key press (detected via typedText change)
  useEffect(() => {
    if (typedText.length > 0 && !isError) {
      audioManager.playKeySound();
    }
  }, [typedText, isError]);

  // Global Keydown Handler (for desktop when input not focused)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If the target is our hidden input, ignore it (let onChange handle it)
      if (e.target === hiddenInputRef.current) return;

      // Otherwise, handle it via the hook's handler
      handleKeyDown(e);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleKeyDown]);

  // Initialize audio on first interaction (required for mobile)
  useEffect(() => {
    const initAudio = () => {
      audioManager.initialize();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);
    window.addEventListener('keydown', initAudio);

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetAll();
    clearLearnedWords();
    resetGame();
    setShowResetConfirm(false);
    audioManager.playSuccessSound(); // Feedback for reset
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleLanguageChange = (newLang: 'english' | 'finnish') => {
    if (newLang === settings.currentLanguage) return;
    setIsChangingLanguage(true);
    setTimeout(() => {
      updateLanguage(newLang);
      setIsChangingLanguage(false);
    }, 300);
  };

  const handleModeChange = (mode: ViewMode) => {
    audioManager.playModeSwitchSound();
    setViewMode(mode);
    if (mode === 'learn' || mode === 'review') {
      // Reset the game when switching to learn or review mode
      resetGame();
    }
  };

  // Show memory view when in memory mode
  if (viewMode === 'memory') {
    return (
      <div className="w-full mx-auto p-4 flex flex-col items-center justify-center min-h-[100dvh] relative overflow-y-auto z-10">
        <Navigation
          currentMode={viewMode}
          onModeChange={handleModeChange}
          learnedCount={learnedWordsCount}
        />
        <div className="w-full pt-24 md:pt-32"> {/* Added padding for fixed nav */}
          <MemoryView
            learnedWords={getLearnedWordsSorted()}
            onBack={() => setViewMode('learn')}
          />
        </div>
      </div>
    );
  }

  if (!currentWord) return <div className="text-white">Loading...</div>;

  return (
    <div
      className="w-full mx-auto p-4 flex flex-col items-center justify-center min-h-[100dvh] relative overflow-y-auto z-10"
      onClick={handleContainerClick}
    >
      {/* Hidden Input for Mobile Keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 top-0 left-0 h-0 w-0 pointer-events-none"
        value={inputValue}
        onChange={handleInputChange}
        autoFocus
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Navigation */}
      <Navigation
        currentMode={viewMode}
        onModeChange={handleModeChange}
        learnedCount={learnedWordsCount}
      />

      {/* Header / Stats - Glass Panels */}
      <div className="fixed top-20 md:top-24 left-0 right-0 flex flex-wrap justify-between items-start px-4 md:px-6 lg:px-12 z-10 animate-fade-in-up gap-2 pointer-events-none">
        {/* Left Stats */}
        <div className="flex gap-2 md:gap-3 pointer-events-auto">
          <div className="glass rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg">
            <span className="block text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-0.5 md:mb-1">Learned</span>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300">
              {progress.wordsLearned}
            </span>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-2 pointer-events-auto">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="glass-hover px-3 md:px-4 py-2 md:py-3 rounded-2xl text-gray-400 hover:text-cyan-400 
                     transition-all duration-300 text-xs font-mono tracking-wider
                     shadow-lg"
            title="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetClick}
            className="glass-hover px-3 md:px-4 py-2 md:py-3 rounded-2xl text-gray-400 hover:text-red-400 
                     transition-all duration-300 text-xs font-mono tracking-wider
                     shadow-lg"
            title="Reset all progress"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className={`
        transition-all duration-500 ease-out
        ${showSuccess ? 'animate-success-burst' : ''}
        ${isChangingLanguage ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
      `}>
        <TypewriterDisplay
          word={currentWord}
          typedText={typedText}
          isError={isError}
        />
      </div>

      {/* Footer / Instructions */}
      <div className="absolute bottom-8 text-center">
        <div className="glass rounded-full px-6 py-2 shadow-lg">
          <p className="text-gray-400 text-xs font-mono">
            {viewMode === 'review'
              ? `Reviewing ${learnedWordsCount} learned ${learnedWordsCount === 1 ? 'word' : 'words'}`
              : 'Type the word above · Correct keys only'}
          </p>
        </div>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-scale-in" />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          currentLanguage={settings.currentLanguage}
          translationLanguage={settings.translationLanguage}
          englishLevel={settings.englishLevel}
          finnishLevel={settings.finnishLevel}
          onLanguageChange={handleLanguageChange}
          onTranslationChange={updateTranslationLanguage}
          onEnglishLevelChange={updateEnglishLevel}
          onFinnishLevelChange={updateFinnishLevel}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="glass rounded-3xl p-8 max-w-md w-full shadow-2xl border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Reset Progress?</h3>
            <p className="text-gray-300 mb-8">
              This will delete all your learned words. This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelReset}
                className="px-6 py-2 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
