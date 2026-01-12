
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { copyId, content, rating, authorName, parentId } = body;

        if (!copyId || !content || !authorName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                copyId,
                content,
                rating: Number(rating) || 0,
                authorName,
                parentId: parentId || null
            }
        });

        // Re-fetch to return with correct format if needed, but simple return is ok.
        // We'll return the object with ISO string dates on the client if needed, 
        // but Next.js json() handles basic serialization.
        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
