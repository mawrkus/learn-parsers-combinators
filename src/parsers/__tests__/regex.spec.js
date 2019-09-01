
const regex = require('../regex');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = (state) => ({
  targetString: '',
  index: 0,
  result: null,
  error: null,
  ...state,
});

describe('regex(regex, capture = false)', () => {
  it('should return a parser', () => {
    expect(regex(/x/)).toBeInstanceOf(Parser);
  });

  describe('if "regex" is not a regular expression', () => {
    it('should throw a TypeError', () => {
      expect(() => regex(null)).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an empty target string', () => {
      it('should return a parser error state', () => {
        const identifier = regex(/\w+/);
        const initialState = buildParserState({ targetString: '' });

        const newParserState = identifier.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when parsing a target string that "regex" matches', () => {
      describe('if "capture" is false', () => {
        it('should return the proper parser state', () => {
          const identifier = regex(/\w+/);
          const initialState = buildParserState({ targetString: 'Kode9 (=)' });

          const newParserState = identifier.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: ' (=)',
            index: 5,
            result: 'Kode9',
            error: null,
          });
        });
      });

      describe('if "capture" is true', () => {
        it('should return the proper parser state, using the first captured group', () => {
          const identifier = regex(/.+(\dpm)/, true);
          const initialState = buildParserState({ targetString: 'Kode9 live at 9pm at Apolo' });

          const newParserState = identifier.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: ' at Apolo',
            index: 17,
            result: '9pm',
            error: null,
          });
        });
      });
    });

    describe('when parsing a target string that "regex" does not match', () => {
      it('should return a parser error state', () => {
        const digits = regex(/$[0-9]+/);
        const initialState = buildParserState({ targetString: 'Kode9 (=)' });

        const newParserState = digits.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'Kode9 (=)',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const identifier = regex(/\w+/);
        const error = new ParserError('Ooops!');
        const initialState = buildParserState({ targetString: 'Kode9 (=)', error });

        const newParserState = identifier.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
