export interface WordData {
    word: string;
    translation: string;
    translationChinese?: string; // For English words
    definition: string;
    level?: EnglishLevel | FinnishLevel;
}

export interface LearnedWord {
    word: string;
    translation: string;
    definition: string;
    learnedAt: number; // timestamp
}

export type ViewMode = 'learn' | 'memory' | 'review';

export type EnglishLevel = 'C1' | 'C2';
export type FinnishLevel = 'B1' | 'B2';
export type Language = 'english' | 'finnish';
export type TranslationLanguage = 'japanese' | 'chinese';

export interface LanguageSettings {
    currentLanguage: Language;
    translationLanguage: TranslationLanguage; // For English mode
    englishLevel: EnglishLevel;
    finnishLevel: FinnishLevel;
}
