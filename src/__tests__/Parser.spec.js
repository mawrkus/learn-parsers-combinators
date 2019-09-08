const Parser = require('../Parser');

function createParser({ parseFunctionResult } = {}) {
  const parseFunction = jest.fn(() => parseFunctionResult);

  const parser = new Parser(parseFunction, 'TestParser');

  return {
    parseFunction,
    parser,
  };
}

describe('Parser', () => {
  it('should be a class with the following interface: run(), map()', () => {
    expect(Parser).toBeInstanceOf(Function);
    expect(Parser.prototype.run).toBeInstanceOf(Function);
    expect(Parser.prototype.map).toBeInstanceOf(Function);
  });

  describe('run(input)', () => {
    it('should call the parse function on the proper initial state and return the result of its call', () => {
      const {
        parseFunction,
        parser,
      } = createParser({
        parseFunctionResult: {
          result: 'All good!',
          error: null,
        },
      });

      const parsed = parser.run('1 2 1 2... this is just a test');

      expect(parseFunction).toHaveBeenCalledWith({
        input: '1 2 1 2... this is just a test',
        remainingInput: '1 2 1 2... this is just a test',
        index: 0,
        result: null,
        error: null,
      });

      expect(parsed).toEqual({
        result: 'All good!',
        error: null,
      });
    });
  });

  describe('map(successFunction, errorFunction)', () => {
    it('should return a new parser', () => {
      const {
        parser,
      } = createParser();

      const newParser = parser.map(() => ({}));

      expect(newParser).toBeInstanceOf(Parser);
    });

    describe('the parser returned', () => {
      describe('when run successfully', () => {
        it('should transform the result using the success function passed as parameter to map()', () => {
          const {
            parser,
          } = createParser({
            parseFunctionResult: {
              result: 'Light green :/',
              error: null,
            },
          });

          const successFunction = jest.fn(() => 'All green :D');

          const newParser = parser.map(successFunction);

          const parsed = newParser.run('3 4 3 4...');

          expect(parsed).toEqual({
            result: 'All green :D',
            error: null,
          });
        });
      });

      describe('when run with an error', () => {
        it('should transform the error using the error function passed as parameter to map()', () => {
          const {
            parser,
          } = createParser({
            parseFunctionResult: {
              result: null,
              error: 'Ooops!',
            },
          });

          const errorFunction = jest.fn(() => 'Fail!');

          const newParser = parser.map(() => ({}), errorFunction);

          const parsed = newParser.run('3 4 3 4...');

          expect(parsed).toEqual({
            result: null,
            error: 'Fail!',
          });
        });
      });
    });
  });
});
