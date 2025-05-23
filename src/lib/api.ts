import { MusicGenerationRequest, MusicGenerationResponse } from '../types/music';

export class MusicAPI {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  static async generateMusic(options: MusicGenerationRequest): Promise<MusicGenerationResponse> {
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: options.lyrics,
          style: options.style,
          tempo: options.tempo,
          mood: options.mood,
          duration: options.duration || 30
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate music');
      }

      return response.json();
    } catch (error) {
      console.error('Music generation error:', error);
      throw error;
    }
  }
} 