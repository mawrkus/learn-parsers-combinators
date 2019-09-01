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

  describe('the parser', () => {
    describe('when parsing an empty target string', () => {
      it('should return the proper error parser state', () => {
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

    describe('when parsing a target string which 1st char matches "expectedChar"', () => {
      it('should return the proper new parser state', () => {
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

    describe('when parsing a target string which 1st char does not match "expectedChar"', () => {
      it('should return the proper error parser state', () => {
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

    describe('when called on an error parser state', () => {
      it('should do nothing but return it', () => {
        const x = chr('x');
        const error = new ParserError('Ooops!');
        const initialState = buildParserState({ targetString: 'xxx', error });

        const newParserState = x.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
