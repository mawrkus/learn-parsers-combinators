const lazy = require('../lazy');
const Parser = require('../../Parser');

describe('lazy(parserThunk)', () => {
  it('should return a parser', () => {
    expect(lazy(() => {})).toBeInstanceOf(Parser);
  });

  describe('if "parserThunk" is not a function', () => {
    it('should throw a TypeError', () => {
      expect(() => lazy({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when run on a given string', () => {
      it('should call "parseThunk" and use its return value as a parser to parse the given string', () => {
        const parser = {
          parseFunction: jest.fn(),
        };
        const parserThunk = jest.fn(() => parser);
        const lazyParser = lazy(parserThunk);

        lazyParser.run('42');

        expect(parserThunk).toHaveBeenCalled();

        expect(parser.parseFunction).toHaveBeenCalledWith({
          originalString: '42',
          targetString: '42',
          index: 0,
          result: null,
          error: null,
        });
      });

      it('should return the result of the parsing of the given string', () => {
        const parser = {
          parseFunction: jest.fn(() => 'fourty-two'),
        };
        const lazyParser = lazy(() => parser);

        const result = lazyParser.run('42');

        expect(result).toBe('fourty-two');
      });
    });
  });
});
