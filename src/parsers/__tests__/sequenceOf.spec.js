const sequenceOf = require('../sequenceOf');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('sequenceOf(parsers)', () => {
  it('should return a parser', () => {
    expect(sequenceOf([])).toBeInstanceOf(Parser);
  });

  describe('if some "parsers" are not instances of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => sequenceOf([chr('a'), {}, chr('z')])).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an input that can be matched by the sequence of parsers', () => {
      it('should return the correct parser state', () => {
        const xyz = sequenceOf([chr('x'), chr('y'), chr('z')]);
        const initialState = buildParserState({ input: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'xyz',
          remainingInput: '',
          index: 3,
          result: ['x', 'y', 'z'],
          error: null,
        });
      });
    });

    describe('when parsing an input that cannot be matched by the sequence of parsers', () => {
      it('should return an error state', () => {
        const xyz = sequenceOf([chr('x'), chr('o'), chr('z')]);
        const initialState = buildParserState({ input: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'xyz',
          remainingInput: 'yz',
          index: 1,
          result: ['x'],
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const xyz = sequenceOf([chr('x'), chr('y'), chr('z')]);
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ input: 'xyz', error });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
