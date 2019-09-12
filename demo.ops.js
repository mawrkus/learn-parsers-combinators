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

class ExpressionParser extends Parser {
  constructor() {
    const lParenParser = regex(/^[ ]*\([ ]*/);
    const rParenParser = regex(/^[ ]*\)[ ]*/);
    const betweenParensParser = between(lParenParser, rParenParser);
    const operatorParser = regex(/^[ ]*(\+|-|\*|\/)[ ]*/, true);
    const numberParser = regex(/^[ ]*((-|\+)?[0-9]+(\.[0-9]+)?)[ ]*/, true).map((n) => Number(n));

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

const parser = new ExpressionParser();
const parsed = parser.run('((6.3 - (100 / -25)) * (0.1 + 2.42))');

if (parsed.error) {
  console.error(parsed.error);
} else {
  console.log('Parsed ->', JSON.stringify(parsed, null, 1));
}
