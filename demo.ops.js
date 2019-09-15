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
  regex,
  sepBy,
  sequenceOf,
  str,
} = require('./src/parsers');
/* eslint-enable no-unused-vars */

class ExpressionParser extends Parser {
  constructor() {
    const eoiParser = eoi();
    const optionalWhitespaces = regex(/^[ \n\r\t]*/);
    const betweenOptionalWhitespaces = between(optionalWhitespaces, anyOf([eoiParser, optionalWhitespaces]));
    const lParenParser = betweenOptionalWhitespaces(chr('('));
    const rParenParser = betweenOptionalWhitespaces(chr(')'));
    const betweenParensParser = between(lParenParser, rParenParser);
    const operatorParser = betweenOptionalWhitespaces(anyOf([chr('+'), chr('-'), chr('*'), chr('/')]));
    const numberParser = betweenOptionalWhitespaces(regex(/^(-|\+)?[0-9]+(\.[0-9]+)?/)).map((n) => Number(n));

    const expressionParser = lazy(() => anyOf([
      numberParser,
      operationParser, // eslint-disable-line
    ]));

    const operationParser = betweenParensParser(
      sequenceOf([
        expressionParser,
        operatorParser,
        expressionParser,
      ])
        .map(([op1, op, op2]) => ({
          type: 'Operation',
          op1,
          op,
          op2,
        })),
    );

    super(expressionParser.parseFunction, 'ExpressionParser');
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
  '',
  // '42',
  // '42.3',
  // '-42',
  // '-42.3',
  // '(-42.3 * 0.1)',
  // '((6.3 - (100 / -26)) * (0.1 + 2.48))',
].forEach((input) => {
  const parser = new ExpressionParser();
  logOutput(parser.run(input));
});
