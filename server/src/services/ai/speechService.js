const { getAIProvider } = require('./aiServiceFactory');

class SpeechService {
  async transcribe(audioBuffer, language = 'hi') {
    const provider = getAIProvider();
    return await provider.transcribeAudio(audioBuffer, language);
  }
}

module.exports = new SpeechService();
