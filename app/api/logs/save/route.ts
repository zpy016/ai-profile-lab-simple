import { NextRequest, NextResponse } from 'next/server';
import { saveLog } from '@/lib/log-storage';
import { LogDocument } from '@/lib/log-storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, author, description, logs } = body;

    if (!name || !Array.isArray(logs)) {
      return NextResponse.json({ error: '缺少必要参数: name 和 logs' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const doc: LogDocument = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).trim(),
      author: String(author || '匿名').trim(),
      description: String(description || '').trim(),
      createdAt: now,
      updatedAt: now,
      logs,
    };

    saveLog(doc);
    return NextResponse.json({ success: true, id: doc.id });
  } catch (err: any) {
    console.error('Save log error:', err);
    return NextResponse.json({ error: '保存日志失败' }, { status: 500 });
  }
}
