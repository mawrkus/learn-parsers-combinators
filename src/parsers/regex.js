const Parser = require('../Parser');
const ParserError = require('../ParserError');

module.exports = (re) => {
  if (!(re instanceof RegExp)) {
    throw new TypeError('Please provide a regular expression!');
  }

  if (re.toString()[1] !== '^') {
    throw new TypeError('The regular expression should start with the "^" metacharacter!');
  }

  const regexParser = new Parser((parserState) => {
    const {
      remainingInput,
      index,
      error,
    } = parserState;

    if (error) {
      return parserState;
    }

    if (!remainingInput.length) {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', re, parserState),
      };
    }

    const matches = remainingInput.match(re);
    const matchedString = matches && matches[0];

    // TODO: UT null AND undefined cases
    if (matchedString === null || typeof matchedString === 'undefined') {
      return {
        ...parserState,
        error: ParserError.create('RegexParserError', re, parserState),
      };
    }

    return {
      ...parserState,
      remainingInput: remainingInput.slice(matchedString.length),
      index: index + matchedString.length,
      result: matchedString,
      error: null,
    };
  }, `RegEx("${re.toString()}")`);

  return regexParser;
};
