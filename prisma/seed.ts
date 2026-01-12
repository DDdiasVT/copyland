
import { PrismaClient } from '@prisma/client';
import authors from '../data/authors.json';
import copies from '../data/copies.json';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Seed Authors
    console.log(`Seeding ${authors.length} authors...`);
    for (const author of authors) {
        // Upsert to avoid duplicates if re-running
        await prisma.author.upsert({
            where: { id: author.id },
            update: {
                name: author.name,
                // bio: author.bio,           // Preserving DB value
                // imageUrl: author.imageUrl, // Preserving DB value
            },
            create: {
                id: author.id,
                name: author.name,
                bio: author.bio,
                imageUrl: author.imageUrl,
            },
        });
    }

    // 2. Seed Copies
    console.log(`Seeding ${copies.length} copies...`);
    for (const copy of copies) {
        await prisma.copy.upsert({
            where: { id: copy.id },
            update: {
                title: copy.title,
                author: copy.author,
                category: copy.category,
                rating: Number(copy.rating),
                // imageUrl: copy.imageUrl, // Preserving DB value
                // pdfUrl: copy.pdfUrl,     // Preserving DB value
                // description: copy.explanation, // Preserving DB value
                // notes: copy.notes,       // Preserving DB value
                // lessons: copy.lessons,   // Preserving DB value
                // isPremium: copy.isPremium, // Preserving DB value
                // createdAt: new Date(copy.createdAt),
            },
            create: {
                id: copy.id,
                title: copy.title,
                author: copy.author,
                category: copy.category,
                rating: Number(copy.rating),
                imageUrl: copy.imageUrl,
                pdfUrl: copy.pdfUrl,
                description: copy.explanation, // Optional in JSON
                notes: copy.notes,             // Optional
                lessons: copy.lessons,         // Optional
                isPremium: copy.isPremium || false,
                createdAt: new Date(copy.createdAt),
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
