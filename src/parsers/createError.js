const ParserError = require('../ParserError');

function convertToHumanFriendly(str) {
  return str
    .replace(/\r?\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

module.exports = function createError(type, expected, parserState) {
  const {
    originalString,
    index,
  } = parserState;

  const expectedMsg = `Expected: ${convertToHumanFriendly(expected.toString())}`;
  const originalHumanFriendly = convertToHumanFriendly(originalString || '');
  const actualMsg = `Actual: ${originalHumanFriendly}`;

  const offset = 9 + (originalHumanFriendly.match(/(\\\n|\\t)/g) || []).length;
  const indexMsg = `${Array(index + offset).join(' ')}^ at index ${index}!`;

  const msg = `\n${expectedMsg}\n${actualMsg}\n${indexMsg}`;

  return new ParserError(type, msg, expected, parserState);
};
