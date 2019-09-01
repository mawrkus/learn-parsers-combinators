const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyExcept,
  // anyOf,
  chr,
  many,
  manyOrNone,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

const fieldParser = sequenceOf([
  chr('"'),
  anyExcept(chr('"')),
  chr('"'),
]).map((result) => ({
  type: 'Field',
  value: result,
}));

const lineParser = sequenceOf([
  fieldParser,
  manyOrNone(
    sequenceOf([
      chr(';'),
      fieldParser,
    ]),
  ),
  chr('\n'),
]);

const csvParser = (lineParser);

const parser = new Parser(csvParser.parseFunction, 'CSVParser');

const csv = '"tina"\nmarc"\n';

console.log('Parsing %s...\n', JSON.stringify(csv));

const parsed = parser.run(csv);

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed result ->', JSON.stringify(parsed, null, 1));
}
