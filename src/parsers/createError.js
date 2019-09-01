const ParserError = require('../ParserError');

module.exports = function createError(type, expected, actual, index) {
  const expectedMsg = `Expected: ${JSON.stringify(expected.toString())}`;
  const actualMsg = `Actual: ${JSON.stringify(actual)}`;
  const indexMsg = `         ^ at index ${index}!`;
  const msg = `\n${expectedMsg}\n${actualMsg}\n${indexMsg}`;
  return new ParserError(type, msg, expected, actual, index);
};
