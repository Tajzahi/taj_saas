import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { and, eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const tenantId = request.headers.get('x-tenant-id') || '';
    
    const fileResult = await db.select().from(schema.files).where(and(eq(schema.files.id, id), eq(schema.files.tenantId, tenantId))).limit(1);
    const file = fileResult[0];

    if (!file) {
      return new NextResponse('Not found', { status: 404 });
    }

    // content is a base64 data url like: data:image/png;base64,iVBOR...
    const base64Data = file.content.split(',')[1] || file.content;
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.fileType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (err) {
    console.error('Fetch file error:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
