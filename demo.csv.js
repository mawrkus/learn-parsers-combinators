const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyExcept,
  anyOf,
  chr,
  eoi,
  lazy,
  many,
  manyOrNone,
  regex,
  sepBy,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

const between = (leftParser, rightParser) => (contentParser) => sequenceOf([
  leftParser,
  contentParser,
  rightParser,
])
  .map((result) => result[1]);

class CsvParser extends Parser {
  constructor({
    quote = '"',
    delimiter = ';',
    eol = '\n',
    headers = false,
  } = {}) {
    const quoteParser = quote !== false ? chr(quote) : null;
    const betweenQuotesParser = between(quoteParser, quoteParser);
    const delimiterParser = chr(delimiter);
    const eolParser = str(eol);
    const eoiParser = eoi();

    const fieldParser = quote === false
      ? regex(new RegExp(`^[^${delimiter}${eol}]*`))
      : betweenQuotesParser(regex(new RegExp(`^[^${quote}]*`)));

    const lineParser = sequenceOf([
      sepBy(delimiterParser)(fieldParser),
      anyOf([
        eolParser,
        eoiParser,
      ]),
    ])
      .map(([fields]) => fields);

    const csvParser = headers
      ? sequenceOf([
        lineParser,
        many(lineParser),
      ])
        .map(([headerLine, lines]) => {
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
      : many(lineParser)
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

/* const parser = new CsvParser({
  quote: false,
});
const parsed = parser.run('tina;marc\ncata;carlos\n'); */

const parser = new CsvParser({
  quote: false,
  delimiter: ',',
  eol: '\n',
  headers: true,
});
const parsed = parser.run(`who,ok?,when?
tina,yes,now
cata,yes,later
nana,no,now
marc,yes,later
carlos,yes,later
bogdan,no,now`);

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed ->', JSON.stringify(parsed, null, 1));
}
