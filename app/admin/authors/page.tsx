'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Author } from '@/types';
import { ArrowLeft } from 'lucide-react';

export default function AdminAuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        fetch('/api/authors').then(res => res.json()).then(setAuthors);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este autor?')) return;

        await fetch(`/api/authors/${id}`, { method: 'DELETE' });
        setAuthors(authors.filter(a => a.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <Link href="/admin" className="inline-flex items-center text-gray-500 mb-6 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Lendas</h1>
                    <Link href="/admin/authors/add" className="bg-brand-red text-white px-6 py-2 rounded-md hover:bg-red-800 transition">
                        + Adicionar Novo Autor
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {authors.map((author) => (
                                <tr key={author.id}>
                                    <td className="px-6 py-4 whitespace-nowrap w-20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={author.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{author.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/authors/edit/${author.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(author.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
