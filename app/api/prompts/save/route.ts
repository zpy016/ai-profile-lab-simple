import { NextRequest, NextResponse } from 'next/server';
import { savePrompt } from '@/lib/prompt-storage';
import { PromptDocument } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, author, description, config } = body;

    if (!name || !config) {
      return NextResponse.json({ error: '缺少必要参数: name 和 config' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const doc: PromptDocument = {
      id: `prompt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).trim(),
      author: String(author || '匿名').trim(),
      description: String(description || '').trim(),
      createdAt: now,
      updatedAt: now,
      config,
    };

    savePrompt(doc);
    return NextResponse.json({ success: true, id: doc.id });
  } catch (err: any) {
    console.error('Save prompt error:', err);
    return NextResponse.json({ error: '保存提示词失败' }, { status: 500 });
  }
}
