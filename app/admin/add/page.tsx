'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, Author } from '@/types';
import FileUpload from '@/components/FileUpload';

export default function AddCopyPage() {
    const router = useRouter();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: CATEGORIES[1],
        rating: 5,
        imageUrl: '',
        pdfUrl: '',
        videoUrl: '',
        description: '',
        notes: '',
        lessons: '',
        translation: '',
        isPremium: false
    });

    useEffect(() => {
        // Fetch authors for the dropdown
        fetch('/api/authors')
            .then(res => res.json())
            .then(data => setAuthors(data))
            .catch(err => console.error('Failed to fetch authors', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/copies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Adicionar Nova Copy</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Autor</label>
                            {formData.category === 'Lendas da Copy' ? (
                                <select
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                >
                                    <option value="">Selecione um autor...</option>
                                    {authors.map(author => (
                                        <option key={author.id} value={author.name}>
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categoria</label>
                            <select
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value, author: '' })} // Clear author on category change
                            >
                                {CATEGORIES.filter(c => c !== 'Todas').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="isPremium"
                            type="checkbox"
                            className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                            checked={formData.isPremium || false}
                            onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                        />
                        <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-900">
                            Conteúdo Premium (Pago)
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FileUpload
                                label="Imagem de Capa"
                                folder="images"
                                accept="image/*"
                                value={formData.imageUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            />
                        </div>
                        <div>
                            <FileUpload
                                label="PDF da Copy"
                                folder="pdfs"
                                accept="application/pdf"
                                value={formData.pdfUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, pdfUrl: url }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vídeo (YouTube Embed/Link)</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                            value={formData.videoUrl}
                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 text-black"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Explique o contexto e mecanincas..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notas</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 text-black"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Observações importantes..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Lições</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24 text-black"
                                value={formData.lessons}
                                onChange={e => setFormData({ ...formData, lessons: e.target.value })}
                                placeholder="Ex: 1. Lição um..."
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tradução</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32 text-black"
                            value={formData.translation || ''}
                            onChange={e => setFormData({ ...formData, translation: e.target.value })}
                            placeholder="Adicione a tradução aqui..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-brand-red text-white px-6 py-2 rounded hover:bg-red-800 transition"
                        >
                            Salvar Copy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
