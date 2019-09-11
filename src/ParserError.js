function convertToHumanFriendly(str) {
  return str
    .replace(/\r?\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

module.exports = class ParserError extends Error {
  constructor(type, msg, expected, parserState) {
    super(msg);

    const {
      input,
      remainingInput: actual,
      index,
    } = parserState;

    this.name = type || 'ParserError';
    this.input = input;
    this.inputlLength = input ? input.length : 0;
    this.expected = expected;
    this.actual = actual;
    this.index = index;
  }

  static create(type, expected, parserState) {
    const {
      input,
      index,
    } = parserState;

    const expectedMsg = `Expected: ${convertToHumanFriendly(expected.toString())}`;
    const humanFriendlyInput = convertToHumanFriendly(input || '');
    const actualMsg = `Actual: ${humanFriendlyInput}`;

    const specialCharsCount = (humanFriendlyInput.match(/(\\n|\\t)/g) || []).length;
    const offset = 9 + specialCharsCount;
    const indexMsg = `${Array(index + offset).join(' ')}^ at index ${index}!`;

    const msg = `\n${expectedMsg}\n${actualMsg}\n${indexMsg}`;

    return new ParserError(type, msg, expected, parserState);
  }
};
