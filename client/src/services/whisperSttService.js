import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js for web browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

class WhisperSTTService {
  constructor() {
    this.pipeline = null;
    this.status = 'uninitialized'; // 'uninitialized' | 'loading' | 'ready' | 'error'
    this.modelName = 'Xenova/whisper-tiny';
    this.listeners = new Set();
    this.audioContext = null;
  }

  subscribeStatus(listener) {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  notifyStatus(status) {
    console.log(`[WhisperSTT] Status updated to: ${status}`);
    this.status = status;
    this.listeners.forEach((l) => l(status));
  }

  async initWhisper(onProgress) {
    if (this.status === 'ready' && this.pipeline) {
      console.log('[WhisperSTT] Engine already initialized and ready.');
      return true;
    }
    if (this.status === 'loading') {
      console.log('[WhisperSTT] Engine is currently loading...');
      return false;
    }

    try {
      console.log(`[WhisperSTT] Initializing ONNX model pipeline (${this.modelName})...`);
      this.notifyStatus('loading');
      this.pipeline = await pipeline('automatic-speech-recognition', this.modelName, {
        progress_callback: (progressInfo) => {
          if (progressInfo.status === 'progress') {
            const percent = Math.round(progressInfo.progress || 0);
            console.log(`[WhisperSTT] Model download/load progress: ${percent}%`);
            if (onProgress) onProgress(percent);
          }
        },
      });
      console.log('[WhisperSTT] Whisper ONNX model pipeline loaded successfully!');
      this.notifyStatus('ready');
      return true;
    } catch (err) {
      console.error('[WhisperSTT] Initialization failed:', err);
      this.notifyStatus('error');
      return false;
    }
  }

  /**
   * Helper to convert an Audio Blob into a 16kHz Float32Array for Whisper processing
   */
  async blobTo16kHzFloat32Array(audioBlob) {
    console.log(`[WhisperSTT] Decoding audio blob (${audioBlob.size} bytes, type: ${audioBlob.type})...`);
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    console.log(`[WhisperSTT] Audio decoded: ${audioBuffer.duration.toFixed(2)}s duration, ${audioBuffer.numberOfChannels} channel(s)`);

    // Resample if needed to 16kHz mono
    const offlineContext = new OfflineAudioContext(1, audioBuffer.duration * 16000, 16000);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const resampledBuffer = await offlineContext.startRendering();
    const channelData = resampledBuffer.getChannelData(0);
    console.log(`[WhisperSTT] Resampled audio to 16kHz mono float32 (length: ${channelData.length} samples)`);
    return channelData;
  }

  /**
   * Transcribe recorded audio blob
   */
  async transcribe(audioBlob, language = 'hi') {
    console.log(`[WhisperSTT] Starting transcription (language: ${language})...`);
    if (this.status !== 'ready' || !this.pipeline) {
      console.log('[WhisperSTT] Pipeline not ready, attempting initialization on demand...');
      const initialized = await this.initWhisper();
      if (!initialized) {
        throw new Error('Whisper model not initialized');
      }
    }

    try {
      const audioData = await this.blobTo16kHzFloat32Array(audioBlob);
      const langMap = { hi: 'hindi', en: 'english', hinglish: 'hindi' };
      const targetLang = langMap[language] || 'hindi';

      console.log(`[WhisperSTT] Running ONNX inference with target language: ${targetLang}...`);
      const output = await this.pipeline(audioData, {
        language: targetLang,
        task: 'transcribe',
      });

      const transcribedText = output?.text ? output.text.trim() : '';
      console.log(`[WhisperSTT] Inference complete! Transcribed result: "${transcribedText}"`);

      return {
        text: transcribedText,
        engine: 'WHISPER_CLIENT',
      };
    } catch (err) {
      console.error('[WhisperSTT] Transcription error:', err);
      throw err;
    }
  }
}

export const whisperSttService = new WhisperSTTService();
