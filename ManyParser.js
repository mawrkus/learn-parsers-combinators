const Parser = require('./Parser');

module.exports = class ManyParser extends Parser {
  constructor(soloParser, type = 'Many') {
    super({ name: 'ManyParser', type });

    this._soloParser = soloParser;
  }

  run(parserState) {
    super.run(parserState);

    let currentState = parserState;
    const results = [];

    while (true) {
      const nextState = this._soloParser.run(currentState);

      const {
        targetString,
        index,
        result,
        error,
      } = nextState;

      if (error) {
        return {
          ...currentState,
          result: {
            type: this.type,
            value: results,
          },
          error: null,
        };
      }

      currentState = nextState;

      results.push(result);

      if (!targetString.length) {
        return {
          ...currentState,
          result: {
            type: this.type,
            value: results,
          },
          error: null,
        };
      }
    }
  }
};
