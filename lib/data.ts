import { prisma } from '@/lib/prisma';
import { Copy, Author } from '@/types';

// Copies Functions

export async function getCopies(): Promise<Copy[]> {
    try {
        const copies = await prisma.copy.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // Convert Prisma date objects/decimals to string/number if necessary, 
        // but Types interface says createdAt is string. Prisma returns Date.
        // We need to map if strict typing is enforced or update types. 
        // For now, let's map to match expected interface.
        return copies.map((c: any) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            isPremium: c.isPremium ?? false
        })) as unknown as Copy[];
    } catch (error) {
        console.error("Error fetching copies:", error);
        return [];
    }
}

export async function getCopyById(id: string): Promise<Copy | null> {
    try {
        const copy = await prisma.copy.findUnique({
            where: { id },
            include: {
                comments: {
                    orderBy: { createdAt: 'desc' },
                    include: { replies: { orderBy: { createdAt: 'asc' } } }
                }
            }
        });
        if (!copy) return null;
        return {
            ...copy,
            createdAt: copy.createdAt.toISOString(),
            isPremium: copy.isPremium ?? false,
            comments: copy.comments ? copy.comments.map((c: any) => ({
                ...c,
                createdAt: c.createdAt.toISOString(),
                replies: c.replies ? c.replies.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() })) : []
            })) : []
        } as unknown as Copy;
    } catch (error) {
        console.error("Error fetching copy:", error);
        return null;
    }
}

// Omit 'id' from input when creating as it's auto-generated
export async function addCopy(copy: Omit<Copy, 'id' | 'createdAt'>): Promise<Copy | null> {
    try {
        const { comments, ...copyData } = copy;
        const newCopy = await prisma.copy.create({
            data: {
                ...copyData,
                rating: Number(copy.rating),
                isPremium: copy.isPremium ?? false
            }
        });
        return {
            ...newCopy,
            createdAt: newCopy.createdAt.toISOString(),
            isPremium: newCopy.isPremium ?? false
        } as unknown as Copy;
    } catch (error) {
        console.error("Error creating copy:", error);
        return null;
    }
}

export async function updateCopy(copy: Copy): Promise<Copy | null> {
    try {
        const { comments, ...copyData } = copy;
        const updated = await prisma.copy.update({
            where: { id: copy.id },
            data: {
                title: copy.title,
                author: copy.author,
                category: copy.category,
                rating: Number(copy.rating),
                imageUrl: copy.imageUrl,
                pdfUrl: copy.pdfUrl,
                videoUrl: copy.videoUrl,
                description: copy.description,
                notes: copy.notes,
                lessons: copy.lessons,
                translation: copy.translation,
                isPremium: copy.isPremium
            }
        });
        return {
            ...updated,
            createdAt: updated.createdAt.toISOString(),
            isPremium: updated.isPremium ?? false
        } as unknown as Copy;
    } catch (error) {
        console.error("Error updating copy:", error);
        return null;
    }
}

export async function deleteCopy(id: string): Promise<void> {
    try {
        await prisma.copy.delete({ where: { id } });
    } catch (error) {
        console.error("Error deleting copy:", error);
    }
}

// Author Functions

export async function getAuthors(): Promise<Author[]> {
    try {
        const authors = await prisma.author.findMany();
        return authors.map(a => ({
            ...a,
            createdAt: a.createdAt.toISOString()
        })) as unknown as Author[];
    } catch (error) {
        console.error("Error fetching authors:", error);
        return [];
    }
}

export async function getAuthorById(id: string): Promise<Author | null> {
    try {
        const author = await prisma.author.findUnique({ where: { id } });
        if (!author) return null;
        return {
            ...author,
            createdAt: author.createdAt.toISOString()
        } as unknown as Author;
    } catch (error) {
        console.error("Error fetching author:", error);
        return null;
    }
}

export async function addAuthor(author: Omit<Author, 'id' | 'createdAt'>): Promise<Author | null> {
    try {
        const newAuthor = await prisma.author.create({
            data: author
        });
        return {
            ...newAuthor,
            createdAt: newAuthor.createdAt.toISOString()
        } as unknown as Author;
    } catch (error) {
        console.error("Error creating author:", error);
        return null;
    }
}

export async function updateAuthor(author: Author): Promise<Author | null> {
    try {
        const updated = await prisma.author.update({
            where: { id: author.id },
            data: {
                name: author.name,
                bio: author.bio,
                imageUrl: author.imageUrl
            }
        });
        return {
            ...updated,
            createdAt: updated.createdAt.toISOString()
        } as unknown as Author;
    } catch (error) {
        console.error("Error updating author:", error);
        return null;
    }
}

export async function deleteAuthor(id: string): Promise<void> {
    try {
        await prisma.author.delete({ where: { id } });
    } catch (error) {
        console.error("Error deleting author:", error);
    }
}
