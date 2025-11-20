import { useState } from 'react';
import type { LearnedWord } from '../types';

interface MemoryViewProps {
    learnedWords: LearnedWord[];
    onBack: () => void;
}

export const MemoryView = ({ learnedWords, onBack }: MemoryViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWords = learnedWords.filter(w =>
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.translation.includes(searchTerm) ||
        w.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in-up">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 tracking-wider font-bold animate-gradient">
                    MEMORY BANK
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                    {learnedWords.length} word{learnedWords.length !== 1 ? 's' : ''} mastered
                </p>
            </div>

            {/* Search bar */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search your vocabulary..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 glass rounded-2xl
                                 text-gray-200 font-mono text-sm md:text-base
                                 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                                 transition-all duration-300
                                 placeholder-gray-500
                                 shadow-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Words grid */}
            {filteredWords.length === 0 ? (
                <div className="text-center py-20">
                    <div className="glass rounded-3xl p-12 max-w-md mx-auto">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-gray-400 text-lg">
                            {searchTerm ? 'No matching words found' : 'No words learned yet'}
                        </p>
                        {searchTerm && (
                            <p className="text-gray-600 text-sm mt-2">
                                Try a different search term
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    {filteredWords.map((wordData, index) => (
                        <div
                            key={`${wordData.word}-${index}`}
                            className="glass-hover rounded-2xl p-6 md:p-8 shadow-lg stagger-item
                                     hover:shadow-2xl"
                        >
                            {/* Word */}
                            <div className="mb-4">
                                <h3 className="text-3xl md:text-4xl font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2 font-bold">
                                    {wordData.word}
                                </h3>
                                <div className="glass rounded-xl px-4 py-2 inline-block">
                                    <p className="text-sm md:text-base text-purple-300 font-medium">
                                        {wordData.translation}
                                    </p>
                                </div>
                            </div>

                            {/* Definition */}
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
                                {wordData.definition}
                            </p>

                            {/* Timestamp with icon */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatDate(wordData.learnedAt)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Back button */}
            <div className="text-center mt-12">
                <button
                    onClick={onBack}
                    className="glass-hover px-8 py-4 rounded-2xl font-mono text-sm
                             text-gray-300 hover:text-white
                             transition-all duration-300
                             tracking-wider shadow-lg
                             hover:shadow-2xl"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        BACK TO LEARNING
                    </span>
                </button>
            </div>
        </div>
    );
};
