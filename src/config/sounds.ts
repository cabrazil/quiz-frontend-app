import successWav from '../assets/sounds/success.wav';
import transitionWav from '../assets/sounds/transition.wav';
import tickWav from '../assets/sounds/tick.wav';

export const SOUND_CONFIG = {
  success: {
    sources: [
      { src: successWav, type: 'audio/wav' }
    ],
    volume: 0.5
  },
  transition: {
    sources: [
      { src: transitionWav, type: 'audio/wav' }
    ],
    volume: 0.5
  },
  tick: {
    sources: [
      { src: tickWav, type: 'audio/wav' }
    ],
    volume: 0.3
  }
};

export type SoundName = keyof typeof SOUND_CONFIG;

export interface SoundSource {
  src: string;
  type: string;
}

export interface SoundConfig {
  sources: SoundSource[];
  volume: number;
} 