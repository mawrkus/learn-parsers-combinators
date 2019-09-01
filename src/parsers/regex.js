const Parser = require('../Parser');
const createError = require('./createError');

module.exports = (regex, capture = false) => {
  if (!(regex instanceof RegExp)) {
    throw new TypeError('Please provide a regular expression!');
  }

  const regexParser = new Parser((parserState) => {
    const {
      targetString,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!targetString || !targetString.length) {
      return {
        ...parserState,
        error: createError('RegexParserError', regex, targetString, index),
      };
    }

    const matches = targetString.match(regex);
    const matchedString = capture ? matches && matches[1] : matches && matches[0];

    if (!matchedString) {
      return {
        ...parserState,
        error: createError('RegexParserError', regex, targetString, index),
      };
    }

    const matchedStringLength = matches[0].length;

    return {
      ...parserState,
      targetString: targetString.slice(matchedStringLength),
      index: index + matchedStringLength,
      result: matchedString,
      error: null,
    };
  }, `RegEx("${regex.toString()}", ${capture.toString()})`);

  return regexParser;
};
