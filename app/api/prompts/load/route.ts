import { NextRequest, NextResponse } from 'next/server';
import { loadPrompt } from '@/lib/prompt-storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少参数: id' }, { status: 400 });
    }

    const doc = loadPrompt(id);
    if (!doc) {
      return NextResponse.json({ error: '提示词文档不存在' }, { status: 404 });
    }

    return NextResponse.json({ doc });
  } catch (err: any) {
    console.error('Load prompt error:', err);
    return NextResponse.json({ error: '加载提示词失败' }, { status: 500 });
  }
}
