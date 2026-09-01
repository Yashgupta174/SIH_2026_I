const { getAIProvider } = require('./aiServiceFactory');

class RedFlagService {
  async evaluate(answers, chiefComplaint) {
    const provider = getAIProvider();
    return await provider.evaluateRedFlags(answers, chiefComplaint);
  }
}

module.exports = new RedFlagService();
