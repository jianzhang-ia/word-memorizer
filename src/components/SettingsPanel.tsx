import type { Language, TranslationLanguage, EnglishLevel, FinnishLevel } from '../types';

interface SettingsPanelProps {
    currentLanguage: Language;
    translationLanguage: TranslationLanguage;
    englishLevel: EnglishLevel;
    finnishLevel: FinnishLevel;
    onLanguageChange: (lang: Language) => void;
    onTranslationChange: (lang: TranslationLanguage) => void;
    onEnglishLevelChange: (level: EnglishLevel) => void;
    onFinnishLevelChange: (level: FinnishLevel) => void;
    onClose: () => void;
}

export const SettingsPanel = ({
    currentLanguage,
    translationLanguage,
    englishLevel,
    finnishLevel,
    onLanguageChange,
    onTranslationChange,
    onEnglishLevelChange,
    onFinnishLevelChange,
    onClose
}: SettingsPanelProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="glass rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">
                        SETTINGS
                    </h2>
                    <button
                        onClick={onClose}
                        className="glass-hover p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                        title="Close settings"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Language Selection */}
                <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-mono">
                        Language
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['english', 'finnish'] as Language[]).map(lang => (
                            <button
                                key={lang}
                                onClick={() => onLanguageChange(lang)}
                                className={`
                                    px-4 py-3 rounded-xl font-mono text-sm transition-all duration-300
                                    ${currentLanguage === lang
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                        : 'glass-hover text-gray-400'
                                    }
                                `}
                            >
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* English-specific settings */}
                {currentLanguage === 'english' && (
                    <>
                        {/* Translation Language */}
                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-mono">
                                Translation
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['japanese', 'chinese'] as TranslationLanguage[]).map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => onTranslationChange(lang)}
                                        className={`
                                            px-4 py-3 rounded-xl font-mono text-sm transition-all duration-300
                                            ${translationLanguage === lang
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                : 'glass-hover text-gray-400'
                                            }
                                        `}
                                    >
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* English Level */}
                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-mono">
                                Level
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['C1', 'C2'] as EnglishLevel[]).map(level => (
                                    <button
                                        key={level}
                                        onClick={() => onEnglishLevelChange(level)}
                                        className={`
                                            px-4 py-3 rounded-xl font-mono text-sm transition-all duration-300
                                            ${englishLevel === level
                                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                                : 'glass-hover text-gray-400'
                                            }
                                        `}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Finnish-specific settings */}
                {currentLanguage === 'finnish' && (
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-mono">
                            Level
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['B1', 'B2'] as FinnishLevel[]).map(level => (
                                <button
                                    key={level}
                                    onClick={() => onFinnishLevelChange(level)}
                                    className={`
                                        px-4 py-3 rounded-xl font-mono text-sm transition-all duration-300
                                        ${finnishLevel === level
                                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                            : 'glass-hover text-gray-400'
                                        }
                                    `}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="glass rounded-xl p-4 mt-6">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {currentLanguage === 'english'
                            ? `Learning ${englishLevel} English words with ${translationLanguage} translations`
                            : `Learning ${finnishLevel} Finnish words with English translations`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};
