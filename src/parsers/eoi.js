const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = () => {
  const eoiSymbol = Symbol('EOI');

  const eoiParser = new Parser((parserState) => {
    const {
      targetString,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (targetString.length > 0) {
      return {
        ...parserState,
        error: ParserError.create('EndOfInputParserError', '', parserState),
      };
    }

    return {
      ...parserState,
      result: eoiSymbol,
    };
  }, 'EndOfInputParserError()');

  eoiParser.eoiSymbol = eoiSymbol;

  return eoiParser;
};
