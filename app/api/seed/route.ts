
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import authors from '@/data/authors.json';
import copies from '@/data/copies.json';

export async function GET() {
    try {
        console.log('Seeding via API...');

        // 1. Seed Authors
        for (const author of authors) {
            await prisma.author.upsert({
                where: { id: author.id },
                update: {
                    name: author.name,
                    bio: author.bio,
                    imageUrl: author.imageUrl,
                },
                create: {
                    id: author.id,
                    name: author.name,
                    bio: author.bio, // Now string
                    imageUrl: author.imageUrl,
                },
            });
        }

        // 2. Seed Copies
        for (const copy of copies) {
            await prisma.copy.upsert({
                where: { id: copy.id },
                update: {
                    title: copy.title,
                    author: copy.author,
                    category: copy.category,
                    rating: Number(copy.rating),
                    imageUrl: copy.imageUrl,
                    pdfUrl: copy.pdfUrl,
                    description: copy.explanation, // content mapped to description
                    notes: copy.notes,
                    lessons: copy.lessons,
                    isPremium: copy.isPremium,
                    createdAt: new Date(copy.createdAt),
                },
                create: {
                    id: copy.id,
                    title: copy.title,
                    author: copy.author,
                    category: copy.category,
                    rating: Number(copy.rating),
                    imageUrl: copy.imageUrl,
                    pdfUrl: copy.pdfUrl,
                    description: copy.explanation, // content mapped to description
                    notes: copy.notes,
                    lessons: copy.lessons,
                    isPremium: copy.isPremium || false,
                    createdAt: new Date(copy.createdAt),
                },
            });
        }

        return NextResponse.json({ success: true, message: `Seeded ${authors.length} authors and ${copies.length} copies.` });
    } catch (error: any) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: error.message, fullError: error }, { status: 500 });
    }
}
