import { NextResponse } from 'next/server';
import { getAuthorById, updateAuthor, deleteAuthor } from '@/lib/data';
import { Author } from '@/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const author = await getAuthorById(id);

    if (!author) {
        return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(author);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const body = await request.json();

    // Ensure the ID in the body matches the URL or isn't overwritten incorrectly
    const updatedAuthor: Author = { ...body, id };

    const result = await updateAuthor(updatedAuthor);

    return NextResponse.json(result);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    await deleteAuthor(id);
    return NextResponse.json({ success: true });
}
