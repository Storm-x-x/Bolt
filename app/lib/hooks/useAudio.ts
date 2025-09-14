import { useCallback } from 'react';

export function useAudio() {
  const playAudio = useCallback((audioPath: string) => {
    try {
      const audio = new Audio(audioPath);
      audio.play().catch((error) => {
        console.warn('Audio playback failed:', error);
      });
    } catch (error) {
      console.warn('Audio creation failed:', error);
    }
  }, []);

  const playSuccess = useCallback(() => {
    playAudio('/success.ogg');
  }, [playAudio]);

  const playFailure = useCallback(() => {
    playAudio('/failure.wav');
  }, [playAudio]);

  return {
    playSuccess,
    playFailure,
  };
}