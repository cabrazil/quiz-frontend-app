export class SoundManager {
  private static instance: SoundManager;
  private tickSound: HTMLAudioElement | null = null;
  private successSound: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private readonly MAX_TIME = 10;
  private soundTimeout: number | null = null;

  private constructor() {
    this.initializeSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeSounds() {
    this.tickSound = new Audio('/sounds/tick.mp3');
    this.tickSound.volume = 0.3;

    this.successSound = new Audio('/sounds/success.mp3');
    this.successSound.volume = 0.4;
  }

  private stopSound() {
    if (this.tickSound) {
      this.tickSound.pause();
      this.tickSound.currentTime = 0;
    }
    if (this.successSound) {
      this.successSound.pause();
      this.successSound.currentTime = 0;
    }
    if (this.soundTimeout) {
      clearTimeout(this.soundTimeout);
      this.soundTimeout = null;
    }
  }

  public playTick(timeLeft: number) {
    if (!this.isMuted && this.tickSound && timeLeft <= this.MAX_TIME) {
      // Para qualquer som anterior que esteja tocando
      this.stopSound();

      // Toca o novo som
      this.tickSound.currentTime = 0;
      this.tickSound.play().catch(() => {
        // Ignora erros de autoplay
      });

      // Garante que o som será parado após 500ms
      this.soundTimeout = window.setTimeout(() => {
        this.stopSound();
      }, 500);
    }
  }

  public playSuccess() {
    if (!this.isMuted && this.successSound) {
      // Para qualquer som anterior que esteja tocando
      this.stopSound();

      // Toca o som de sucesso
      this.successSound.currentTime = 0;
      this.successSound.play().catch(() => {
        // Ignora erros de autoplay
      });
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSound();
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
} 