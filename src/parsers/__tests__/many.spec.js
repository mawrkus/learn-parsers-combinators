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

describe('many(parser)', () => {
  it('should return a parser', () => {
    expect(many(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "parser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => many({})).toThrow(TypeError);
    });
  });

  describe('the parser', () => {
    describe('when run on a target string that can be matched at least once by the parser function', () => {
      it('should return the proper new parser state', () => {
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

    describe('when run on a target string that cannot be matched at least once by the parser function', () => {
      it('should return the proper error parser state', () => {
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

    describe('when called on an error parser state', () => {
      it('should do nothing but return it', () => {
        const manyX = many(chr('x'));
        const error = new ParserError('Ooops!');
        const initialState = buildParserState({ targetString: 'xxxy', error });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
