const { evaluateRegex } = require('./util');
const Project = require('./project');

class TextProcessorFluentAPI {
  #content;
  constructor(content) {
    this.#content = content;
  }
  extractHeaders() {
    const matchHeaders = evaluateRegex(/(?:(?!\n).)*/);
    // to not include the \n, thats also an option => (?:(?!\n).)*

    const [headers] = this.#content.match(matchHeaders);

    this.#content = {
      headers: headers,
      content: this.#content,
    };

    return this;
  }

  extractContent() {
    const { content } = this.#content;

    const matchContent = evaluateRegex(/(?<=\n).*/g);

    const projects = content.match(matchContent);
    this.#content.content = projects;

    return this;
  }

  splitValues() {
    const { headers, content } = this.#content;

    const matchSeparators = evaluateRegex(/;/);

    this.#content = {
      headers: headers.split(matchSeparators).filter(value => !!value),
      content: content.map(project =>
        project.split(matchSeparators).filter(value => !!value)
      ),
    };

    return this;
  }

  mapRawObjects() {
    const { headers, content } = this.#content;

    this.#content = content.map(projectArr => {
      return projectArr.reduce((finalObject, field, index) => {
        finalObject[headers[index]] = field;
        return finalObject;
      }, {});
    });

    return this;
  }

  mapProjects() {
    this.#content = this.#content.map(rawProject => new Project(rawProject));
    return this;
  }

  build() {
    return this.#content;
  }
}

module.exports = TextProcessorFluentAPI;
