import { NextResponse } from 'next/server';
import { getAuthors, addAuthor } from '@/lib/data';

export async function GET() {
    const authors = await getAuthors();
    return NextResponse.json(authors);
}

export async function POST(request: Request) {
    const body = await request.json();
    // Omit 'id' as DB generating it. addAuthor handles Omit<Author, 'id'>.
    const newAuthor = await addAuthor(body);
    return NextResponse.json(newAuthor);
}
