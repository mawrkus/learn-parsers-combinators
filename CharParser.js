const Parser = require('./Parser');
const ParserError = require('./ParserError');

module.exports = class CharParser extends Parser {
  constructor(expectedChar, type = 'Char') {
    if (!expectedChar || expectedChar.length !== 1 || typeof expectedChar !== 'string') {
      throw new TypeError(`Invalid char "${expectedChar}"!`);
    }

    super({ name: 'CharParser', type });

    this._expectedValue = expectedChar;
  }

  run(parserState) {
    super.run(parserState);

    const {
      targetString,
      index,
    } = parserState;

    if (!targetString || !targetString.length || this._expectedValue !== targetString[0]) {
      return {
        ...parserState,
        error: super.createError(this._expectedValue, targetString, index),
      };
    }

    return {
      ...parserState,
      targetString: targetString.slice(1),
      index: index + 1,
      result: {
        type: this.type,
        value: this._expectedValue,
      },
      error: null,
    };
  }
};
