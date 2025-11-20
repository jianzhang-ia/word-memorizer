import { useState, useEffect } from 'react';
import type { LanguageSettings, Language, TranslationLanguage, EnglishLevel, FinnishLevel } from '../types';

const SETTINGS_KEY = 'word-memorizer-settings';

const defaultSettings: LanguageSettings = {
    currentLanguage: 'english',
    translationLanguage: 'japanese',
    englishLevel: 'C2',
    finnishLevel: 'B1'
};

export const useSettings = () => {
    const [settings, setSettings] = useState<LanguageSettings>(defaultSettings);

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = (newSettings: LanguageSettings) => {
        setSettings(newSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    };

    const updateLanguage = (language: Language) => {
        saveSettings({ ...settings, currentLanguage: language });
    };

    const updateTranslationLanguage = (translationLang: TranslationLanguage) => {
        saveSettings({ ...settings, translationLanguage: translationLang });
    };

    const updateEnglishLevel = (level: EnglishLevel) => {
        saveSettings({ ...settings, englishLevel: level });
    };

    const updateFinnishLevel = (level: FinnishLevel) => {
        saveSettings({ ...settings, finnishLevel: level });
    };

    return {
        settings,
        updateLanguage,
        updateTranslationLanguage,
        updateEnglishLevel,
        updateFinnishLevel
    };
};
