const anyExcept = require('../anyExcept');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('anyExcept(exceptParser)', () => {
  it('should return a parser', () => {
    expect(anyExcept(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "exceptParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => anyExcept({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an input that can be matched at least once by "exceptParser"', () => {
      it('should return the correct parser state', () => {
        const anyExceptX = anyExcept(chr('x'));
        const initialState = buildParserState({ input: 'aaax' });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'aaax',
          remainingInput: 'x',
          index: 3,
          result: 'aaa',
          error: null,
        });
      });
    });

    describe('when parsing an input that cannot be matched at least once by "exceptParser"', () => {
      it('should return the correct parser state', () => {
        const anyExceptX = anyExcept(chr('x'));
        const initialState = buildParserState({ input: 'yyz' });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'yyz',
          remainingInput: '',
          index: 3,
          result: 'yyz',
          error: null,
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const anyExceptX = anyExcept(chr('x'));
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ input: 'xxxy', error });

        const newParserState = anyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
