export interface MusicGenerationRequest {
  lyrics: string;
  style: string;
  tempo: string;
  mood: string;
  duration?: number;
}

export interface MusicGenerationResponse {
  success: boolean;
  data?: {
    id: string;
    status: 'succeeded' | 'failed';
    audioUrl?: string;
    prompt?: string;
    seed?: number;
    created_at: string;
  };
  error?: string;
}

export interface MusicGenerationStatus {
  success: boolean;
  data?: {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    audioUrl?: string;
    error?: string;
    logs?: string;
    created_at: string;
    completed_at?: string;
  };
  error?: string;
}

export interface MusicPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
}

export interface MusicGenerationError {
  code: string;
  message: string;
  details?: any;
}

export interface MusicGenerationProgress {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: MusicGenerationError;
} 