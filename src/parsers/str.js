const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (expectedString) => {
  if (typeof expectedString !== 'string' || !expectedString.length) {
    throw new TypeError('Please provide a valid non-empty string!');
  }

  const expectedStringLength = expectedString.length;

  const strParser = new Parser((parserState) => {
    const {
      targetString,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!targetString.length || !targetString.startsWith(expectedString)) {
      return {
        ...parserState,
        error: ParserError.create('StringParserError', expectedString, parserState),
      };
    }

    return {
      ...parserState,
      targetString: targetString.slice(expectedStringLength),
      index: index + expectedStringLength,
      result: expectedString,
      error: null,
    };
  }, `Str(${JSON.stringify(expectedString)})`);

  return strParser;
};
