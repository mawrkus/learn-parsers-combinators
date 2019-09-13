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
    const betweenBrackets = between(chr('['), chr(']'));
    const betweenBraces = between(chr('{'), chr('}'));
    const optionalWhitespaces = manyOrNone(regex(/^[ \n\r\t]+/));
    const betweenOptionalWhitespaces = between(optionalWhitespaces, optionalWhitespaces);
    const betweenQuotes = between(chr('"'), chr('"'));
    const sepByComma = sepBy(chr(','));

    const number = regex(/^-?\d+(\.\d+)?/).map((n) => Number(n));

    const string = betweenQuotes(
      regex(/^[^"]*/), // TODO: fixme
    );

    const value = lazy(() => betweenOptionalWhitespaces(
      anyOf([
        str('true').map(() => true),
        str('false').map(() => false),
        str('null').map(() => null),
        number,
        string,
        array, // eslint-disable-line
        object, // eslint-disable-line
      ])),
    );

    const array = betweenOptionalWhitespaces(
      betweenBrackets(
        sepByComma(value),
      ),
    );

    const object = betweenOptionalWhitespaces(
      betweenBraces(
        sepByComma(
          sequenceOf([
            betweenOptionalWhitespaces(string),
            chr(':'),
            value,
          ]),
        ).map(pairs => pairs.reduce((acc, [name, colon, value]) => ({ ...acc, [name]: value }), {})),
      ),
    );

    const json = anyOf([
      array,
      object,
    ]);

    super(array.parseFunction, 'JsonParser');
  }

  run(input) {
    return super.run(input);
  }
}

function logOutput(parsed) {
  if (parsed.error) {
    console.log('%s ->', parsed.input, parsed.error);
  } else {
    console.log('%s ->', parsed.input, JSON.stringify(parsed, null, 1));
  }
  console.log('__________________________________________________________________________________');
}

[
  // '{}',
  // ' {} ',
  // '{   }',
  // '{ "one" : "" }',
  // '{"one":1}',
  // '{ "one" : 1 }',
  /* `
  {
    "one":1,
    "two": "2",
    "three" :true,
    "four" : false,
    "five"   :   null
  }
  `, */
  // '{ "one": { "two": 3 } }',
  // '{ "one": { "two": 3 }, "four": 5, "six": {}, "seven": [] }',
  // '{ "items": [{ "id": "1", "tags":["sci-fi", "utopia"] }], "pagination": { "page": 1, "totalPages": 42 } }',
  // '[]',
  // ' [] ',
  // '[   ]',
  // '["one"]',
  // '[""]',
  // '[ "one" ]',
  // '[ "one", 2, -3.14, true, false, null, [], {} ]',
  // '[ ["one"], [2, -3.14], [true, [false], [[null, [], {}]]] ]',
  // '[1,"2",-3.1415926, true, [false, "test", null, "890"] ,  [{"test":null}]  ,{}, {    }  , {     } ]',
  '["\n\t->\t\"maybe\" <-\r\n"]'
].forEach((input) => {
  const parser = new JsonParser();
  logOutput(parser.run(input));
});
