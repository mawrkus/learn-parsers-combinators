const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

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
    describe('when parsing an empty target string', () => {
      it('should return a parser error state', () => {
        const x = chr('x');
        const initialState = buildParserState({ targetString: '' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing a target string whose first char is "expectedChar"', () => {
      it('should return the proper parser state', () => {
        const x = chr('x');
        const initialState = buildParserState({ targetString: 'xxx' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'xx',
          index: 1,
          result: 'x',
          error: null,
        });
      });
    });

    describe('when parsing a target string whost first char is not "expectedChar"', () => {
      it('should return a parser error state', () => {
        const x = chr('x');
        const initialState = buildParserState({ targetString: 'yxx' });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'yxx',
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
        const initialState = buildParserState({ targetString: 'xxx', error });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
