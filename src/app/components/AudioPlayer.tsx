import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { MusicPlayerState } from '@/types/music';

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
}

export default function AudioPlayer({ audioUrl, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newVolume = playerState.volume === 0 ? 1 : 0;
    audioRef.current.volume = newVolume;
    
    setPlayerState(prev => ({
      ...prev,
      volume: newVolume,
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    
    setPlayerState(prev => ({
      ...prev,
      currentTime: newTime,
    }));
  };

  return (
    <div className={`flex flex-col gap-2 p-4 bg-gray-100 rounded-lg ${className}`}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          {playerState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          {playerState.volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        
        <input
          type="range"
          min={0}
          max={playerState.duration}
          value={playerState.currentTime}
          onChange={handleTimeChange}
          className="flex-1"
        />
        
        <span className="text-sm text-gray-600">
          {Math.floor(playerState.currentTime)} / {Math.floor(playerState.duration)}
        </span>
      </div>
    </div>
  );
} 