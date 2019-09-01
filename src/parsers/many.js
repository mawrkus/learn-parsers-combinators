const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (parser) => {
  if (!(parser instanceof Parser)) {
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
      const nextState = parser.parseFunction(currentState);

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
              `${parser.type}`,
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
  }, `Many (${parser.type})`);

  return manyParser;
};
