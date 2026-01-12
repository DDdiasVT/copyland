'use client';

import { Search } from 'lucide-react';
import { CATEGORIES } from '@/types';
import { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onCategorySelect: (category: string) => void;
    selectedCategory: string;
}

export default function SearchBar({ onSearch, onCategorySelect, selectedCategory }: SearchBarProps) {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-4">
            {/* Search Input */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent shadow-sm"
                    placeholder="Busque por título, autor ou copy..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* Categories / Chips */}
            <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategorySelect(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === cat
                                ? 'bg-brand-red text-white border-brand-red shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red hover:text-brand-red'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
