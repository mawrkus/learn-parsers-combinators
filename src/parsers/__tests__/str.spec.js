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
    describe('when parsing an empty input', () => {
      it('should return an error state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ remainingInput: '' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing an input that does not start with "expectedString"', () => {
      it('should return an error state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ remainingInput: 'its name was rosebud' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'its name was rosebud',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing an input that starts with "expectedString"', () => {
      it('should return the correct parser state', () => {
        const rosebud = str('rosebud');
        const initialState = buildParserState({ remainingInput: 'rosebud was its name' });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: ' was its name',
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
        const initialState = buildParserState({ remainingInput: 'xxx', error });

        const newParserState = rosebud.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
