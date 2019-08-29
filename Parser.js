const ParserError = require('./ParserError');

module.exports = class Parser {
  constructor({ name = 'Parser', type = null, debug = false } = {}) {
    this.name = name;
    this.type = type;
    this._debug = debug;
  }

  run(parserState) {
    if (this._debug) {
      console.log(`Running ${this.name} ->`, JSON.stringify(parserState, null, 1));
    }
  }

  createError(expected, received, index) {
    const expectedMsg = `Expected ${JSON.stringify(expected)} (${this.type})`;
    const receivedMsg = `Received ${JSON.stringify(received)}`;
    const indexMsg    = `          ^ at index ${index}!`;
    const msg = `\n${expectedMsg}\n${receivedMsg}\n${indexMsg}`;;
    return new ParserError(msg);
  }
};