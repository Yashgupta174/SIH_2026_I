const { getAIProvider } = require('./aiServiceFactory');

class ClinicalExtractionService {
  async extract(text, context) {
    const provider = getAIProvider();
    return await provider.extractClinicalEntities(text, context);
  }
}

module.exports = new ClinicalExtractionService();
