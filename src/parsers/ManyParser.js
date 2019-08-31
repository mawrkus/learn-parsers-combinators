const Parser = require('../Parser');

module.exports = class ManyParser extends Parser {
  constructor(soloParser, type = 'Many') {
    super({ name: 'ManyParser', type });

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
        targetString,
        index,
        result,
        error,
      } = nextState;

      if (error) {
        // we expect at least one result
        if (!results.length) {
          return {
            ...currentState,
            result: {
              type: this.type,
              value: results,
            },
            error: super.createError(
              `${this._soloParser.type}`,
              targetString,
              index,
            ),
          };
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
