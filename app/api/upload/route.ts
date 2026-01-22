import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const config = {
    api: {
        bodyParser: false, // Disabling body parser to handle FormData manually if needed, though Next.js App Router handles it.
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'misc';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const uniqueFilename = `${uniqueSuffix}-${filename}`;

        // Define public directory path
        const publicPath = path.join(process.cwd(), 'public', 'uploads', folder);

        // Create directory if it doesn't exist
        await fs.mkdir(publicPath, { recursive: true });

        // Write file to the public folder
        await fs.writeFile(path.join(publicPath, uniqueFilename), buffer);

        // Return the relative URL
        const fileUrl = `/uploads/${folder}/${uniqueFilename}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
