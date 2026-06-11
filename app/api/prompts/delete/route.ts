import { NextRequest, NextResponse } from 'next/server';
import { deletePrompt } from '@/lib/prompt-storage';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少参数: id' }, { status: 400 });
    }

    const ok = deletePrompt(id);
    if (!ok) {
      return NextResponse.json({ error: '提示词文档不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete prompt error:', err);
    return NextResponse.json({ error: '删除提示词失败' }, { status: 500 });
  }
}
