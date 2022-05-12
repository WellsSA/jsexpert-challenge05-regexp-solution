const { evaluateRegex } = require('./util');

class Project {
  constructor({ título, link, autor, indexadoresnorma }) {
    // id extraction
    const idRegex = evaluateRegex(/(?<=id=).*/);
    this.id = link.match(idRegex).join();

    // numero/ano extraction
    const numeroAnoRegex = evaluateRegex(/(?<=lei )([^\/]*).(.*)$/);
    const [_, numero, ano] = título.match(numeroAnoRegex);
    this.numero = numero;
    this.ano = ano;

    // autores
    const firstNameRegex = evaluateRegex(/[^\s].*?[^\s]*/i);
    const lastNameRegex = evaluateRegex(/[^\s]+$/i);
    this.autores = autor.split(',').map(nome => {
      const firstName = nome.match(firstNameRegex).join();
      const lastName = nome.match(lastNameRegex).join();
      return {
        nome: `${firstName} ${lastName}`,
      };
    });

    // url
    this.url = link;

    // indexadores
    const separatorsRegex = evaluateRegex(/,[|\s]/gi);
    this.indexadores =
      (indexadoresnorma && indexadoresnorma.split(separatorsRegex)) || [];
  }
}

module.exports = Project;
