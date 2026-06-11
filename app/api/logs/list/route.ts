import { NextResponse } from 'next/server';
import { listLogs } from '@/lib/log-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = listLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('List logs error:', err);
    return NextResponse.json({ error: '读取日志列表失败' }, { status: 500 });
  }
}
