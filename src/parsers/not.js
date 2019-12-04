const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (parser) => {
  if (!(parser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const notParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    const {
      error,
    } = parser.parseFunction(parserState);

    if (error) {
      const {
        remainingInput,
        index,
      } = parserState;

      return {
        ...parserState,
        result: remainingInput[0],
        remainingInput: remainingInput.slice(1),
        index: index + 1,
        error: null,
      };
    }

    return {
      ...parserState,
      error: ParserError.create(
        'NotParserError',
        parser.type,
        parserState,
      ),
    };
  }, `Not(${parser.type})`);

  return notParser;
};
