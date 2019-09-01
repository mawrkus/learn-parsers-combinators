module.exports = class ParserError extends Error {
  constructor(type, msg, expected, parserState) {
    super(msg);

    const {
      originalString: input,
      targetString: actual,
      index,
    } = parserState;

    this.name = type || 'ParserError';
    this.input = input;
    this.inputlLength = input ? input.length : 0;
    this.expected = expected;
    this.actual = actual;
    this.index = index;
  }
};
