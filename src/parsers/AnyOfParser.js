const Parser = require('../Parser');

module.exports = class AnyOfParser extends Parser {
  constructor(parsers, type = 'AnyOf') {
    super({ name: 'AnyOfParser', type });

    this._parsers = parsers;
  }

  run(parserState) {
    super.run(parserState);

    let currentState = null;

    const found = this._parsers.find((parser) => {
      currentState = parser.run(parserState);
      return !currentState.error;
    });

    if (found) {
      return currentState;
    }

    const {
      targetString,
      index,
    } = parserState;

    return {
      ...currentState,
      error: super.createError(
        `${this._parsers.map(({ type }) => type).join(' or ')}`,
        targetString,
        index,
      ),
    };
  }
};
