'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Author, Copy } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CopyCard from '@/components/CopyCard';

export default function AuthorPage() {
    const params = useParams();
    const [author, setAuthor] = useState<Author | null>(null);
    const [authorCopies, setAuthorCopies] = useState<Copy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            // Fetch Author
            fetch(`/api/authors/${params.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Author not found');
                    return res.json();
                })
                .then(data => {
                    setAuthor(data);
                    // Fetch Copies and filter client-side for now (or make an API query if supported)
                    return fetch('/api/copies');
                })
                .then(res => res.json())
                .then((copies: Copy[]) => {
                    if (author) {
                        // Filter copies by exact author name match
                        // Note: Ideally we should use author ID in copies, but string match works for current request
                        // We rely on the name match being exact or containing the name
                    }
                    setAuthorCopies(copies.filter(c => c.author.includes(author?.name || '')));
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    // Use effect dependency fix: recalculate copies when author is set
    useEffect(() => {
        if (author) {
            fetch('/api/copies')
                .then(res => res.json())
                .then((copies: Copy[]) => {
                    setAuthorCopies(copies.filter(c =>
                        c.author.toLowerCase().includes(author.name.toLowerCase()) ||
                        author.name.toLowerCase().includes(c.author.toLowerCase())
                    ));
                });
        }
    }, [author]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Carregando...</div>;
    if (!author) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Autor não encontrado.</div>;

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-main">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Link href="/" className="inline-flex items-center text-brand-red mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a Início
                </Link>

                <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={author.imageUrl}
                                alt={author.name}
                                className="w-full h-full object-cover grayscale"
                            />
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{author.name}</h1>
                        <div className="prose prose-lg text-gray-700 leading-relaxed">
                            <p className="whitespace-pre-line">{author.bio}</p>
                        </div>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">
                        Copies de {author.name}
                    </h2>

                    {authorCopies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {authorCopies.map((copy) => (
                                <CopyCard key={copy.id} copy={copy} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic py-10 text-center bg-gray-50 rounded-lg">
                            Nenhuma copy cadastrada para este autor ainda.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
