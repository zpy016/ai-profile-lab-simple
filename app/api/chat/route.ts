import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const ARK_API_KEY = process.env.ARK_API_KEY;
const ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

export async function POST(req: NextRequest) {
  if (!ARK_API_KEY) {
    return NextResponse.json(
      { error: 'ARK_API_KEY 未配置。请在 .env.local 中设置 ARK_API_KEY，或联系管理员。' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { systemPrompt, userPrompt, model, temperature = 0.7, responseFormat } = body;

    if (!model || !userPrompt) {
      return NextResponse.json(
        { error: '缺少必要参数: model 和 userPrompt' },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: ARK_API_KEY,
      baseURL: ARK_BASE_URL,
    });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature,
      response_format: responseFormat,
    }, {
      timeout: 30000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    return NextResponse.json({ content, usage });
  } catch (err: any) {
    console.error('ARK API Error:', err);

    // Handle specific error types
    if (err.status === 401) {
      return NextResponse.json(
        { error: 'API Key 无效或已过期，请检查 ARK_API_KEY 配置。' },
        { status: 401 }
      );
    }

    if (err.status === 429) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试。' },
        { status: 429 }
      );
    }

    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
      return NextResponse.json(
        { error: 'AI 响应超时（30秒），请重试。' },
        { status: 504 }
      );
    }

    // Content moderation or other errors
    if (err.status === 400 || err.status === 403) {
      return NextResponse.json(
        { error: '当前输入无法处理，请调整内容后重试。' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'AI 服务异常，请稍后重试。' },
      { status: 500 }
    );
  }
}
