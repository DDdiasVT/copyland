import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('Upload request received (Vercel Blob)');
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'misc';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        // Vercel Blob handles uniqueness automatically if we don't specify overlapping paths,
        // but organizing by folders is good.
        const blob = await put(`${folder}/${filename}`, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
