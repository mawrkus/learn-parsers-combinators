const Parser = require('../Parser');
const many = require('./many');

module.exports = (singleParser) => {
  if (!(singleParser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const manyParser = many(singleParser);

  const manyOrNoneParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    const nextState = manyParser.parseFunction(parserState);

    const {
      result,
    } = nextState;

    if (!result) {
      return {
        ...nextState,
        result: [],
        error: null,
      };
    }

    return nextState;
  }, `ManyOrNone(${singleParser.type})`);

  return manyOrNoneParser;
};
