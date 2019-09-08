const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (regex, capture = false) => {
  if (!(regex instanceof RegExp)) {
    throw new TypeError('Please provide a regular expression!');
  }

  const regexParser = new Parser((parserState) => {
    const {
      remainingInput,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!remainingInput.length) {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', regex, parserState),
      };
    }

    const matches = remainingInput.match(regex);
    const matchedString = capture ? matches && matches[1] : matches && matches[0];

    if (!matches || typeof matchedString === 'undefined') {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', regex, parserState),
      };
    }

    // TODO: err if newIndex = 0
    const newIndex = capture
      ? matches[0].length
      : matches.index + matchedString.length;

    return {
      ...parserState,
      remainingInput: remainingInput.slice(newIndex),
      index: newIndex,
      result: matchedString,
      error: null,
    };
  }, `RegEx("${regex.toString()}", ${capture.toString()})`);

  return regexParser;
};
