import { NextRequest, NextResponse } from 'next/server';
import { deleteLog } from '@/lib/log-storage';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少参数: id' }, { status: 400 });
    }

    const ok = deleteLog(id);
    if (!ok) {
      return NextResponse.json({ error: '日志文档不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete log error:', err);
    return NextResponse.json({ error: '删除日志失败' }, { status: 500 });
  }
}
