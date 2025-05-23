import { NextResponse } from 'next/server';
import { MusicGenerationRequest, MusicGenerationResponse } from '@/types/music';

// 添加 CORS 头信息
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 处理 OPTIONS 请求
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 处理 GET 请求
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as MusicGenerationRequest;
    const { lyrics, style, tempo, mood, duration } = body;

    // 构建提示词
    const prompt = `Generate a ${style} music with ${tempo} tempo and ${mood} mood based on these lyrics: ${lyrics}`;

    // 调用 Stability AI API
    const response = await fetch('https://api.stability.ai/v1/generation/stable-audio-1.0/text-to-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompt: prompt,
        duration: duration,
        cfg_scale: 7,
        seed: Math.floor(Math.random() * 1000000),
        output_format: 'mp3'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Stability AI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate music' },
        { status: response.status }
      );
    }

    const audioData = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioData).toString('base64');

    const responseData: MusicGenerationResponse = {
      id: Date.now().toString(),
      status: 'succeeded',
      created_at: new Date().toISOString(),
      audio: `data:audio/mp3;base64,${base64Audio}`,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error generating music:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 