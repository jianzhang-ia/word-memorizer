import { useState, useEffect } from 'react';

const STORAGE_KEY = 'word-memorizer-progress';

export interface ProgressData {
    wordsLearned: number;
    streak: number;
    bestStreak: number;
}

export const useProgress = () => {
    const [progress, setProgress] = useState<ProgressData>({
        wordsLearned: 0,
        streak: 0,
        bestStreak: 0
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
        const newStreak = progress.streak + 1;
        const newProgress = {
            wordsLearned: progress.wordsLearned + 1,
            streak: newStreak,
            bestStreak: Math.max(newStreak, progress.bestStreak)
        };
        saveProgress(newProgress);
    };

    const resetStreak = () => {
        saveProgress({
            ...progress,
            streak: 0
        });
    };

    const resetAll = () => {
        const initial = { wordsLearned: 0, streak: 0, bestStreak: 0 };
        saveProgress(initial);
    };

    return {
        progress,
        incrementProgress,
        resetStreak,
        resetAll
    };
};
