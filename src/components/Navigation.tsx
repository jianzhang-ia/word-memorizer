import type { ViewMode } from '../types';

interface NavigationProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    learnedCount: number;
}

export const Navigation = ({ currentMode, onModeChange, learnedCount }: NavigationProps) => {
    const modes: { id: ViewMode; label: string; description: string }[] = [
        { id: 'learn', label: 'LEARN', description: 'Practice all words' },
        { id: 'memory', label: 'MEMORY', description: `View learned (${learnedCount})` },
        { id: 'review', label: 'REVIEW', description: 'Practice learned only' }
    ];

    return (
        <nav className="fixed top-4 left-0 right-0 z-20 flex justify-center px-4 animate-fade-in-up">
            <div className="glass rounded-full p-1.5 shadow-2xl max-w-fit">
                <div className="flex gap-1">
                    {modes.map(mode => {
                        const isActive = currentMode === mode.id;
                        const isDisabled = mode.id !== 'learn' && learnedCount === 0;

                        return (
                            <button
                                key={mode.id}
                                onClick={() => !isDisabled && onModeChange(mode.id)}
                                disabled={isDisabled}
                                className={`
                                    relative px-4 md:px-6 py-2 md:py-2.5 rounded-full font-mono text-[10px] md:text-xs tracking-wider
                                    transition-all duration-300 
                                    ${isActive
                                        ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg'
                                        : isDisabled
                                            ? 'text-gray-600 cursor-not-allowed'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                    ${!isDisabled && !isActive ? 'hover:scale-105' : ''}
                                    ${isActive ? 'scale-105' : ''}
                                `}
                                title={mode.description}
                                style={isActive ? {
                                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                                } : {}}
                            >
                                {/* Button text */}
                                <span className="relative z-10 flex items-center gap-1.5">
                                    {mode.label}
                                    {mode.id === 'memory' && learnedCount > 0 && (
                                        <span className={`
                                            px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold
                                            ${isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-purple-500/20 text-purple-300'
                                            }
                                        `}>
                                            {learnedCount}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
