const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (parsers) => {
  if (!parsers.every((p) => p instanceof Parser)) {
    throw new TypeError('All parsers must be instances of the "Parser" class!');
  }

  const anyOfParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    let nextState = null;

    const found = parsers.find((parser) => {
      nextState = parser.parseFunction(parserState);
      return !nextState.error;
    });

    if (found) {
      return nextState;
    }

    const {
      targetString,
      index,
    } = parserState;

    return {
      ...parserState,
      error: createError(
        'AnyOfParserError',
        `${parsers.map(({ type }) => type).join(' or ')}`,
        targetString,
        index,
      ),
    };
  }, `AnyOf (${parsers.map((p) => p.type).join(' or ')})`);

  return anyOfParser;
};