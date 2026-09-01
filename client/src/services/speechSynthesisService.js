class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.rate = 0.95; // Slightly slower for clear hospital audio instructions
  }

  speak(text, lang = 'hi-IN', rate = 0.95) {
    if (!this.synth) return;

    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = rate;

    // Find suitable voice if available
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.lang.includes(lang === 'hi' ? 'hi' : 'en'));
    if (voice) utterance.voice = voice;

    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth) this.synth.pause();
  }

  resume() {
    if (this.synth) this.synth.resume();
  }

  cancel() {
    if (this.synth) this.synth.cancel();
  }
}

export const ttsService = new SpeechSynthesisService();
