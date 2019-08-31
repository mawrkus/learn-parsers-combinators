const Parser = require('../Parser');

module.exports = class StringParser extends Parser {
  constructor(expectedString, type = 'String') {
    if (!expectedString || !expectedString.length || typeof expectedString !== 'string') {
      throw new TypeError(`Invalid string "${expectedString}"!`);
    }

    super({ name: 'StringParser', type });

    this._expectedValue = expectedString;
    this._expectedValueLength = this._expectedValue.length;
  }

  run(parserState) {
    super.run(parserState);

    const {
      targetString,
      index,
    } = parserState;

    if (!targetString || !targetString.length || !targetString.startsWith(this._expectedValue)) {
      return {
        ...parserState,
        error: super.createError(this._expectedValue, targetString, index),
      };
    }

    return {
      ...parserState,
      targetString: targetString.slice(this._expectedValueLength),
      index: index + this._expectedValueLength,
      result: {
        type: this.type,
        value: this._expectedValue,
      },
      error: null,
    };
  }
};
