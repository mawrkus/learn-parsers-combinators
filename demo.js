const {
  chr,
  str,
  many,
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
  many(
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

const parser = many(lineParser, 'CSV');

/* *** */

function parseCsv(csv) {
  console.log('Parsing %s...\n', JSON.stringify(csv));

  return parser.run({
    targetString: csv,
    index: 0,
    result: null,
    error: null,
  });
}

const parsed = parseCsv('"Marc";"Tina"\n"Cata";"Carlos"\n');

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed result ->', JSON.stringify(parsed, null, 1));
}
