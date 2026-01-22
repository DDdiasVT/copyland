'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import LendasSection from '@/components/LendasSection';
import CopyCard from '@/components/CopyCard';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { Copy } from '@/types';

export default function HomeContent() {
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
    <main className="min-h-screen bg-[#FDFBF7]">
      <Hero />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 w-full min-w-0">
          <SearchBar
            onSearch={setSearchQuery}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <LendasSection />

          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Últimas Copys Adicionadas</h2>
            <p className="text-center text-gray-500 mb-10 text-sm">As adições mais recentes ao nosso acervo</p>

            {loading ? (
              <div className="text-center py-20">Carregando...</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredCopies.map((copy) => (
                  <CopyCard key={copy.id} copy={copy} />
                ))}
                {filteredCopies.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-10">
                    Nenhuma copy encontrada.
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">As Melhores Obras</h2>
            {/* Reuse the grid for "Best Works" logic, for now simple slice */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredCopies.filter(c => c.rating >= 4.8).slice(0, 3).map((copy) => (
                <CopyCard key={`best-${copy.id}`} copy={copy} />
              ))}
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </main>
  );
}
