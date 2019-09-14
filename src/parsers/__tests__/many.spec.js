const many = require('../many');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

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
    describe('when parsing an input that can be matched only once by "singleParser" ', () => {
      it('should return the correct parser state', () => {
        const manyX = many(chr('x'));
        const initialState = buildParserState({ remainingInput: 'x' });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: '',
          index: 1,
          result: ['x'],
          error: null,
        });
      });
    });

    describe('when parsing an input that can be matched more than once by "singleParser" ', () => {
      it('should return the correct parser state', () => {
        const manyX = many(chr('x'));
        const initialState = buildParserState({ remainingInput: 'xxxy' });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'y',
          index: 3,
          result: ['x', 'x', 'x'],
          error: null,
        });
      });
    });

    describe('when parsing an input that cannot be matched at least once by "singleParser" ', () => {
      it('should return an error state', () => {
        const manyX = many(chr('x'));
        const initialState = buildParserState({ remainingInput: 'yyz' });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'yyz',
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
        const initialState = buildParserState({ remainingInput: 'xxxy', error });

        const newParserState = manyX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
