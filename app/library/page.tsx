'use client';

import { useState, useEffect } from 'react';
import LibraryFilter from '@/components/LibraryFilter';
import CopyCard from '@/components/CopyCard';
import { Copy } from '@/types';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function LibraryPage() {
    const [copies, setCopies] = useState<Copy[]>([]);
    const [filteredCopies, setFilteredCopies] = useState<Copy[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/copies')
            .then((res) => res.json())
            .then((data) => {
                setCopies(data);
                setFilteredCopies(data);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = copies;

        if (selectedCategory !== 'Todas') {
            result = result.filter((copy) => copy.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter((copy) =>
                copy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                copy.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCopies(result);
    }, [searchQuery, selectedCategory, copies]);

    return (
        <div className="flex min-h-screen bg-[#FDFBF7]">
            <Sidebar />
            <main className="flex-1 w-full min-w-0 max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <LibraryFilter
                            onSearch={setSearchQuery}
                            onCategorySelect={setSelectedCategory}
                            selectedCategory={selectedCategory}
                        />
                    </aside>

                    {/* Right Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {selectedCategory === 'Todas' ? 'Todas as Copys' : selectedCategory}
                            </h1>
                            <span className="text-sm text-gray-500">{filteredCopies.length} resultados</span>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Carregando acervo...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCopies.map((copy) => (
                                    <CopyCard key={copy.id} copy={copy} />
                                ))}
                                {filteredCopies.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500">Nenhuma copy encontrada para este filtro.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
