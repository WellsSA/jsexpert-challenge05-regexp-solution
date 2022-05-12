'use strict';

const { readFile } = require('fs/promises');
const { join } = require('path');

const TextProcessorFacade = require('./textProcessorFacade');

(async () => {
  const filePath = join(__dirname, './../docs/projeto-de-lei.csv');
  const dataBuffer = await readFile(join(__dirname, filePath));
  const data = dataBuffer.toString();

  const instance = new TextProcessorFacade(data);
  const projects = instance.getProjectsFromCSV();
  console.log('projects', projects);
})();
