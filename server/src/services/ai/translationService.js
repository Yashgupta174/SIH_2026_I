const { getAIProvider } = require('./aiServiceFactory');

class TranslationService {
  async translate(text, targetLanguage) {
    const provider = getAIProvider();
    return await provider.translateText(text, targetLanguage);
  }
}

module.exports = new TranslationService();
