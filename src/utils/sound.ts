import { SOUND_CONFIG, SoundName } from '../config/sounds';

export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<SoundName, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {
    // Tenta inicializar os sons imediatamente
    this.initializeSounds().catch(error => {
      console.error('Erro na inicialização inicial dos sons:', error);
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeSounds() {
    if (this.isInitialized) return;

    try {
      console.log('Iniciando carregamento dos sons...');

      for (const [soundName, config] of Object.entries(SOUND_CONFIG)) {
        let audioLoaded = false;

        // Tenta carregar cada fonte de áudio até conseguir
        for (const source of config.sources) {
          try {
            console.log(`Configuração do som ${soundName}:`, {
              src: source.src,
              type: source.type,
              volume: config.volume,
              baseURL: window.location.origin,
              fullPath: new URL(source.src, window.location.href).href
            });

            const audio = new Audio();
            
            // Configura manipuladores de eventos antes de definir src
            audio.addEventListener('loadstart', () => {
              console.log(`Evento loadstart disparado para ${soundName}`, {
                currentSrc: audio.currentSrc,
                src: audio.src,
                readyState: audio.readyState,
                networkState: audio.networkState
              });
            });

            audio.addEventListener('durationchange', () => {
              console.log(`Evento durationchange disparado para ${soundName}`, {
                duration: audio.duration,
                readyState: audio.readyState
              });
            });

            audio.addEventListener('loadedmetadata', () => {
              console.log(`Evento loadedmetadata disparado para ${soundName}`, {
                duration: audio.duration,
                readyState: audio.readyState
              });
            });

            audio.addEventListener('loadeddata', () => {
              console.log(`Evento loadeddata disparado para ${soundName}`, {
                readyState: audio.readyState,
                networkState: audio.networkState
              });
            });

            audio.addEventListener('progress', () => {
              console.log(`Evento progress disparado para ${soundName}`, {
                buffered: audio.buffered.length > 0 ? {
                  start: audio.buffered.start(0),
                  end: audio.buffered.end(0)
                } : null,
                readyState: audio.readyState
              });
            });

            audio.addEventListener('canplay', () => {
              console.log(`Evento canplay disparado para ${soundName}`, {
                readyState: audio.readyState,
                networkState: audio.networkState,
                paused: audio.paused
              });
            });

            audio.addEventListener('canplaythrough', () => {
              console.log(`Evento canplaythrough disparado para ${soundName}`, {
                readyState: audio.readyState,
                networkState: audio.networkState,
                duration: audio.duration
              });
            });

            audio.addEventListener('error', (e) => {
              const error = e.target as HTMLAudioElement;
              console.error(`Erro ao carregar som ${soundName}:`, {
                error: error.error,
                networkState: error.networkState,
                readyState: error.readyState,
                src: error.src,
                currentSrc: error.currentSrc,
                crossOrigin: error.crossOrigin,
                errorCode: error.error ? error.error.code : null,
                errorMessage: error.error ? error.error.message : null
              });
            });

            // Configura o áudio
            audio.preload = 'auto';
            audio.volume = config.volume;
            
            console.log(`Tentando carregar o som ${soundName}...`);
            
            // Tenta carregar o som
            await new Promise<void>((resolve, reject) => {
              const fullPath = new URL(source.src, window.location.href).href;
              console.log(`Caminho completo do áudio ${soundName}:`, fullPath);
              
              audio.src = fullPath;
              
              const onCanPlay = () => {
                console.log(`Som ${soundName} carregado com sucesso`, {
                  duration: audio.duration,
                  readyState: audio.readyState,
                  networkState: audio.networkState,
                  currentSrc: audio.currentSrc
                });
                audio.removeEventListener('canplaythrough', onCanPlay);
                audio.removeEventListener('error', onError);
                resolve();
              };

              const onError = () => {
                console.error(`Falha ao carregar o som ${soundName}`, {
                  error: audio.error,
                  networkState: audio.networkState,
                  readyState: audio.readyState,
                  src: audio.src,
                  currentSrc: audio.currentSrc
                });
                audio.removeEventListener('canplaythrough', onCanPlay);
                audio.removeEventListener('error', onError);
                reject(new Error(`Falha ao carregar o som ${soundName}`));
              };

              audio.addEventListener('canplaythrough', onCanPlay);
              audio.addEventListener('error', onError);
              
              audio.load();
            });

            this.sounds.set(soundName as SoundName, audio);
            console.log(`Inicialização do som ${soundName} concluída com sucesso`, {
              duration: audio.duration,
              readyState: audio.readyState,
              networkState: audio.networkState,
              currentSrc: audio.currentSrc,
              volume: audio.volume,
              muted: audio.muted
            });

            audioLoaded = true;
            break; // Sai do loop se conseguiu carregar
          } catch (error) {
            console.error(`Erro ao carregar o som ${soundName} com fonte ${source.src}:`, error);
            continue; // Tenta a próxima fonte
          }
        }

        if (!audioLoaded) {
          console.error(`Não foi possível carregar nenhuma fonte do som ${soundName}`);
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar sons:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      console.log('Sons não inicializados, tentando inicializar...');
      await this.initializeSounds();
    }
  }

  private async playSound(soundName: SoundName) {
    try {
      await this.ensureInitialized();
      
      if (this.isMuted) return;

      const audio = this.sounds.get(soundName);
      if (!audio) {
        console.error(`Som ${soundName} não encontrado`);
        return;
      }

      console.log(`Estado do áudio ${soundName} antes de tocar:`, {
        currentTime: audio.currentTime,
        duration: audio.duration,
        readyState: audio.readyState,
        paused: audio.paused,
        networkState: audio.networkState,
        currentSrc: audio.currentSrc,
        volume: audio.volume,
        muted: audio.muted
      });

      // Reseta o som para o início
      audio.currentTime = 0;
      
      console.log(`Tentando tocar o som ${soundName}...`);
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Som ${soundName} começou a tocar com sucesso`, {
              currentTime: audio.currentTime,
              duration: audio.duration,
              paused: audio.paused
            });
          })
          .catch(error => {
            console.error(`Erro durante a reprodução do som ${soundName}:`, error);
          });
      }
    } catch (error) {
      console.error(`Erro ao tocar o som ${soundName}:`, error);
    }
  }

  public async playSuccess() {
    await this.playSound('success');
  }

  public async playTransition() {
    await this.playSound('transition');
  }

  public async playTick(timeLeft: number) {
    // Só toca o som de tick quando faltam 5 segundos ou menos
    if (timeLeft <= 5) {
      await this.playSound('tick');
    }
  }

  public async toggleMute() {
    await this.ensureInitialized();
    this.isMuted = !this.isMuted;
    for (const audio of this.sounds.values()) {
      audio.muted = this.isMuted;
    }
    console.log('Sons ' + (this.isMuted ? 'mutados' : 'desmutados'));
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
} 