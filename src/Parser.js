module.exports = class Parser {
  constructor(parseFunction, type) {
    this.parseFunction = (parserState) => {
      // console.log('pre-parseFunction: %s -> ', type, parserState);

      const nextState = parseFunction(parserState);

      /* console.log('post-parseFunction: %s -> ', type, nextState);
      if (nextState.error) {
        console.error(nextState.error);
      } */

      return nextState;
    };
    this.type = type;
  }

  run(input) {
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
};
