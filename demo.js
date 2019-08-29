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

const quoteParser = chr('"', 'Quote');
const fieldDelimiterParser = chr(';', 'Delimiter');
const endOfLineParser = chr('\n', 'EndOfLine');

const fieldContentParser = anyExcept(quoteParser, 'FieldContent');

const fieldParser = sequenceOf([
  quoteParser,
  fieldContentParser,
  quoteParser,
], 'Field');

const lineParser = sequenceOf([
  manyOrNone(
    sequenceOf([
      fieldParser,
      fieldDelimiterParser,
    ])
  ),
  sequenceOf([
    fieldParser,
    endOfLineParser,
  ])
], 'Line');

const parser = many(lineParser);

/* *** */

class CsvParser extends Parser {
  run(csv) {
    console.log('Parsing %s...\n', JSON.stringify(csv));

    const result = parser.run({
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

const csvParser = new CsvParser();

const parsed = csvParser.run('"Tina";"Marc"\n"Cata";"Carlos"\n');

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed result ->', JSON.stringify(parsed, null, 1));
}
