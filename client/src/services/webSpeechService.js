import { whisperSttService } from './whisperSttService';

class UnifiedSpeechService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      console.log('[UnifiedSpeech] Native Browser Web Speech API initialized.');
    } else {
      console.warn('[UnifiedSpeech] Browser Web Speech API (SpeechRecognition) is not supported on this browser.');
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentMode = 'AUTO'; // 'AUTO' | 'WHISPER' | 'WEB_SPEECH'
    this.isRecordingAudio = false;
  }

  isWebSpeechSupported() {
    return !!this.recognition;
  }

  setMode(mode) {
    console.log(`[UnifiedSpeech] Mode set to: ${mode}`);
    this.currentMode = mode;
  }

  getMode() {
    return this.currentMode;
  }

  /**
   * Primary voice listening method supporting both Web Speech API (real-time stream)
   * and Audio Recording for client-side Whisper STT.
   */
  async startListening(lang = 'hi', onResult, onError, onEnd, onEngineInfo) {
    const isHindi = lang === 'hi' || lang === 'hi-IN';
    console.log(`[UnifiedSpeech] startListening called (mode: ${this.currentMode}, lang: ${lang})`);

    // 1. Try Whisper AI Engine if requested or AUTO mode
    if (this.currentMode === 'WHISPER' || (this.currentMode === 'AUTO' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      try {
        console.log('[UnifiedSpeech] Requesting microphone access for MediaRecorder audio streaming...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.isRecordingAudio = true;

        if (onEngineInfo) onEngineInfo({ engine: 'WHISPER_CLIENT', label: 'Whisper AI (Client-Side)' });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
            console.log(`[UnifiedSpeech] Audio chunk recorded: ${event.data.size} bytes`);
          }
        };

        this.mediaRecorder.onstop = async () => {
          this.isRecordingAudio = false;
          console.log('[UnifiedSpeech] MediaRecorder stopped. Releasing microphone tracks...');
          stream.getTracks().forEach((track) => track.stop());

          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          console.log(`[UnifiedSpeech] Total audio blob recorded: ${audioBlob.size} bytes. Initiating transcription...`);

          try {
            if (onEngineInfo) onEngineInfo({ engine: 'WHISPER_CLIENT', label: 'Processing Whisper AI...' });
            const result = await whisperSttService.transcribe(audioBlob, isHindi ? 'hi' : 'en');
            console.log('[UnifiedSpeech] Whisper transcription result:', result);
            if (onResult) onResult(result.text, true);
          } catch (err) {
            console.warn('[UnifiedSpeech] Whisper STT failed or threw error. Switching to Web Speech API fallback:', err);
            if (this.isWebSpeechSupported()) {
              this.fallbackWebSpeech(isHindi ? 'hi-IN' : 'en-IN', onResult, onError, onEnd, onEngineInfo);
              return;
            } else if (onError) {
              onError('Voice processing error: ' + (err.message || 'Failed to transcribe audio.'));
            }
          }
          if (onEnd) onEnd();
        };

        this.mediaRecorder.start(250); // Collect data every 250ms
        console.log('[UnifiedSpeech] MediaRecorder started listening.');
        return;
      } catch (err) {
        console.warn('[UnifiedSpeech] Microphone stream error for Whisper. Falling back to Web Speech API:', err);
      }
    }

    // 2. Default to Browser Web Speech API
    this.fallbackWebSpeech(isHindi ? 'hi-IN' : 'en-IN', onResult, onError, onEnd, onEngineInfo);
  }

  fallbackWebSpeech(langCode, onResult, onError, onEnd, onEngineInfo) {
    console.log(`[UnifiedSpeech] Initiating Native Web Speech API fallback (langCode: ${langCode})...`);
    if (!this.recognition) {
      console.error('[UnifiedSpeech] Web Speech API unavailable in browser.');
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    if (onEngineInfo) onEngineInfo({ engine: 'WEB_SPEECH', label: 'Web Speech API (Native Browser)' });

    this.recognition.lang = langCode;

    this.recognition.onstart = () => {
      console.log('[UnifiedSpeech] Web Speech Recognition engine started listening.');
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log(`[UnifiedSpeech] Web Speech result (isFinal: ${event.results[0]?.isFinal}): "${transcript}"`);
      if (onResult) onResult(transcript, event.results[0]?.isFinal);
    };

    this.recognition.onerror = (event) => {
      console.error('[UnifiedSpeech] Web Speech Recognition error event:', event.error);
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      console.log('[UnifiedSpeech] Web Speech Recognition session ended.');
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.log('[UnifiedSpeech] Web Speech recognition already active:', e.message);
    }
  }

  stopListening() {
    console.log('[UnifiedSpeech] stopListening called');
    if (this.mediaRecorder && this.isRecordingAudio && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
        console.log('[UnifiedSpeech] Stopping MediaRecorder...');
      } catch (e) {}
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
        console.log('[UnifiedSpeech] Stopping Web Speech Recognition...');
      } catch (e) {}
    }
  }
}

export const sttService = new UnifiedSpeechService();
