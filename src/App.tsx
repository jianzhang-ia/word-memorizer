import { useEffect, useState } from 'react';
import { useTypewriter } from './hooks/useTypewriter';
import { useProgress } from './hooks/useProgress';
import { words } from './data/words';
import { TypewriterDisplay } from './components/TypewriterDisplay';
import { audioManager } from './utils/audio';

function App() {
  const { progress, incrementProgress, resetAll } = useProgress();
  const [showSuccess, setShowSuccess] = useState(false);

  const { currentWord, typedText, isError, nextWord, reset: resetGame } = useTypewriter({
    words,
    onWordComplete: () => {
      audioManager.playSuccessSound();
      incrementProgress();
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

  // Play sound on key press (detected via typedText change)
  useEffect(() => {
    if (typedText.length > 0 && !isError) {
      audioManager.playKeySound();
    }
  }, [typedText, isError]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      resetAll();
      resetGame();
    }
  };

  if (!currentWord) return <div className="text-white">Loading...</div>;

  return (
    <div className="w-full mx-auto p-4 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">

      {/* Header / Stats */}
      <div className="absolute top-8 w-full flex justify-between items-center px-8 text-gray-500 font-mono text-sm">
        <div className="flex gap-6">
          <div>
            <span className="block text-xs uppercase tracking-widest opacity-50">Learned</span>
            <span className="text-xl text-cyan-400">{progress.wordsLearned}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-widest opacity-50">Streak</span>
            <span className="text-xl text-purple-400">{progress.streak}</span>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="hover:text-red-400 transition-colors opacity-50 hover:opacity-100"
        >
          RESET
        </button>
      </div>

      {/* Main Display */}
      <div className={`transition-all duration-300 ${showSuccess ? 'scale-110 brightness-125' : ''}`}>
        <TypewriterDisplay
          word={currentWord}
          typedText={typedText}
          isError={isError}
        />
      </div>

      {/* Footer / Instructions */}
      <div className="absolute bottom-8 text-gray-600 text-xs font-mono opacity-50">
        Type the word above. Correct keys only.
      </div>

      {/* Success Overlay (Subtle) */}
      {showSuccess && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default App;
