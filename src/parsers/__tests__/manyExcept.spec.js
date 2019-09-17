const manyExcept = require('../manyExcept');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('manyExcept(exceptParser)', () => {
  it('should return a parser', () => {
    expect(manyExcept(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "exceptParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => manyExcept({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an input that can be matched at least once by "exceptParser"', () => {
      it('should return the correct parser state', () => {
        const manyExceptX = manyExcept(chr('x'));
        const initialState = buildParserState({ input: 'aaax' });

        const newParserState = manyExceptX.parseFunction(initialState);

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
        const manyExceptX = manyExcept(chr('x'));
        const initialState = buildParserState({ input: 'yyz' });

        const newParserState = manyExceptX.parseFunction(initialState);

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
        const manyExceptX = manyExcept(chr('x'));
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ input: 'xxxy', error });

        const newParserState = manyExceptX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
