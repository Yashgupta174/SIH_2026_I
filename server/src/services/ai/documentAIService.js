const documentOcrService = require('./documentOcrService');

class DocumentAIService {
  async process(fileBuffer, fileMetadata) {
    return await documentOcrService.processDocument(fileBuffer, fileMetadata);
  }
}

module.exports = new DocumentAIService();
