const many = require('../many');
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

describe('many(singleParser)', () => {
  it('should return a parser', () => {
    expect(many(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "singleParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => many({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing a target string that can be matched at least once by "singleParser" ', () => {
      it('should return the proper parser state', () => {
        const manyX = many(chr('x'));
        const initialState = buildParserState({ targetString: 'xxxy' });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'y',
          index: 3,
          result: ['x', 'x', 'x'],
          error: null,
        });
      });
    });

    describe('when parsing a target string that cannot be matched at least once by "singleParser" ', () => {
      it('should return a parser error state', () => {
        const manyX = many(chr('x'));
        const initialState = buildParserState({ targetString: 'yyz' });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'yyz',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const manyX = many(chr('x'));
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ targetString: 'xxxy', error });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
