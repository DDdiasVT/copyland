import Image from 'next/image';
import { Star } from 'lucide-react';
import { Copy } from '@/types';
import Link from 'next/link';

export default function CopyCard({ copy }: { copy: Copy }) {
    return (
        <Link href={`/library/${copy.id}`} className="group block">
            <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {/* Placeholder for real image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                        {copy.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={copy.imageUrl}
                                alt={copy.title}
                                className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span>No Image</span>
                        )}
                    </div>
                    {copy.isPremium && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                            PREMIUM
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">
                            {copy.title}
                        </h3>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Autor</span>
                            <span className="font-medium text-gray-700">{copy.author}</span>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center text-yellow-500 mb-1">
                                <span className="font-bold mr-1 text-gray-900">{copy.rating}</span>
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                                {copy.category}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
