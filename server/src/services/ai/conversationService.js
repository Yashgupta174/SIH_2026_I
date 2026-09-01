const { getAIProvider } = require('./aiServiceFactory');

class ConversationService {
  async getNextQuestion(sessionState, lastAnswer) {
    const provider = getAIProvider();
    return await provider.getNextQuestion(sessionState, lastAnswer);
  }
}

module.exports = new ConversationService();
