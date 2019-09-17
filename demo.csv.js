const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyOf,
  between,
  chr,
  eoi,
  lazy,
  many,
  manyExcept,
  manyOrNone,
  not,
  regex,
  sepBy,
  sepByOrNone,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

class CsvParser extends Parser {
  constructor({
    quote = '"',
    delimiter = ';',
    eol = '\n',
    headers = false,
    trim = false,
  } = {}) {
    const delimiterParser = chr(delimiter);
    const eolParser = str(eol);
    const eoiParser = eoi();
    const trimFn = trim ? s => s.trim() : s => s;
    const mapFieldResult = field => field === null ? '' : trimFn(field);

    let fieldParser;

    if (quote === false) {
      fieldParser = manyExcept(
        anyOf([delimiterParser, eolParser]),
      ).map(mapFieldResult);
    } else {
      const quoteParser = chr(quote);
      const escapedQuoteParser = str(`\\${quote}`)
      const betweenQuotesParser = between(quoteParser, quoteParser);

      fieldParser = betweenQuotesParser(
        manyOrNone(
          anyOf([
            escapedQuoteParser,
            not(anyOf([
              quoteParser,
              eolParser,
            ])),
          ]),
        ).map(s => s.join('')),
      ).map(mapFieldResult);
    }

    const lineParser = sepByOrNone(delimiterParser)(fieldParser);
    const linesParser = sepByOrNone(eolParser)(lineParser);

    const csvParser = headers
      ? linesParser
        .map(([headerLine, ...lines]) => {
          const objects = lines.map((line) => line.reduce((acc, field, i) => ({
            ...acc,
            [headerLine[i]]: field,
          }), {}));

          return {
            type: 'CSV',
            linesCount: lines.length,
            value: objects,
          };
        })
      : linesParser
        .map((lines) => ({
          type: 'CSV',
          linesCount: lines.length,
          value: lines,
        }));

    super(csvParser.parseFunction, 'CSVParser');
  }

  run(input) {
    return super.run(input);
  }
}

function logOutput(parsed) {
  console.log('%s ->', JSON.stringify(parsed.input));
  if (parsed.error) {
    console.error(parsed.error);
  } else {
    console.log(JSON.stringify(parsed, null, 1));
  }
  console.log('__________________________________________________________________________________');
}

let parser;

[
  // '',
  // '\n',
  // '\n  \n',
  // ';',
  // ';\n',
  // ' ; ',
  // ' \n',
  // ' ;',
  // ' ;\n',
  // 'tine',
  // 'tine;',
  // 'tine;\n',
  // 'tine;marc',
  // 'tine;marc;',
  // 'tine;marc;\n',
  // ' tine ; marc ;    \n',
  // 'tina;marc\ncata;carlos',
].forEach((input) => {
  const parser = new CsvParser({
    quote: false,
    // trim: true,
  });
  logOutput(parser.run(input));
});

[
  // '',
  // '\n',
  // '\n  // \n',
  // '""',
  // '""\n',
  // '"";""',
  // '"";""\n',
  // '" ";" "',
  // '" "\n',
  // '" ";',
  // '" ";\n',
  // '"tine"',
  // '"tine";',
  // '"tine";\n',
  // '"tine";"marc"',
  // '"tine";"marc";',
  // '"tine";"marc";\n',
  // '"tina";"marc"\n"cata";"carlos"',
  // '"Theodore \\"Mawrkus\\" Smith";"Florentina Bellaire"',
  // '"tina',
  // '"tina";"marc',
].forEach((input) => {
  const parser = new CsvParser();
  logOutput(parser.run(input));
});

[
  `who,ok?,when?
    tina,yes,now
    cata,yes,later
    nana,no,now
    marc,,later
    carlos,yes,later
    bogdan,no,now`
].forEach((input) => {
  const parser = new CsvParser({
    quote: false,
    delimiter: ',',
    eol: '\n',
    headers: true,
    trim: true,
  });
  logOutput(parser.run(input));
});
