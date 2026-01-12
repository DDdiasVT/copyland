import { NextResponse } from 'next/server';
import { getCopies, addCopy } from '@/lib/data';

export async function GET() {
    const copies = await getCopies();
    return NextResponse.json(copies);
}

export async function POST(request: Request) {
    const body = await request.json();
    // No ID generation needed here as Prisma/DB handles it if configured, 
    // but Typescript might complain if we pass partial. 
    // lib/data.ts addCopy expects Omit<Copy, 'id'> so we are good if body matches.
    const newCopy = await addCopy(body);
    return NextResponse.json(newCopy);
}
