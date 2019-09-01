const anyExcept = require('../anyExcept');
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

describe('anyExcept(parser)', () => {
  it('should return a parser', () => {
    expect(anyExcept(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "parser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => anyExcept({})).toThrow(TypeError);
    });
  });

  describe('the parser', () => {
    describe('when run on a target string that can be matched at least once by the parser function', () => {
      it('should return the proper new parser state', () => {
        const anyExceptX = anyExcept(chr('x'));
        const initialState = buildParserState({ targetString: 'aaax' });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'x',
          index: 3,
          result: 'aaa',
          error: null,
        });
      });
    });

    describe('when run on a target string that cannot be matched at least once by the parser function', () => {
      it('should return the proper new parser state', () => {
        const anyExceptX = anyExcept(chr('x'));
        const initialState = buildParserState({ targetString: 'yyz' });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 3,
          result: 'yyz',
          error: null,
        });
      });
    });

    describe('when called on an error parser state', () => {
      it('should do nothing but return it', () => {
        const anyExceptX = anyExcept(chr('x'));
        const error = new ParserError('Ooops!');
        const initialState = buildParserState({ targetString: 'xxxy', error });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
