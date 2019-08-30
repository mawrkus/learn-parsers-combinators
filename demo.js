const Parser = require('./Parser');

const {
  chr,
  str,
  many,
  manyOrNone,
  sequenceOf,
  anyExcept,
  anyOf,
} = require('./');

class CsvParser extends Parser {
  constructor({
    quote = '"',
    delimiter = ';',
    eol = '\n',
  } = {}) {
    super({ name: 'CsvParser', type: 'CSV' });

    const quoteParser = chr(quote, 'Quote');
    const fieldDelimiterParser = chr(delimiter, 'Delimiter');
    const endOfLineParser = chr(eol, 'EndOfLine');

    const fieldContentParser = anyExcept(quoteParser, 'FieldContent');

    const fieldParser = sequenceOf([
      quoteParser,
      fieldContentParser,
      quoteParser,
    ], 'Field');

    const lineParser = sequenceOf([
      fieldParser,
      manyOrNone(
        sequenceOf([
          fieldDelimiterParser,
          fieldParser,
        ])
      ),
      endOfLineParser,
    ], 'Line');

    this._parser = many(lineParser);
  }

  run(csv) {
    console.log('Parsing %s...\n', JSON.stringify(csv));

    const result = this._parser.run({
      targetString: csv,
      index: 0,
      result: null,
      error: null,
    });

    return {
      ...result,
      isComplete: !result.targetString,
    };
  }
}

/* *** */

const csvParser = new CsvParser();

// const parsed = csvParser.run('"Tina";"Marc"\n"Cata";"Carlos"\n');
const parsed = csvParser.run('"Tina"\n"Carlos"\n'); // FIXME

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed result ->', JSON.stringify(parsed, null, 1));
}
