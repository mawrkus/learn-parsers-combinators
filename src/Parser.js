const debug = false;

module.exports = class Parser {
  constructor(parseFunction, type = 'Parser') {
    this.type = type;
    this.typeLabel = '';

    this.parseFunction = (parserState) => {
      if (debug) {
        console.log('[PRE] -> %s', this.type, this.typeLabel);
        console.log(parserState);
      }

      const nextState = parseFunction(parserState);

      if (debug) {
        console.log('[POST] <- %s', this.type, this.typeLabel);
        console.log(nextState);
        console.log('------------------');
      }

      return nextState;
    };
  }

  run(input) {
    if (typeof input !== 'string') {
      throw new TypeError('Please provide a string!');
    }

    const initialState = {
      input,
      remainingInput: input,
      index: 0,
      result: null,
      error: null,
    };

    return this.parseFunction(initialState);
  }

  map(successFunction, errorFunction = (e) => e) {
    return new Parser((parserState) => {
      const nextState = this.parseFunction(parserState);
      const {
        result,
        error,
      } = nextState;

      return {
        ...nextState,
        result: !error ? successFunction(result) : result,
        error: error ? errorFunction(error) : error,
      };
    }, this.type);
  }

  label(label) {
    this.typeLabel = label;
    return this;
  }
};
