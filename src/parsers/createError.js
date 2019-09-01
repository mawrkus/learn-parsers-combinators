const ParserError = require('../ParserError');

module.exports = function createError(type, expected, parserState) {
  const {
    originalString,
    targetString,
    index,
  } = parserState;

  const expectedMsg = `Expected: ${JSON.stringify(expected.toString())}`;
  const actualMsg = `Actual: ${JSON.stringify(originalString)}`;
  const indexMsg = `${Array(index + 10).join(' ')}^ at index ${index}!`;

  const msg = `\n${expectedMsg}\n${actualMsg}\n${indexMsg}`;

  return new ParserError(type, msg, expected, targetString, index);
};
