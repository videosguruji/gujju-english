import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { GEMINI_MODEL } from '../constants';
import { decodeBase64, encodeBase64, float32ToInt16PCM, decodeAudioData } from './audioUtils';

export interface GeminiLiveConfig {
  systemInstruction: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
  onVolumeChange?: (volume: number) => void; // For visualizer
}

export class GeminiLiveService {
  private client: GoogleGenAI;
  private session: Promise<any> | null = null;
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private nextStartTime = 0;
  private activeSources = new Set<AudioBufferSourceNode>();
  private config: GeminiLiveConfig;

  constructor(config: GeminiLiveConfig) {
    this.config = config;
    this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async connect() {
    try {
      // 1. Setup Audio Contexts
      this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // 2. Get Microphone Access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Connect to Gemini Live
      const sessionPromise = this.client.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: this.config.systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            this.config.onOpen?.();
            this.startMicrophoneStream(sessionPromise);
          },
          onmessage: (msg: LiveServerMessage) => this.handleMessage(msg),
          onclose: () => {
            console.log('Gemini Live Closed');
            this.config.onClose?.();
          },
          onerror: (err) => {
            console.error('Gemini Live Error', err);
            this.config.onError?.(new Error(err.toString()));
          },
        },
      });
      
      this.session = sessionPromise;
      await sessionPromise;

    } catch (error) {
      console.error('Connection failed', error);
      this.config.onError?.(error as Error);
    }
  }

  private startMicrophoneStream(sessionPromise: Promise<any>) {
    if (!this.inputContext || !this.stream) return;

    this.source = this.inputContext.createMediaStreamSource(this.stream);
    this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate volume
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.config.onVolumeChange?.(rms);

      // Send to Gemini
      const pcmData = float32ToInt16PCM(inputData);
      const base64Data = encodeBase64(new Uint8Array(pcmData.buffer));

      sessionPromise.then((session) => {
        session.sendRealtimeInput({
          media: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio && this.outputContext) {
      const pcmData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(pcmData, this.outputContext, 24000, 1);
      this.playAudioBuffer(audioBuffer);
    }

    if (message.serverContent?.interrupted) {
      this.stopAllAudio();
    }
  }

  private playAudioBuffer(buffer: AudioBuffer) {
    if (!this.outputContext) return;

    const source = this.outputContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputContext.destination);
    
    const currentTime = this.outputContext.currentTime;
    const startTime = Math.max(this.nextStartTime, currentTime);
    
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
    
    this.activeSources.add(source);
    source.onended = () => {
      this.activeSources.delete(source);
    };
  }

  private stopAllAudio() {
    this.activeSources.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    this.activeSources.clear();
    this.nextStartTime = 0;
  }

  async disconnect() {
    // 1. Close session to free up WebSocket/Network resources
    if (this.session) {
      const currentSession = this.session;
      this.session = null; // Prevent race conditions
      try {
        const session = await currentSession;
        session.close();
      } catch (error) {
        console.warn('Error closing Gemini Live session:', error);
      }
    }
    
    this.stopAllAudio();

    // 2. Cleanup Audio Nodes
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // 3. Close Contexts
    if (this.inputContext) {
      try { await this.inputContext.close(); } catch(e) { console.warn(e); }
      this.inputContext = null;
    }
    if (this.outputContext) {
      try { await this.outputContext.close(); } catch(e) { console.warn(e); }
      this.outputContext = null;
    }
  }
}
