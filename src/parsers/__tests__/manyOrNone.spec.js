const manyOrNone = require('../manyOrNone');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

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
    describe('when parsing an input that can be matched at least once by "singleParser"', () => {
      it('should return the correct parser state', () => {
        const manyOrNoneX = manyOrNone(chr('x'));
        const initialState = buildParserState({ input: 'xxxy' });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'xxxy',
          remainingInput: 'y',
          index: 3,
          result: ['x', 'x', 'x'],
          error: null,
        });
      });
    });

    describe('when parsing an input that cannot be matched at least once by "singleParser"', () => {
      it('should return the correct parser state', () => {
        const manyOrNoneX = manyOrNone(chr('x'));
        const initialState = buildParserState({ input: 'yyz' });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'yyz',
          remainingInput: 'yyz',
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
        const initialState = buildParserState({ input: 'xxxy', error });

        const newParserState = manyOrNoneX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
