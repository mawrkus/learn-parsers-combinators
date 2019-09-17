const Parser = require('./src/Parser');

/* eslint-disable no-unused-vars */
const {
  anyExcept,
  anyOf,
  between,
  chr,
  eoi,
  lazy,
  many,
  manyOrNone,
  not,
  regex,
  sepBy
  sepByOrNone,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

class JsonParser extends Parser {
  constructor() {
    const eoiParser = eoi();
    const optionalWhitespaces = regex(/^[ \n\r\t]*/);
    const betweenOptionalWhitespaces = between(optionalWhitespaces, anyOf([eoiParser, optionalWhitespaces]));
    const betweenBrackets = between(
      betweenOptionalWhitespaces(chr('[')),
      betweenOptionalWhitespaces(chr(']')),
    );
    const betweenBraces = between(
      betweenOptionalWhitespaces(chr('{')),
      betweenOptionalWhitespaces(chr('}')),
    );
    const betweenQuotes = between(chr('"'), chr('"'));
    const sepByOrNoneComma = sepByOrNone(chr(','));

    const number = regex(/^-?\d+(\.\d+)?/).map((n) => Number(n));

    const string = betweenQuotes(
      manyOrNone(
        anyOf([
          str('\\"'),
          not(chr('"')),
        ]),
      ).map(s => s.join('')),
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

    const array = betweenBrackets(
      sepByOrNoneComma(value),
    );

    const nameValuePair = sequenceOf([
      betweenOptionalWhitespaces(string),
      chr(':'),
      value,
    ]);

    const object = betweenBraces(
      sepByOrNoneComma(
        nameValuePair,
      ).map(pairs => pairs.reduce((acc, [name, colon, value]) => ({ ...acc, [name]: value }), {})),
    );

    const json = anyOf([
      array,
      object,
    ]);

    super(json.parseFunction, 'JsonParser');
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
  // '[1,"2",-3.1415926, true, [false, "test", null, "890"] ,  [{"test":null}]  ,{}, {  }  , { "tags": [{}] } ]',
  '{ "name": "Theodore \\"Mawrkus\\" Smith" }',
].forEach((input) => {
  const parser = new JsonParser();
  logOutput(parser.run(input));
});
