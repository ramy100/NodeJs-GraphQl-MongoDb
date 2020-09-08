const mognoose = require("mongoose");

class MongoFunctions {
  model;

  constructor(model) {
    this.model = model;
  }

  createNewObject(dataObj) {
    return new this.model(dataObj);
  }

  async saveDocument(document) {
    return await document.save();
  }

  async getDocumentById(id) {
    return await this.model.findById(id);
  }

  async getDocumentByValue(queryObject) {
    return await this.model.findOne(queryObject);
  }
}

module.exports = MongoFunctions;
