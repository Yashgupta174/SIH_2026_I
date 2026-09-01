const MockAIProvider = require('./mockAIProvider');
const RealAIProvider = require('./realAIProvider');
const logger = require('../../utils/logger');

let activeProviderInstance = null;

const getAIProvider = () => {
  if (activeProviderInstance) return activeProviderInstance;

  const providerType = process.env.AI_PROVIDER || 'MOCK';

  if (providerType === 'REAL' && process.env.AI_API_KEY) {
    logger.info('Initializing RealAIProvider with API key');
    activeProviderInstance = new RealAIProvider();
  } else {
    logger.info('Initializing MockAIProvider for clinical safety & offline/SIH demo operation');
    activeProviderInstance = new MockAIProvider();
  }

  return activeProviderInstance;
};

module.exports = { getAIProvider };
