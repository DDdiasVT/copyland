'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Copy } from '@/types';
import Link from 'next/link';
import { ArrowLeft, FileText, BookOpen, Lightbulb, Lock } from 'lucide-react';
import CommentSection from '@/components/CommentSection';
import Sidebar from '@/components/Sidebar';

import { useSession } from 'next-auth/react';

export default function CopyDetailPage() {
    const params = useParams();
    const { data: session } = useSession();
    const [copy, setCopy] = useState<Copy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/copies/${params.id}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then((data) => {
                    setCopy(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [params.id]);

    const hasAccess = !copy?.isPremium ||
        (session?.user?.role === 'SUBSCRIBER' || session?.user?.role === 'ADMIN');

    // Premium Blocker Component
    const PremiumOverlay = () => (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-start pt-32 text-center p-6">
            <div className="bg-white p-6 rounded-full shadow-xl mb-4">
                <Lock className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Conteúdo Exclusivo</h3>
            <p className="text-gray-600 mb-6 max-w-md">
                Esta análise completa está disponível apenas para membros do Copyland Premium.
            </p>
            <Link href="/register?plan=premium">
                <button className="bg-brand-red text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition transform hover:scale-105">
                    Desbloquear Agora
                </button>
            </Link>
        </div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Carregando...</div>;
    if (!copy) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Copy não encontrada.</div>;

    return (
        <div className="flex min-h-screen bg-[#FDFBF7]">
            <Sidebar />
            <div className="flex-1 min-w-0 bg-[#FDFBF7] text-gray-800 font-main">
                <div className="w-full px-8 py-10 transition-all duration-300">
                    <Link href="/" className="inline-flex items-center text-brand-red mb-8 hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a Biblioteca
                    </Link>

                    {/* Header */}
                    <header className="mb-10 border-b border-gray-200 pb-8">
                        <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                            {copy.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{copy.title}</h1>
                        <div className="flex items-center text-gray-500 space-x-4">
                            <span className="font-semibold">Autor: {copy.author}</span>
                            <span>•</span>
                            <span>Adicionado em: {new Date(copy.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: PDF Viewer */}
                        <div className="lg:col-span-2 space-y-8 relative">
                            {/* Premium Lock Wrapper for Content */}
                            {!hasAccess && <PremiumOverlay />}

                            <div className={!hasAccess ? "blur-sm select-none pointer-events-none" : ""}>
                                <section className="bg-white p-2 rounded-xl shadow-md border border-gray-100 h-[600px]">
                                    {copy.pdfUrl ? (
                                        <iframe
                                            src={copy.pdfUrl}
                                            className="w-full h-full rounded-lg"
                                            title="PDF Viewer"
                                        ></iframe>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg text-gray-400">
                                            <FileText className="w-16 h-16 mb-4 opacity-50" />
                                            <p>Nenhum PDF disponível para esta copy.</p>
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-4 flex items-center text-brand-red">
                                        <FileText className="w-6 h-6 mr-2" /> Tradução
                                    </h2>
                                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-96 overflow-y-auto custom-scrollbar">
                                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                            {copy.translation ? copy.translation : "Nenhuma tradução disponível."}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-4 flex items-center text-brand-red">
                                        <BookOpen className="w-6 h-6 mr-2" /> Explicação da Copy
                                    </h2>
                                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                        {copy.description || "Nenhuma explicação disponível."}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Right Column: Notes & Lessons */}
                        <div className={`space-y-8 ${!hasAccess ? "blur-sm select-none pointer-events-none" : ""}`}>
                            <section>
                                <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-600">
                                    <Lightbulb className="w-5 h-5 mr-2" /> Notas e Insights
                                </h2>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100 bg-yellow-50/30">
                                    {copy.notes ? (
                                        <p className="whitespace-pre-line text-gray-700">{copy.notes}</p>
                                    ) : (
                                        <p className="text-gray-400 italic">Sem notas adicionais.</p>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-4 text-gray-900">
                                    Lições Principais
                                </h2>
                                <div className="bg-brand-red text-white p-6 rounded-xl shadow-md">
                                    {copy.lessons ? (
                                        <div className="whitespace-pre-line font-medium leading-relaxed">{copy.lessons}</div>
                                    ) : (
                                        <p className="text-white/70 italic">Sem lições cadastradas.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    <CommentSection copyId={params.id as string} initialComments={copy.comments} />
                </div>
            </div>
        </div>
    );
}
