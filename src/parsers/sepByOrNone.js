const Parser = require('../Parser');
const sepBy = require('./sepBy');

module.exports = (sepParser) => {
  const sepByParserFactory = sepBy(sepParser);

  const sepByOrNoneParserFactory = (valueParser) => {
    const sepByParser = sepByParserFactory(valueParser);

    return new Parser((parserState) => {
      if (parserState.error) {
        return parserState;
      }

      const nextState = sepByParser.parseFunction(parserState);

      if (!nextState.result) {
        return {
          ...nextState,
          result: [],
          error: null,
        };
      }

      return nextState;
    }, `SepByOrNone(${sepParser.type})(${valueParser.type})`);
  };

  return sepByOrNoneParserFactory;
};
