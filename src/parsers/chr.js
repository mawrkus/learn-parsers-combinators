const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (expectedChar) => {
  if (typeof expectedChar !== 'string' || expectedChar.length !== 1) {
    throw new TypeError(`Invalid char "${expectedChar}"!`);
  }

  const chrParser = new Parser((parserState) => {
    const {
      targetString,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!targetString || !targetString.length || expectedChar !== targetString[0]) {
      return {
        ...parserState,
        error: createError('ChrParserError', expectedChar, targetString, index),
      };
    }

    return {
      ...parserState,
      targetString: targetString.slice(1),
      index: index + 1,
      result: expectedChar,
      error: null,
    };
  }, `Chr(${JSON.stringify(expectedChar)})`);

  return chrParser;
};
