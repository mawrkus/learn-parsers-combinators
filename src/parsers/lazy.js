const Parser = require('../Parser');

module.exports = (parserThunk) => {
  if (typeof parserThunk !== 'function') {
    throw new TypeError('Please provide a valid parser thunk!');
  }

  const lazyParser = new Parser((parserState) => {
    const parser = parserThunk();
    return parser.parseFunction(parserState);
  }, 'Lazy');

  return lazyParser;
};
