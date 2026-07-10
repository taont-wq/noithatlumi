import { NextResponse } from 'next/server';

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const BUCKET = process.env.R2_BUCKET_NAME || 'lumi-assets';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'NO_FILE' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'INVALID_TYPE' }, { status: 400 });
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // If R2 credentials exist, upload to R2
    if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = `${R2_ENDPOINT}/${BUCKET}/${key}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `AWS ${process.env.R2_ACCESS_KEY_ID}:${process.env.R2_SECRET_ACCESS_KEY}`,
          'Content-Type': file.type,
          'Content-Length': buffer.length.toString(),
        },
        body: buffer,
      });

      if (!res.ok) {
        throw new Error(`R2 upload failed: ${res.status}`);
      }

      const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
        : `${R2_ENDPOINT}/${BUCKET}/${key}`;

      return NextResponse.json({ data: { url: publicUrl, key } });
    }

    // Fallback: return base64 data URL for dev
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      data: { url: dataUrl, key },
      warning: 'No R2 credentials — using base64 fallback',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'UPLOAD_FAILED' }, { status: 500 });
  }
}
