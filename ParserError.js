module.exports = class ParserError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'ParserError';
  }
};
