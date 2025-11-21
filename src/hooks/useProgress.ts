import { useState, useEffect } from 'react';

const STORAGE_KEY = 'word-memorizer-progress';

export interface ProgressData {
    wordsLearned: number;
}

export const useProgress = () => {
    const [progress, setProgress] = useState<ProgressData>({
        wordsLearned: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setProgress(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse progress', e);
            }
        }
    }, []);

    const saveProgress = (newProgress: ProgressData) => {
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    };

    const incrementProgress = () => {
        const newProgress = {
            wordsLearned: progress.wordsLearned + 1
        };
        saveProgress(newProgress);
    };



    const resetAll = () => {
        const initial = { wordsLearned: 0 };
        saveProgress(initial);
    };

    return {
        progress,
        incrementProgress,
        resetAll
    };
};
