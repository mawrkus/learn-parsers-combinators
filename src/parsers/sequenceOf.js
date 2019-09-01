const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (parsers) => {
  if (!parsers.every((p) => p instanceof Parser)) {
    throw new TypeError('All parsers must be instances of the "Parser" class!');
  }

  const sequenceOfParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    let currentState = parserState;
    let parseError = null;
    const results = [];

    for (let i = 0; i < parsers.length; i += 1) {
      currentState = parsers[i].parseFunction(currentState);

      const {
        result,
        error,
      } = currentState;

      if (error) {
        parseError = createError(
          'SequenceOfParserError',
          `${parsers.map((p, j) => `${p.type} (${j >= i ? 'ko' : 'ok'})`).join(' -> ')}`,
          currentState,
        );
        break;
      }

      results.push(result);
    }

    return {
      ...currentState,
      result: results,
      error: parseError,
    };
  }, `SequenceOf(${parsers.map((p) => p.type).join(' -> ')})`);

  return sequenceOfParser;
};
