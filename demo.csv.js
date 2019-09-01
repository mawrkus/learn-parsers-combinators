const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyExcept,
  anyOf,
  chr,
  many,
  regex,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

class CsvParser extends Parser {
  constructor({ quote = '"', delimiter = ';', eol = '\n' } = {}) {
    const quoteParser = quote !== false ? chr(quote) : null;
    const delimiterParser = chr(delimiter);
    const eolParser = str(eol);

    const fieldParser = quote === false
      ? anyExcept(
        anyOf([
          delimiterParser,
          eolParser,
        ]),
      )
      : sequenceOf([
        quoteParser,
        anyExcept(quoteParser),
        quoteParser,
      ])
        .map((result) => result[1]);

    const lineParser = anyOf([
      sequenceOf([
        fieldParser,
        eolParser,
      ])
        .map((result) => result[0]),
      sequenceOf([
        fieldParser,
        many(
          sequenceOf([
            delimiterParser,
            fieldParser,
          ]),
        ),
        eolParser,
      ])
        .map((results) => [
          results[0],
          ...results[1].map((r) => r[1]),
        ]),
    ]);

    const csvParser = many(lineParser).map((results) => ({
      type: 'CSV',
      linesCount: results.length,
      value: results,
    }));

    super(csvParser.parseFunction, 'CSVParser');
  }

  run(targetString) {
    return super.run(targetString);
  }
}

const parser = new CsvParser();
const parsed = parser.run('"tina";"cata";"nana"\n"marc";"carlos";"bogdan"\n');

// // const parser = new CsvParser({ quote: false, delimiter: ',', eol: '\r\n' });
// // const parsed = parser.run('tina,cata\r\nnana,marc\r\ncarlos,bogdan\r\n');

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed ->', JSON.stringify(parsed, null, 1));
}
