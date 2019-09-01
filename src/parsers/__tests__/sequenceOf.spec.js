const sequenceOf = require('../sequenceOf');
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

describe('sequenceOf(parsers)', () => {
  it('should return a parser', () => {
    expect(sequenceOf([])).toBeInstanceOf(Parser);
  });

  describe('if some "parsers" are not instances of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => sequenceOf([chr('a'), {}, chr('z')])).toThrow(TypeError);
    });
  });

  describe('the parser', () => {
    describe('when parsing a target string that can be matched by the sequence of parser functions', () => {
      it('should return the proper new parser state', () => {
        const xyz = sequenceOf([chr('x'), chr('y'), chr('z')]);
        const initialState = buildParserState({ targetString: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 3,
          result: ['x', 'y', 'z'],
          error: null,
        });
      });
    });

    describe('when parsing a target string that cannot be matched by the sequence of parser functions', () => {
      it('should return the proper error parser state', () => {
        const xyz = sequenceOf([chr('x'), chr('o'), chr('z')]);
        const initialState = buildParserState({ targetString: 'xyz' });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'yz',
          index: 1,
          result: ['x'],
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on an error parser state', () => {
      it('should do nothing but return it', () => {
        const xyz = sequenceOf([chr('x'), chr('y'), chr('z')]);
        const error = new ParserError('Ooops!');
        const initialState = buildParserState({ targetString: 'xyz', error });

        const newParserState = xyz.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
