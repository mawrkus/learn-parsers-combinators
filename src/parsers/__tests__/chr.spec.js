const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('chr(expectedChar)', () => {
  it('should return a parser', () => {
    expect(chr('x')).toBeInstanceOf(Parser);
  });

  describe('if "expectedChar" is not a string', () => {
    it('should throw a TypeError', () => {
      expect(() => chr(null)).toThrow(TypeError);
    });
  });

  describe('if "expectedChar" is an empty string', () => {
    it('should throw a TypeError', () => {
      expect(() => chr('')).toThrow(TypeError);
    });
  });

  describe('if "expectedChar" is string with a length > 1', () => {
    it('should throw a TypeError', () => {
      expect(() => chr('xx')).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an empty input', () => {
      it('should return an error state', () => {
        const x = chr('x');
        const initialState = buildParserState({ input: '' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: '',
          remainingInput: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing an input whose first char is "expectedChar"', () => {
      it('should return the correct parser state', () => {
        const x = chr('x');
        const initialState = buildParserState({ input: 'xxx' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'xxx',
          remainingInput: 'xx',
          index: 1,
          result: 'x',
          error: null,
        });
      });
    });

    describe('when parsing an input whost first char is not "expectedChar"', () => {
      it('should return an error state', () => {
        const x = chr('x');
        const initialState = buildParserState({ input: 'yxx' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'yxx',
          remainingInput: 'yxx',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const x = chr('x');
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ input: 'xxx', error });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
