import { NextRequest, NextResponse } from 'next/server';

// MusicGen模型版本
const MUSICGEN_VERSIONS = {
  'stereo-large': '671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb',
  'stereo-medium': 'b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2ca9',
  'large': '7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906',
  'medium': '5c7279a8211ddf402ca1ac30b9b6f5f3c9dbef2f4b906bf0c27f5c7c4fb4cc2a'
};

interface MusicGenRequest {
  lyrics: string;
  style: string;
  tempo: string;
  mood: string;
  duration?: number;
}

interface StabilityAudioResponse {
  audio: string; // base64 encoded audio
  seed: number;
  text_prompt: string;
}

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
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { lyrics, style, tempo, mood, duration = 30 }: MusicGenRequest = await request.json();
    
    if (!lyrics?.trim()) {
      return NextResponse.json(
        { success: false, error: '歌词不能为空' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // 验证 API 密钥
    if (!process.env.STABILITY_API_KEY) {
      console.error('STABILITY_API_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 构建音乐生成提示词
    const prompt = buildMusicPrompt({ lyrics, style, tempo, mood });
    
    console.log('Generating music with prompt:', prompt);

    // 创建 FormData
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('duration', Math.min(duration, 30).toString());
    formData.append('cfg_scale', '7');
    formData.append('seed', Math.floor(Math.random() * 1000000).toString());
    formData.append('output_format', 'mp3');

    // 打印请求参数用于调试（不包含 API 密钥）
    console.log('Request parameters:', {
      prompt: prompt,
      duration: Math.min(duration, 30),
      cfg_scale: 7,
      seed: Math.floor(Math.random() * 1000000),
      output_format: 'mp3'
    });

    // 创建 Stability AI 音频生成请求
    const response = await fetch('https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'audio/*'
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability AI API error details:', errorData);
      console.error('Request headers:', {
        'Authorization': 'Bearer [HIDDEN]',
        'Accept': 'audio/*'
      });
      throw new Error(`Stability AI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    // 获取音频数据
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      data: {
        id: Date.now().toString(),
        status: 'succeeded',
        audioUrl: `data:audio/mp3;base64,${base64Audio}`,
        prompt,
        created_at: new Date().toISOString()
      }
    }, { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '音乐生成失败'
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// 构建音乐提示词
function buildMusicPrompt({ lyrics, style, tempo, mood }: Omit<MusicGenRequest, 'duration'>) {
  const styleMap: Record<string, string> = {
    'pop': 'upbeat pop',
    'rock': 'energetic rock',
    'jazz': 'smooth jazz',
    'classical': 'orchestral classical',
    'electronic': 'electronic dance',
    'hip-hop': 'hip hop beats',
    'folk': 'acoustic folk',
    'blues': 'soulful blues',
    'country': 'country music',
    'r&b': 'smooth R&B'
  };

  const tempoMap: Record<string, string> = {
    'slow': 'slow tempo',
    'medium': 'medium tempo',
    'fast': 'fast tempo'
  };

  const moodMap: Record<string, string> = {
    'happy': 'uplifting and joyful',
    'sad': 'melancholic and emotional',
    'energetic': 'high energy and dynamic',
    'calm': 'peaceful and relaxing',
    'romantic': 'romantic and tender',
    'epic': 'epic and cinematic'
  };

  const styleDesc = styleMap[style.toLowerCase()] || style;
  const tempoDesc = tempoMap[tempo.toLowerCase()] || tempo;
  const moodDesc = moodMap[mood.toLowerCase()] || mood;

  // 构建详细的提示词
  let prompt = `${styleDesc} music, ${tempoDesc}, ${moodDesc}`;
  
  // 如果歌词不太长，直接包含在提示词中
  if (lyrics.length <= 200) {
    prompt += `, with theme about: ${lyrics}`;
  } else {
    // 如果歌词很长，提取关键词
    const keywords = extractKeywords(lyrics);
    prompt += `, with theme about: ${keywords.join(', ')}`;
  }

  return prompt;
}

// 提取歌词关键词
function extractKeywords(lyrics: string): string[] {
  // 简单的关键词提取逻辑
  const words = lyrics.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // 移除常见停用词
  const stopWords = ['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
  
  const filteredWords = words.filter(word => !stopWords.includes(word));
  
  // 返回前5个关键词
  return filteredWords.slice(0, 5);
} 