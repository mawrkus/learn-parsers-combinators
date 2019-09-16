const Parser = require('../Parser');
const many = require('./many');

module.exports = (singleParser) => {
  const manyParser = many(singleParser);

  const manyOrNoneParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    const nextState = manyParser.parseFunction(parserState);

    if (!nextState.result) {
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
