import { useState, useEffect } from 'react';
import type { LearnedWord, WordData } from '../types';

const LEARNED_WORDS_KEY = 'word-memorizer-learned';

export const useLearnedWords = () => {
    const [learnedWords, setLearnedWords] = useState<LearnedWord[]>([]);

    // Load learned words from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(LEARNED_WORDS_KEY);
        if (saved) {
            try {
                setLearnedWords(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse learned words', e);
            }
        }
    }, []);

    // Save to localStorage whenever learned words change
    const saveLearnedWords = (words: LearnedWord[]) => {
        setLearnedWords(words);
        localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(words));
    };

    // Add a word to learned list
    const addLearnedWord = (wordData: WordData) => {
        // Check if word already exists
        const exists = learnedWords.some(w => w.word === wordData.word);
        if (!exists) {
            const newLearnedWord: LearnedWord = {
                ...wordData,
                learnedAt: Date.now()
            };
            saveLearnedWords([...learnedWords, newLearnedWord]);
        }
    };

    // Clear all learned words
    const clearLearnedWords = () => {
        saveLearnedWords([]);
    };

    // Get learned words sorted by most recent
    const getLearnedWordsSorted = () => {
        return [...learnedWords].sort((a, b) => b.learnedAt - a.learnedAt);
    };

    return {
        learnedWords,
        learnedWordsCount: learnedWords.length,
        addLearnedWord,
        clearLearnedWords,
        getLearnedWordsSorted
    };
};
