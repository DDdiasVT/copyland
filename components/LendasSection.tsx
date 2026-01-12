'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Author } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LendasSection() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/authors')
            .then(res => res.json())
            .then(data => setAuthors(data))
            .catch(err => console.error("Failed to fetch authors", err));
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth; // Scroll one full screen
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-16 bg-[#FDFBF7] overflow-hidden group">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Lendas da Copy</h2>
                    <p className="text-gray-500 text-sm">Aprenda com os mestres que ditaram as regras da persuasão escrita</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-2 rounded-full bg-white shadow-lg text-gray-800 hover:text-brand-red hover:scale-110 transition-all focus:outline-none"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Carousel Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 py-4 px-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
                    >
                        {authors.map((author) => (
                            <Link
                                href={`/lendas/${author.id}`}
                                key={author.id}
                                className="flex-none w-[calc(25%-1.2rem)] md:w-[calc(25%-1.2rem)] flex flex-col items-center group/item cursor-pointer snap-center transition-transform hover:-translate-y-1"
                            >
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 filter grayscale group-hover/item:grayscale-0 transition-all duration-500 shadow-sm border-2 border-transparent group-hover/item:border-brand-red/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={author.imageUrl || `https://placehold.co/150x150/png?text=${author.name.split(' ')[0]}`}
                                        alt={author.name}
                                        className="w-full h-full object-cover scale-110"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <span className="text-base font-bold text-gray-800 group-hover/item:text-brand-red transition-colors text-center px-2">
                                    {author.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-2 rounded-full bg-white shadow-lg text-gray-800 hover:text-brand-red hover:scale-110 transition-all focus:outline-none"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}

