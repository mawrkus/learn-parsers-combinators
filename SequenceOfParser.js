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

    for (let i=0; i<this._parsers.length; i++) {
      const parser = this._parsers[i];
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
            `${this._parsers.map((p, j) => `${p.type} (${j >= i ? 'ko' : 'ok'})`).join(' -> ')}`,
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
