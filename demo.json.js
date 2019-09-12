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

class JsonParser extends Parser {
  constructor() {
    const sepByComma = sepBy(chr(','));
    const whitespace = regex(/^\s+/);
    const betweenQuotes = between(chr('"'), chr('"'));
    const string = betweenQuotes(regex(/^[^"]*/));
    const number = regex(/^-?\d+(\.\d+)?/).map((n) => Number(n));
    const betweenWhitespaces = between(whitespace, whitespace);
    const value = lazy(() => betweenWhitespaces(anyOf([
      string,
      number,
      object, // eslint-disable-line
      array, // eslint-disable-line
      str('true').map(() => true),
      str('false').map(() => false),
      str('null').map(() => null),
    ])));
    const betweenBrackets = between(chr('['), chr(']'));
    const array = betweenBrackets(anyOf([
      whitespace,
      sepByComma(value),
    ]));
    const betweenBraces = between(chr('{'), chr('}'));
    const object = betweenBraces(anyOf([
      whitespace,
      sepByComma(sequenceOf([
        whitespace,
        string,
        whitespace,
        chr(':'),
        value,
      ])),
    ])).map(([, nameValuePairs]) => {
      return nameValuePairs;
    });

    const jsonParser = anyOf([
      array,
      object,
    ]);

    super(jsonParser.parseFunction, 'ExpressionParser');
  }

  run(input) {
    return super.run(input);
  }
}

function logOutput(input, parsed) {
  console.log('__________________________________________________________________________________');
  if (parsed.error) {
    console.log('%s ->', input, parsed.error);
  } else {
    console.log('%s ->', input, JSON.stringify(parsed, null, 1));
  }
}

[
  '[ null ]'
  // '{}',
  // '{ "one": "one", "two": 2, "three": {}, "four": [], "five": true, "six": false, "seven": null }',
].forEach((input) => {
  const parser = new JsonParser();
  logOutput(input, parser.run(input));
});

/* [
  '[]',
].forEach((input) => {
  const parser = new JsonParser();
  logOutput(input, parser.run(input));
}); */
