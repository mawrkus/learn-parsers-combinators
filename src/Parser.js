module.exports = class Parser {
  constructor(parseFunction, type) {
    this.parseFunction = (parserState) => {
      // console.log('%s -> ', type, parserState);
      const nextState = parseFunction(parserState);
      /* if (nextState.error) {
        console.error(nextState.error);
      } */
      return nextState;
    };
    this.type = type;
  }

  run(targetString) {
    const initialState = {
      targetString,
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
