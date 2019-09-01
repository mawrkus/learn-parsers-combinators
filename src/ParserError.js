module.exports = class ParserError extends Error {
  constructor(type, msg, expected, received, index) {
    super(msg);
    this.name = type || 'ParserError';
    this.expected = expected;
    this.received = received;
    this.index = index;
  }
};
