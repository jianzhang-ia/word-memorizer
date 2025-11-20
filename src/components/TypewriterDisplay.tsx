import React from 'react';
import type { WordData } from '../types';

interface TypewriterDisplayProps {
    word: WordData;
    typedText: string;
    isError: boolean;
}

export const TypewriterDisplay: React.FC<TypewriterDisplayProps> = ({ word, typedText, isError }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full">
            {/* Word Container - Relative to hold absolute overlays */}
            <div className={`relative font-mono font-bold transition-transform duration-100 ${isError ? 'animate-shake text-red-500' : ''} min-h-[120px] flex items-center justify-center`}>

                {/* Responsive Font Size */}
                <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-wider relative">

                    {/* Ghost Text (Sets the dimensions) */}
                    <span className="text-gray-700 opacity-30 select-none">
                        {word.word}
                    </span>

                    {/* Typed Text Overlay + Cursor */}
                    <div className="absolute left-0 top-0 whitespace-nowrap">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                            {typedText}
                        </span>
                        {/* Cursor */}
                        <span className="inline-block w-1 md:w-1.5 h-[0.8em] bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    </div>

                </div>
            </div>

            <div className="text-center space-y-3 mt-8 px-4 min-h-[100px]">
                <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">{word.translation}</p>
                <p className="text-sm md:text-base text-gray-600 italic max-w-lg mx-auto leading-relaxed">{word.definition}</p>
            </div>
        </div>
    );
};
