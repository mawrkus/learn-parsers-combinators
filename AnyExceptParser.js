const Parser = require('./Parser');

module.exports = class AnyExceptParser extends Parser {
  constructor(exceptParser, type = 'AnyExcept') {
    super({ name: 'AnyExceptParser', type });

    this._exceptParser = exceptParser;
  }

  run(parserState) {
    super.run(parserState);

    let result = '';

    let currentState = parserState;

    while (true) {
      const {
        error,
        targetString,
        index,
      } = this._exceptParser.run(currentState);

      if (!error || !targetString.length) {
        return currentState;
      }

      result = `${result}${targetString[0]}`;

      currentState = {
        ...currentState,
        targetString: targetString.slice(1),
        index: index + 1,
        result: {
          type: this.type,
          value: result,          
        },
      };
    }
  }
};
