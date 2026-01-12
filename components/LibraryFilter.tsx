'use client';

import { Search } from 'lucide-react';
import { CATEGORIES } from '@/types';

interface LibraryFilterProps {
    onSearch: (query: string) => void;
    onCategorySelect: (category: string) => void;
    selectedCategory: string;
}

export default function LibraryFilter({ onSearch, onCategorySelect, selectedCategory }: LibraryFilterProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit sticky top-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Filtrar Biblioteca</h3>

            {/* Search Filter */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-transparent"
                    placeholder="Buscar..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorias</h4>
                <div className="flex flex-col space-y-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategorySelect(cat)}
                            className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === cat
                                    ? 'bg-brand-red/10 text-brand-red font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
