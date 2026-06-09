import { NextRequest, NextResponse } from 'next/server';

const ARK_API_KEY = process.env.ARK_API_KEY;
const ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

export async function POST(req: NextRequest) {
  if (!ARK_API_KEY) {
    return NextResponse.json(
      { error: 'ARK_API_KEY 未配置。请在 .env.local 中设置 ARK_API_KEY。' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { prompt, model = 'doubao-seedream-5-0-260128' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt' },
        { status: 400 }
      );
    }

    const response = await fetch(ARK_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        size: '2K',
        output_format: 'png',
        watermark: false,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Image API error:', response.status, errText);
      return NextResponse.json(
        { error: `生图服务异常 (${response.status})，请检查模型配置或稍后重试。` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: '生图服务未返回图片 URL，请重试。' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: imageUrl });
  } catch (err: any) {
    console.error('Image API Error:', err);
    return NextResponse.json(
      { error: err.message || '生图服务异常，请稍后重试。' },
      { status: 500 }
    );
  }
}
