const { getAIProvider } = require('./aiServiceFactory');

class DocumentAIService {
  async process(fileBuffer, fileMetadata) {
    const provider = getAIProvider();
    return await provider.processDocumentOCR(fileBuffer, fileMetadata);
  }
}

module.exports = new DocumentAIService();
