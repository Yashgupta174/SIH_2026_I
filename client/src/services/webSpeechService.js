class WebSpeechService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  startListening(lang = 'hi-IN', onResult, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (onResult) onResult(transcript, event.results[0].isFinal);
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.log('Speech recognition already started');
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }
}

export const sttService = new WebSpeechService();
