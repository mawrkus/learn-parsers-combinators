const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = () => {
  const eoiSymbol = Symbol('EOI');

  const eoiParser = new Parser((parserState) => {
    const {
      input,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (index !== input.length) {
      return {
        ...parserState,
        error: ParserError.create('EndOfInputParserError', '', parserState),
      };
    }

    return {
      ...parserState,
      result: eoiSymbol,
    };
  }, 'EndOfInput');

  eoiParser.eoiSymbol = eoiSymbol;

  return eoiParser;
};
