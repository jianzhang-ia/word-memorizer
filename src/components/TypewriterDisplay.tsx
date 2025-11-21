import React from 'react';
import type { WordData } from '../types';

interface TypewriterDisplayProps {
    word: WordData;
    typedText: string;
    isError: boolean;
}

export const TypewriterDisplay: React.FC<TypewriterDisplayProps> = ({ word, typedText, isError }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full max-w-5xl mx-auto animate-fade-in-up">
            {/* Main Card with Glassmorphism */}
            <div className={`
                glass rounded-3xl p-8 md:p-12 w-full
                transition-all duration-300
                ${isError ? 'animate-shake border-red-500/50' : ''}
                shadow-2xl
            `}>
                {/* Word Container */}
                <div className="relative font-mono font-bold min-h-[120px] md:min-h-[160px] flex items-center justify-center w-full">
                    {/* Responsive Font Size - Smaller on mobile, huge on desktop */}
                    <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-wider relative break-all w-full text-center">
                        {/* Ghost Text (Sets the dimensions) */}
                        <span className="text-gray-500/40 opacity-60 select-none">
                            {word.word}
                        </span>

                        {/* Typed Text Overlay + Cursor */}
                        <div className="absolute left-0 top-0 w-full h-full text-center pointer-events-none">
                            <span className={`
                                bg-clip-text text-transparent bg-gradient-to-r 
                                ${isError
                                    ? 'from-red-400 to-pink-500'
                                    : 'from-cyan-400 via-purple-400 to-pink-400'
                                }
                                animate-gradient
                            `}>
                                {typedText}
                            </span>
                            {/* Animated Cursor with Glow */}
                            <span className={`
                                inline-block w-1 md:w-2 h-[0.8em] ml-1 align-middle
                                ${isError ? 'bg-red-400' : 'bg-cyan-400'}
                                animate-pulse-glow
                                rounded-sm
                            `}
                                style={{
                                    boxShadow: isError
                                        ? '0 0 15px rgba(248, 113, 113, 0.8)'
                                        : '0 0 15px rgba(34, 211, 238, 0.8)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Translation and Definition */}
                <div className="text-center space-y-4 mt-8 px-4">
                    {/* Translation */}
                    <div className="glass rounded-2xl px-6 py-4 inline-block">
                        <p className="text-xl md:text-2xl text-purple-300 font-medium tracking-wide">
                            {word.translation}
                        </p>
                    </div>

                    {/* Definition */}
                    <p className="text-sm md:text-base text-gray-400 italic max-w-2xl mx-auto leading-relaxed">
                        {word.definition}
                    </p>
                </div>
            </div>
        </div>
    );
};
