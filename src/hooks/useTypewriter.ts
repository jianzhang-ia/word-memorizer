import { useState, useEffect, useCallback } from 'react';
import type { WordData } from '../types';

interface UseTypewriterProps {
    words: WordData[];
    onWordComplete: (word: WordData) => void;
    onMistake: () => void;
}

export const useTypewriter = ({ words, onWordComplete, onMistake }: UseTypewriterProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [isError, setIsError] = useState(false);
    const [shuffledWords, setShuffledWords] = useState<WordData[]>([]);

    // Shuffle words on mount
    useEffect(() => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
    }, [words]);

    const currentWord = shuffledWords[currentWordIndex];

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!currentWord) return;

        const { key } = e;

        // Ignore modifier keys
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        // Handle Backspace
        if (key === 'Backspace') {
            setTypedText(prev => prev.slice(0, -1));
            setIsError(false);
            return;
        }

        // Ignore non-character keys (except space if needed, but usually words don't have spaces)
        if (key.length !== 1) return;

        const targetChar = currentWord.word[typedText.length];

        if (key === targetChar) {
            const newTypedText = typedText + key;
            setTypedText(newTypedText);
            setIsError(false);

            if (newTypedText === currentWord.word) {
                // Word complete
                onWordComplete(currentWord);
                // Reset for next word (delayed slightly by parent or effect?)
                // Actually, let's handle transition here or let parent trigger it.
                // For now, we'll just reset state immediately or wait for parent to call nextWord.
            }
        } else {
            setIsError(true);
            onMistake();
            // Optional: shake effect trigger
            setTimeout(() => setIsError(false), 300);
        }
    }, [currentWord, typedText, onWordComplete, onMistake]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const nextWord = useCallback(() => {
        setTypedText('');
        setCurrentWordIndex(prev => (prev + 1) % shuffledWords.length);
    }, [shuffledWords.length]);

    const reset = useCallback(() => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
        setCurrentWordIndex(0);
        setTypedText('');
    }, [words]);

    return {
        currentWord,
        typedText,
        isError,
        nextWord,
        reset
    };
};
