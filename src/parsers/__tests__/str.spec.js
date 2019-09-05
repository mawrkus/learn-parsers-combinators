const str = require('../str');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

describe('str(expectedString)', () => {
  it('should return a parser', () => {
    expect(str('x')).toBeInstanceOf(Parser);
  });

  describe('if "expectedString" is not a string', () => {
    it('should throw a TypeError', () => {
      expect(() => str(null)).toThrow(TypeError);
    });
  });

  describe('if "expectedString" is an empty string', () => {
    it('should throw a TypeError', () => {
      expect(() => str('')).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an empty target string', () => {
      it('should return a parser error state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ targetString: '' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing a target string that does not start with "expectedString"', () => {
      it('should return a parser error state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ targetString: 'its name was rosebud' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'its name was rosebud',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing a target string that starts with "expectedString"', () => {
      it('should return the proper parser state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ targetString: 'rosebud was its name' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: ' was its name',
          index: 7,
          result: 'rosebud',
          error: null,
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const rosebud = str('rosebud');
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ targetString: 'xxx', error });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
