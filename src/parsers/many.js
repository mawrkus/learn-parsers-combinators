const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (singleParser) => {
  if (!(singleParser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const manyParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    let currentState = parserState;
    const results = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextState = singleParser.parseFunction(currentState);

      const {
        targetString,
        index,
        result,
        error,
      } = nextState;

      if (error) {
        // we expect at least one result
        if (!results.length) {
          return {
            ...currentState,
            result: null,
            error: createError(
              'ManyParserError',
              `${singleParser.type}`,
              targetString,
              index,
            ),
          };
        }

        // done parsing
        return {
          ...currentState,
          result: results,
          error: null,
        };
      }

      results.push(result);

      currentState = nextState;
    }
  }, `Many(${singleParser.type})`);

  return manyParser;
};
