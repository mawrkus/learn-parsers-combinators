const ParserError = require('../ParserError');

module.exports = function createError(type, expected, received, index) {
  const expectedMsg = `Expected: ${JSON.stringify(expected)}`;
  const receivedMsg = `Received: ${JSON.stringify(received)}`;
  const indexMsg = `           ^ at index ${index}!`;
  const msg = `\n${expectedMsg}\n${receivedMsg}\n${indexMsg}`;
  return new ParserError(type, msg, expected, received, index);
};
