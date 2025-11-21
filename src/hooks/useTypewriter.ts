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

    const handleInput = useCallback((key: string) => {
        if (!currentWord) return;

        // Handle Backspace
        if (key === 'Backspace') {
            setTypedText(prev => prev.slice(0, -1));
            setIsError(false);
            return;
        }

        // Ignore non-character keys (except space if needed)
        if (key.length !== 1) return;

        const targetChar = currentWord.word[typedText.length];

        if (key === targetChar) {
            const newTypedText = typedText + key;
            setTypedText(newTypedText);
            setIsError(false);

            if (newTypedText === currentWord.word) {
                onWordComplete(currentWord);
            }
        } else {
            setIsError(true);
            onMistake();
            setTimeout(() => setIsError(false), 300);
        }
    }, [currentWord, typedText, onWordComplete, onMistake]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Ignore modifier keys
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        handleInput(e.key);
    }, [handleInput]);



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
        reset,
        handleInput,
        handleKeyDown
    };
};
