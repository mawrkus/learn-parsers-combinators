const Parser = require('./Parser');
const ParserError = require('./ParserError');

module.exports = class CharParser extends Parser {
  constructor(expectedChar, type = 'Char') {
    super({ name: 'CharParser', type });

    this._expectedChar = expectedChar;
  }

  run(parserState) {
    super.run(parserState);

    const {
      targetString,
      index,
    } = parserState;

    if (this._expectedChar === targetString[0]) {
      return {
        ...parserState,
        targetString: targetString.slice(1),
        index: index + 1,
        result: {
          type: this.type,
          value: this._expectedChar,
        },
        error: null,
      };
    }

    return {
      ...parserState,
      error: super.createError(this._expectedChar, targetString, index),
    };
  }
};
