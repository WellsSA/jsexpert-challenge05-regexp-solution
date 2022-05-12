const TextProcessorFluentAPI = require('./textProcessorFluentAPI');

class TextProcessorFacade {
  #textProcessorFluentAPI;
  constructor(text) {
    this.#textProcessorFluentAPI = new TextProcessorFluentAPI(text);
  }

  getProjectsFromCSV() {
    return this.#textProcessorFluentAPI
      .extractHeaders()
      .extractContent()
      .splitValues()
      .mapRawObjects()
      .mapProjects()
      .build();
  }
}

module.exports = TextProcessorFacade;
