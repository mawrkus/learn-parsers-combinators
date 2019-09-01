const manyOrNone = require('../manyOrNone');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = (state) => ({
  targetString: '',
  index: 0,
  result: null,
  error: null,
  ...state,
});

describe('manyOrNone(singleParser)', () => {
  it('should return a parser', () => {
    expect(manyOrNone(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "singleParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => manyOrNone({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing a target string that can be matched at least once by "singleParser" ', () => {
      it('should return the proper parser state', () => {
        const manyOrNoneX = manyOrNone(chr('x'));
        const initialState = buildParserState({ targetString: 'xxxy' });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'y',
          index: 3,
          result: ['x', 'x', 'x'],
          error: null,
        });
      });
    });

    describe('when parsing a target string that cannot be matched at least once by "singleParser" ', () => {
      it('should return the proper parser state', () => {
        const manyOrNoneX = manyOrNone(chr('x'));
        const initialState = buildParserState({ targetString: 'yyz' });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'yyz',
          index: 0,
          result: [],
          error: null,
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const manyOrNoneX = manyOrNone(chr('x'));
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ targetString: 'xxxy', error });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
