module.exports = class Parser {
  constructor(parseFunction, type) {
    this.parseFunction = (parserState) => {
      // console.log('preParse: %s -> ', type, parserState);

      const nextState = parseFunction(parserState);

      /* console.log('postParse: %s -> ', type, nextState);
      if (nextState.error) {
        console.error(nextState.error);
      } */

      return nextState;
    };
    this.type = type;
  }

  run(originalString) {
    const initialState = {
      originalString,
      targetString: originalString,
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
