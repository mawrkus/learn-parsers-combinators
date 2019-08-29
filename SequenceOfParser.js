const Parser = require('./Parser');

module.exports = class SequenceOfParser extends Parser {
  constructor(parsers, type = 'SequenceOf') {
    super({ name: 'SequenceOfParser', type });

    this._parsers = parsers;
  }

  run(parserState) {
    super.run(parserState);

    let currentState = parserState;
    const results = [];

    for (const parser of this._parsers) {
      currentState = parser.run(currentState);

      const {
        targetString,
        index,
        result,
        error,
      } = currentState;

      if (error) {
        return {
          ...currentState,
          error: super.createError(
            `${this._parsers.map(({ type }) => type).join(' then ')}`,
            targetString,
            index,
          ),
        };
      }

      results.push(result);
    }

    return {
      ...currentState,
      result: {
        type: this.type,
        value: results,
      },
    };
  }
};
