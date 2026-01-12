
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

async function main() {
    try {
        console.log('Connecting to DB with DIRECT_URL (or DATABASE_URL)...');
        console.log('URL used (masked):', (process.env.DIRECT_URL || process.env.DATABASE_URL)?.replace(/:[^:@]+@/, ':****@'));

        const authorCount = await prisma.author.count();
        const copyCount = await prisma.copy.count();
        console.log(`Authors: ${authorCount}`);
        console.log(`Copies: ${copyCount}`);

        if (authorCount > 0) {
            const firstAuthor = await prisma.author.findFirst();
            console.log('First Author:', JSON.stringify(firstAuthor, null, 2));
        } else {
            console.log('No authors found.');
        }
    } catch (e: any) {
        console.error('Connection failed (Message):', e.message);
        console.error('Connection failed (Full):', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
