import { NextResponse } from 'next/server';
import { getCopyById, updateCopy, deleteCopy } from '@/lib/data';
import { Copy } from '@/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const copy = await getCopyById(id);

    if (!copy) {
        return NextResponse.json({ error: 'Copy not found' }, { status: 404 });
    }

    return NextResponse.json(copy);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const body = await request.json();

    // Ensure the ID in the body matches the URL or isn't overwritten incorrectly
    const updatedCopy: Copy = { ...body, id };

    const result = await updateCopy(updatedCopy);

    return NextResponse.json(result);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    await deleteCopy(id);
    return NextResponse.json({ success: true });
}
