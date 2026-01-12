
'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { Star, Reply, User } from 'lucide-react';

interface CommentSectionProps {
    copyId: string;
    initialComments?: Comment[];
}

export default function CommentSection({ copyId, initialComments = [] }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [authorName, setAuthorName] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        if (!authorName) {
            alert('Por favor, informe seu nome.');
            return;
        }

        const content = parentId ? replyContent : newComment;
        if (!content) return;

        setLoading(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    copyId,
                    content,
                    rating: parentId ? 0 : rating, // Replies don't have rating usually
                    authorName,
                    parentId
                })
            });

            if (res.ok) {
                const savedComment = await res.json();
                // Optimistic update or refresh? Let's just append.
                // Since our initialComments structure is nested, we need to handle that.
                // Ideal: re-fetch or careful state update.
                // For MVP: simple reload or quick hack state update.
                // Let's do a simple page reload for now to ensure consistency, 
                // or try to append if simple.
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setNewComment('');
            setRating(0);
            setReplyingTo(null);
            setReplyContent('');
        }
    };

    return (
        <section className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Avaliações e Comentários</h2>

            {/* Main Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Deixe sua avaliação</h3>
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-colors ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            >
                                <Star className="w-6 h-6" fill={star <= rating ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        placeholder="Seu Nome"
                        className="w-full border border-gray-300 rounded-md p-2 text-black"
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        required
                    />

                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 h-24 text-black"
                        placeholder="O que você achou desta copy?"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        required
                    ></textarea>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-red text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Publicar Avaliação'}
                    </button>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">Seja o primeiro a avaliar!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-brand-red/10 p-2 rounded-full">
                                        <User className="w-5 h-5 text-brand-red" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{comment.authorName}</p>
                                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4 whitespace-pre-line">{comment.content}</p>

                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="text-sm text-brand-red flex items-center hover:underline"
                            >
                                <Reply className="w-4 h-4 mr-1" /> Responder
                            </button>

                            {/* Reply Form */}
                            {replyingTo === comment.id && (
                                <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4 ml-8 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Seu Nome"
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
                                        value={authorName} // Reuse state for simplicity, or separate if stricter
                                        onChange={e => setAuthorName(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md p-2 h-16 text-sm text-black"
                                        placeholder={`Respondendo a ${comment.authorName}...`}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-800 text-white px-4 py-1.5 rounded text-sm hover:bg-black transition"
                                    >
                                        Responder
                                    </button>
                                </form>
                            )}

                            {/* Nested Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="bg-white p-4 rounded border border-gray-100">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-bold text-sm text-gray-800">{reply.authorName}</span>
                                                <span className="text-xs text-gray-500">• {new Date(reply.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm whitespace-pre-line">{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
