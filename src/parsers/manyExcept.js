const Parser = require('../Parser');

module.exports = (exceptParser) => {
  if (!(exceptParser instanceof Parser)) {
    throw new TypeError('Please provide an instance of the "Parser" class!');
  }

  const manyExceptParser = new Parser((parserState) => {
    if (parserState.error) {
      return parserState;
    }

    let result = null;
    let currentState = parserState;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const {
        error,
        remainingInput,
        index,
      } = exceptParser.parseFunction(currentState);

      if (!error || !remainingInput.length) {
        return {
          ...currentState,
          // proper deal with some edge cases, e.g.:
          // sepByOrNone(chr(';'))(manyExcept(chr(';')) on input 'x;'
          result,
          error: null,
        };
      }

      result = `${result || ''}${remainingInput[0]}`;

      currentState = {
        ...currentState,
        remainingInput: remainingInput.slice(1),
        index: index + 1,
        result,
      };
    }
  }, `AnyExcept(${exceptParser.type})`);

  return manyExceptParser;
};
