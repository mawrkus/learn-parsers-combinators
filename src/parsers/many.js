const Parser = require('../Parser');
const ParserError = require('../ParserError');

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
        remainingInput,
        result,
        error,
      } = nextState;

      if (error) {
        // we expect at least one result
        if (!results.length) {
          return {
            ...currentState,
            result: null,
            error: ParserError.create(
              'ManyParserError',
              `${singleParser.type}`,
              nextState,
            ),
          };
        }

        break;
      }

      results.push(result);

      currentState = nextState;

      if (!remainingInput.length) {
        break;
      }
    }

    return {
      ...currentState,
      result: results,
      error: null,
    };
  }, `Many(${singleParser.type})`);

  return manyParser;
};
