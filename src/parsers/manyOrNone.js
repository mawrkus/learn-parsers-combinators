const Parser = require('../Parser');

module.exports = (parser) => {
  if (!(parser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const manyOrNoneParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    let currentState = parserState;
    const results = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextState = parser.parseFunction(currentState);

      const {
        result,
        error,
      } = nextState;

      if (error) {
        // we don't expect any result
        if (!results.length) {
          // FIXME: returning this in sequenceOf duplicates the results
          return currentState;
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
  }, `ManyOrNone (${parser.type})`);

  return manyOrNoneParser;
};
