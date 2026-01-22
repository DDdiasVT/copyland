'use client';

import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';

interface FileUploadProps {
    label: string;
    folder: 'images' | 'pdfs' | 'videos';
    accept: string;
    value: string;
    onChange: (url: string) => void;
}

export default function FileUpload({ label, folder, accept, value, onChange }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url);
        } catch (err) {
            setError('Erro ao enviar arquivo.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black pr-10"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`URL ou upload de ${label}...`}
                    />
                    {value && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-green-500">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <label className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md border border-gray-300 transition flex items-center justify-center min-w-[120px] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <span className="text-sm">Enviando...</span>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            <span className="text-sm">Upload</span>
                        </>
                    )}
                </label>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {value && folder === 'images' && (
                <div className="mt-2 text-xs text-gray-500">
                    Preview: <img src={value} alt="Preview" className="h-20 w-auto object-cover rounded border mt-1" />
                </div>
            )}
        </div>
    );
}
