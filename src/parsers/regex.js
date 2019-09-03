const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (regex, capture = false) => {
  if (!(regex instanceof RegExp)) {
    throw new TypeError('Please provide a regular expression!');
  }

  const regexParser = new Parser((parserState) => {
    const {
      targetString,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!targetString.length) {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', regex, parserState),
      };
    }

    const matches = targetString.match(regex);
    const matchedString = capture ? matches && matches[1] : matches && matches[0];

    if (!matches || typeof matchedString === 'undefined') {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', regex, parserState),
      };
    }

    const newIndex = capture
      ? matches[0].length
      : matches.index + matchedString.length;

    return {
      ...parserState,
      targetString: targetString.slice(newIndex),
      index: newIndex,
      result: matchedString,
      error: null,
    };
  }, `RegEx("${regex.toString()}", ${capture.toString()})`);

  return regexParser;
};
