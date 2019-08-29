const Parser = require('./Parser');
const ParserError = require('./ParserError');

module.exports = class StringParser extends Parser {
  constructor(expectedString, type = 'String') {
    super({ name: 'StringParser', type });
    
    this._expectedString = expectedString;
    this._expectedStringLength = this._expectedString.length;
  }

  run(parserState) {
    super.run(parserState);

    const {
      targetString,
      index,
    } = parserState;

    if (targetString.startsWith(this._expectedString)) {
      return {
        ...parserState,
        targetString: targetString.slice(this._expectedStringLength),
        index: index + this._expectedStringLength,
        result: {
          type: this.type,
          value: this._expectedString,
        },
        error: null,
      };
    }

    return {
      ...parserState,
      error: super.createError(this._expectedString, targetString, index),
    };
  }
};
