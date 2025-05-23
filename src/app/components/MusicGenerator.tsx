'use client';

import React, { useState } from 'react';
import { Music, Play, Pause, Download, Loader2, Volume2, Settings } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { MusicAPI } from '@/lib/api';
import { MusicGenerationRequest } from '@/types/music';
import LoadingSpinner from './LoadingSpinner';

interface GeneratedMusic {
  id: string;
  audioUrl: string;
  lyrics: string;
  title: string;
  style: string;
  status: 'generating' | 'completed' | 'failed';
}

export default function MusicGenerator() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('pop');
  const [tempo, setTempo] = useState('medium');
  const [mood, setMood] = useState('happy');
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const musicStyles = [
    'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip-Hop', 
    'Folk', 'Blues', 'Country', 'R&B'
  ];

  const tempos = ['Slow', 'Medium', 'Fast'];
  const moods = ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Epic'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAudioUrl(null);
    setIsGenerating(true);

    try {
      const response = await MusicAPI.generateMusic({
        lyrics,
        style,
        tempo,
        mood,
        duration
      });

      if (response.success && response.data.audioUrl) {
        setAudioUrl(response.data.audioUrl);
      } else {
        throw new Error(response.error || '生成失败');
      }
    } catch (error) {
      console.error('Music generation error:', error);
      setError(error instanceof Error ? error.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = (musicId: string) => {
    if (currentPlaying === musicId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(musicId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">AI音乐生成器</h1>
          </div>
          <p className="text-gray-300 text-lg">输入歌词，让AI为你创作独特的音乐</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              创作设置
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">歌词</label>
                <textarea
                  className="w-full h-32 p-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="在这里输入你的歌词..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-white font-medium mb-2">音乐风格</label>
                  <select
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    {musicStyles.map(s => (
                      <option key={s} value={s.toLowerCase()} className="bg-gray-800">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">节奏</label>
                  <select
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={tempo}
                    onChange={(e) => setTempo(e.target.value)}
                  >
                    {tempos.map(t => (
                      <option key={t} value={t.toLowerCase()} className="bg-gray-800">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">情绪</label>
                  <select
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    {moods.map(m => (
                      <option key={m} value={m.toLowerCase()} className="bg-gray-800">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">时长（秒）</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={10}
                    max={30}
                    className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">生成中...</span>
                  </div>
                ) : (
                  <>
                    <Music className="w-5 h-5 mr-2" />
                    生成音乐
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 生成结果区域 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Volume2 className="w-6 h-6 mr-2" />
              生成结果
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <AudioPlayer
                    audioUrl={audioUrl}
                    title={`AI生成 - ${style}风格`}
                    isPlaying={currentPlaying === audioUrl}
                    onPlayPause={() => togglePlay(audioUrl)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">使用说明</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-2">如何使用：</h4>
              <ul className="space-y-1 text-sm">
                <li>• 在左侧输入你想要的歌词</li>
                <li>• 选择音乐风格、节奏和情绪</li>
                <li>• 点击"生成音乐"按钮</li>
                <li>• 等待AI为你创作独特的音乐</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">提示：</h4>
              <ul className="space-y-1 text-sm">
                <li>• 歌词越详细，生成效果越好</li>
                <li>• 可以尝试不同的风格组合</li>
                <li>• 生成的音乐可以下载保存</li>
                <li>• 支持多种音乐风格和情绪</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 