import { NextResponse } from 'next/server';
import { listPrompts } from '@/lib/prompt-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prompts = listPrompts();
    return NextResponse.json({ prompts });
  } catch (err: any) {
    console.error('List prompts error:', err);
    return NextResponse.json({ error: '读取提示词列表失败' }, { status: 500 });
  }
}
