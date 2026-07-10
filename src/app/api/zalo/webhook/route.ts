import { NextResponse } from 'next/server';
import { prisma } from '@/lib/api/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  if (challenge) {
    return new NextResponse(challenge);
  }
  return NextResponse.json({ error: 'NO_CHALLENGE' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sender = body.sender?.id;
    const message = body.message;

    if (!sender || !message) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const saved = await prisma.zaloMessage.create({
      data: {
        messageId: body.event_id ?? `msg_${Date.now()}`,
        userId: sender,
        userName: body.sender?.name ?? null,
        userPhone: body.sender?.phone ?? null,
        messageType: message.attachments?.length
          ? message.attachments[0].type.toUpperCase()
          : 'TEXT',
        content: message.text ?? JSON.stringify(message.attachments ?? {}),
        rawData: JSON.stringify(body),
      },
    });

    // Auto-process
    await prisma.zaloMessage.update({
      where: { id: saved.id },
      data: { processed: true, processedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Zalo webhook error:', error);
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
