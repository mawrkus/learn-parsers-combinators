const Parser = require('../Parser');

module.exports = class ManyOrNoneParser extends Parser {
  constructor(soloParser, type = 'ManyOrNone') {
    super({ name: 'ManyOrNoneParser', type });

    this._soloParser = soloParser;
  }

  run(parserState) {
    super.run(parserState);

    let currentState = parserState;
    const results = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextState = this._soloParser.run(currentState);

      const {
        result,
        error,
      } = nextState;

      if (error) {
        // we don't expect any result
        if (!results.length) {
          return currentState;
        }

        // done parsing
        return {
          ...currentState,
          result: {
            type: this.type,
            value: results,
          },
          error: null,
        };
      }

      results.push(result);

      currentState = nextState;
    }
  }
};
