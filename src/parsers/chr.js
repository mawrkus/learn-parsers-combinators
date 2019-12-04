const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (expectedChar) => {
  if (typeof expectedChar !== 'string' || expectedChar.length !== 1) {
    throw new TypeError(`Invalid char "${expectedChar}"!`);
  }

  const chrParser = new Parser((parserState) => {
    const {
      remainingInput,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (expectedChar !== remainingInput[0]) {
      return {
        ...parserState,
        error: ParserError.create('ChrParserError', expectedChar, parserState),
      };
    }

    return {
      ...parserState,
      remainingInput: remainingInput.slice(1),
      index: index + 1,
      result: expectedChar,
      error: null,
    };
  }, `Chr(${JSON.stringify(expectedChar)})`);

  return chrParser;
};
