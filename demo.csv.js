const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyExcept,
  anyOf,
  chr,
  lazy,
  many,
  manyOrNone,
  regex,
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
    const delimiterParser = chr(delimiter);
    const eolParser = str(eol);

    const betweenQuotesParser = between(quoteParser, quoteParser);

    const fieldParser = quote === false
      ? regex(new RegExp(`[^${delimiter}${eol}]*`))
      : betweenQuotesParser(regex(new RegExp(`[^${quote}$]*`)));

    const lineParser = sequenceOf([
      fieldParser,
      manyOrNone(
        sequenceOf([
          delimiterParser,
          fieldParser,
        ])
          .map(([, field]) => field),
      ),
      eolParser,
    ])
      .map(([field, optionalFields]) => [field, ...optionalFields]);

    const csvParser = headers
      ? sequenceOf([
        lineParser,
        many(lineParser),
      ])
        .map(([headerLine, lines]) => {
          const value = lines.map((line) => line.reduce((acc, field, i) => ({
            ...acc,
            [headerLine[i]]: field,
          }), {}));

          return {
            type: 'CSV',
            linesCount: lines.length,
            value,
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

  run(targetString) {
    return super.run(targetString);
  }
}

// const parser = new CsvParser();
// const parsed = parser.run('"tina";"marc"\n"cata";"carlos"\n');
// const parsed = parser.run('"tina"\n"cata"\n');

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
bogdan,no,now
`);

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed ->', JSON.stringify(parsed, null, 1));
}
