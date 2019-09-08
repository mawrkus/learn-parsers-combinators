const anyOf = require('../anyOf');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

describe('anyOf(parsers)', () => {
  it('should return a parser', () => {
    expect(anyOf([])).toBeInstanceOf(Parser);
  });

  describe('if some "parsers" are not instances of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => anyOf([chr('a'), {}, chr('z')])).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing a target string that can be matched by one of the parsers', () => {
      it('should return the correct parser state', () => {
        const xyz = anyOf([chr('a'), chr('x'), chr('b')]);
        const initialState = buildParserState({ remainingInput: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'yz',
          index: 1,
          result: 'x',
          error: null,
        });
      });
    });

    describe('when parsing a target string that cannot be matched by any of the parsers', () => {
      it('should return an error state', () => {
        const xyz = anyOf([chr('a'), chr('o'), chr('b')]);
        const initialState = buildParserState({ remainingInput: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'xyz',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const xyz = anyOf([chr('x'), chr('y'), chr('z')]);
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ remainingInput: 'xyz', error });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
