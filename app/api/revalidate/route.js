import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Secret invalide' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const path = body?.path || '/';

  revalidatePath(path);

  return NextResponse.json({ ok: true, revalidated: path });
}
