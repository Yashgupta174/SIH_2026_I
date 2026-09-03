const clinicalIntakeAgent = require('./clinicalIntakeAgent');
const MockAIProvider = require('./mockAIProvider');
const GeminiLangChainProvider = require('./geminiLangChainProvider');
const logger = require('../../utils/logger');

let activeProviderInstance = null;

const getAIProvider = () => {
  if (activeProviderInstance) return activeProviderInstance;

  const providerType = (process.env.AI_PROVIDER || 'MOCK').toUpperCase();
  const hasGeminiKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

  if (providerType === 'GEMINI' || (providerType === 'REAL' && hasGeminiKey)) {
    logger.info('Initializing GeminiLangChainProvider (Google Gemini API + LangChain)');
    activeProviderInstance = new GeminiLangChainProvider();
  } else {
    logger.info('Initializing MockAIProvider for clinical safety & offline/SIH demo operation');
    activeProviderInstance = new MockAIProvider();
  }

  return activeProviderInstance;
};

module.exports = {
  getAIProvider,
  clinicalIntakeAgent,
};
