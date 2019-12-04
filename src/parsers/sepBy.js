const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (sepParser) => {
  if (!(sepParser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const sepByParserFactory = (valueParser) => {
    if (!(valueParser instanceof Parser)) {
      throw new TypeError('Please provide an instance of the "Parser" class!');
    }

    return new Parser((parserState) => {
      if (parserState.error) {
        return parserState;
      }

      const results = [];
      let currentState = parserState;
      let valueState;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        currentState = valueParser.parseFunction(currentState);

        if (currentState.error) {
          return {
            ...currentState,
            result: null,
            error: ParserError.create(
              `SepByParserError(${sepParser.type})(${valueParser.type})`,
              `${valueParser.type}`,
              currentState,
            ),
          };
        }

        results.push(currentState.result);

        valueState = currentState;
        currentState = sepParser.parseFunction(currentState);

        if (currentState.error) {
          currentState = valueState;
          break;
        }
      }

      return {
        ...currentState,
        result: results,
        error: null,
      };
    }, `SepBy(${sepParser.type})(${valueParser.type})`);
  };

  return sepByParserFactory;
};
