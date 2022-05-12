const { describe, it } = require('mocha');
const { expect } = require('chai');
const TextProcessorFluentAPI = require('./../src/textProcessorFluentAPI');
const mock = require('./mock/valid');

describe('TextProcessorAPI', () => {
  it('#build', () => {
    const result = new TextProcessorFluentAPI(mock).build();
    expect(result).to.be.deep.equal(mock);
  });

  it('#extractHeaders', () => {
    const result = new TextProcessorFluentAPI(mock).extractHeaders().build();

    const expected = {
      headers: 'título;link;autor;etapa;ementa;indexadoresnorma;',
      content: mock,
    };
    expect(result).to.be.deep.equal(expected);
  });

  it('#extractContent', () => {
    const result = new TextProcessorFluentAPI(mock)
      .extractHeaders()
      .extractContent()
      .build();

    const expected = {
      headers: 'título;link;autor;etapa;ementa;indexadoresnorma;',
      content: [
        'Projeto de lei 584/2016;http://www.al.sp.gov.br/propositura?id=1322563;Jorge Wilson Xerife do Consumidor;PAUTA;Dispõe sobre a inclusão de cláusula nos contratos de adesão aos serviços de telefonia fixa, de telefonia móvel e de banda larga móvel, e dá outras providências.;CONTRATO, OBRIGATORIEDADE, CLÁUSULA, SERVIÇO, TELEFONIA MÓVEL, TELEFONIA FIXA, PRAZO, INCLUSÃO, RESCISÃO CONTRATUAL, LIBERAÇÃO;',
        'Projeto de lei 580/2016;http://www.al.sp.gov.br/propositura?id=1323286;Marcia Lia;PAUTA;Estabelece normas gerais para a realização de Concurso Público pela Administração Pública Direta e Indireta do Estado.;NORMAS, REALIZAÇÃO, CONCURSO PÚBLICO ESTADUAL, ESTADO DE SÃO PAULO, ADMINISTRAÇÃO PÚBLICA DIRETA E INDIRETA;',
        'Projeto de lei 545/2016;http://www.al.sp.gov.br/propositura?id=1322832;Roberto Morais, Itamar Borges;PAUTA;Altera a Lei nº 13.550, de 2009, que dispõe sobre a utilização e proteção da vegetação nativa do Bioma Cerrado no Estado de São Paulo.;',
      ],
    };
    expect(result).to.be.deep.equal(expected);
  });

  it('#splitValues', () => {
    const result = new TextProcessorFluentAPI(mock)
      .extractHeaders()
      .extractContent()
      .splitValues()
      .build();

    const expected = {
      headers: [
        'título',
        'link',
        'autor',
        'etapa',
        'ementa',
        'indexadoresnorma',
      ],
      content: [
        [
          'Projeto de lei 584/2016',
          'http://www.al.sp.gov.br/propositura?id=1322563',
          'Jorge Wilson Xerife do Consumidor',
          'PAUTA',
          'Dispõe sobre a inclusão de cláusula nos contratos de adesão aos serviços de telefonia fixa, de telefonia móvel e de banda larga móvel, e dá outras providências.',
          'CONTRATO, OBRIGATORIEDADE, CLÁUSULA, SERVIÇO, TELEFONIA MÓVEL, TELEFONIA FIXA, PRAZO, INCLUSÃO, RESCISÃO CONTRATUAL, LIBERAÇÃO',
        ],
        [
          'Projeto de lei 580/2016',
          'http://www.al.sp.gov.br/propositura?id=1323286',
          'Marcia Lia',
          'PAUTA',
          'Estabelece normas gerais para a realização de Concurso Público pela Administração Pública Direta e Indireta do Estado.',
          'NORMAS, REALIZAÇÃO, CONCURSO PÚBLICO ESTADUAL, ESTADO DE SÃO PAULO, ADMINISTRAÇÃO PÚBLICA DIRETA E INDIRETA',
        ],
        [
          'Projeto de lei 545/2016',
          'http://www.al.sp.gov.br/propositura?id=1322832',
          'Roberto Morais, Itamar Borges',
          'PAUTA',
          'Altera a Lei nº 13.550, de 2009, que dispõe sobre a utilização e proteção da vegetação nativa do Bioma Cerrado no Estado de São Paulo.',
        ],
      ],
    };
    expect(result).to.be.deep.equal(expected);
  });

  it('#mapRawObjects', () => {
    const result = new TextProcessorFluentAPI(mock)
      .extractHeaders()
      .extractContent()
      .splitValues()
      .mapRawObjects()
      .build();

    const expected = [
      {
        título: 'Projeto de lei 584/2016',
        link: 'http://www.al.sp.gov.br/propositura?id=1322563',
        autor: 'Jorge Wilson Xerife do Consumidor',
        etapa: 'PAUTA',
        ementa:
          'Dispõe sobre a inclusão de cláusula nos contratos de adesão aos serviços de telefonia fixa, de telefonia móvel e de banda larga móvel, e dá outras providências.',
        indexadoresnorma:
          'CONTRATO, OBRIGATORIEDADE, CLÁUSULA, SERVIÇO, TELEFONIA MÓVEL, TELEFONIA FIXA, PRAZO, INCLUSÃO, RESCISÃO CONTRATUAL, LIBERAÇÃO',
      },
      {
        título: 'Projeto de lei 580/2016',
        link: 'http://www.al.sp.gov.br/propositura?id=1323286',
        autor: 'Marcia Lia',
        etapa: 'PAUTA',
        ementa:
          'Estabelece normas gerais para a realização de Concurso Público pela Administração Pública Direta e Indireta do Estado.',
        indexadoresnorma:
          'NORMAS, REALIZAÇÃO, CONCURSO PÚBLICO ESTADUAL, ESTADO DE SÃO PAULO, ADMINISTRAÇÃO PÚBLICA DIRETA E INDIRETA',
      },
      {
        título: 'Projeto de lei 545/2016',
        link: 'http://www.al.sp.gov.br/propositura?id=1322832',
        autor: 'Roberto Morais, Itamar Borges',
        etapa: 'PAUTA',
        ementa:
          'Altera a Lei nº 13.550, de 2009, que dispõe sobre a utilização e proteção da vegetação nativa do Bioma Cerrado no Estado de São Paulo.',
      },
    ];
    expect(result).to.be.deep.equal(expected);
  });

  it('#mapProjects', () => {
    const result = new TextProcessorFluentAPI(mock)
      .extractHeaders()
      .extractContent()
      .splitValues()
      .mapRawObjects()
      .mapProjects()
      .build();

    const expected = [
      {
        id: '1322563',
        numero: '584',
        ano: '2016',
        autores: [
          {
            nome: 'Jorge Consumidor',
          },
        ],
        url: 'http://www.al.sp.gov.br/propositura?id=1322563',
        indexadores: [
          'CONTRATO',
          'OBRIGATORIEDADE',
          'CLÁUSULA',
          'SERVIÇO',
          'TELEFONIA MÓVEL',
          'TELEFONIA FIXA',
          'PRAZO',
          'INCLUSÃO',
          'RESCISÃO CONTRATUAL',
          'LIBERAÇÃO',
        ],
      },
      {
        id: '1323286',
        numero: '580',
        ano: '2016',
        autores: [
          {
            nome: 'Marcia Lia',
          },
        ],
        url: 'http://www.al.sp.gov.br/propositura?id=1323286',
        indexadores: [
          'NORMAS',
          'REALIZAÇÃO',
          'CONCURSO PÚBLICO ESTADUAL',
          'ESTADO DE SÃO PAULO',
          'ADMINISTRAÇÃO PÚBLICA DIRETA E INDIRETA',
        ],
      },
      {
        id: '1322832',
        numero: '545',
        ano: '2016',
        autores: [{ nome: 'Roberto Morais' }, { nome: 'Itamar Borges' }],
        url: 'http://www.al.sp.gov.br/propositura?id=1322832',
        indexadores: [],
      },
    ];
    expect(result).to.be.deep.equal(expected);
  });
});
