const { getAIProvider } = require('./aiServiceFactory');

class SummaryService {
  async generate(session, answers, documents, mode) {
    const provider = getAIProvider();
    return await provider.generateClinicalSummary(session, answers, documents, mode);
  }
}

module.exports = new SummaryService();
