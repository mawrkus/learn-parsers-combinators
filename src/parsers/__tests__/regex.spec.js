
const regex = require('../regex');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('regex(re)', () => {
  it('should return a parser', () => {
    expect(regex(/^x/)).toBeInstanceOf(Parser);
  });

  describe('if "regex" does not start with the "^" metacharacter', () => {
    it('should throw a TypeError', () => {
      expect(() => regex(/x/)).toThrow(TypeError);
    });
  });

  describe('if "regex" is not a regular expression', () => {
    it('should throw a TypeError', () => {
      expect(() => regex(null)).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an input that "re" matches', () => {
      it('should return the proper parser state (/^\\w+/)', () => {
        const identifier = regex(/^\w+/);
        const initialState = buildParserState({ input: 'Kode9 (=)' });

        const newParserState = identifier.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'Kode9 (=)',
          remainingInput: ' (=)',
          index: 5,
          result: 'Kode9',
          error: null,
        });
      });

      it('should return the proper parser state (/^[12 ]+/)', () => {
        const letters = regex(/^[12 ]+/);
        const initialState = buildParserState({ input: '1 2 1 2... the earth is flat' });

        const newParserState = letters.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: '1 2 1 2... the earth is flat',
          remainingInput: '... the earth is flat',
          index: 7,
          result: '1 2 1 2',
          error: null,
        });
      });

      it('should return the proper parser state (/^[a-z]*/)', () => {
        const letters = regex(/^[a-z]*/);
        const initialState = buildParserState({ input: '3 4 3 4...' });

        const newParserState = letters.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: '3 4 3 4...',
          remainingInput: '3 4 3 4...',
          index: 0,
          result: '',
          error: null,
        });
      });
    });

    describe('when parsing an empty input', () => {
      it('should return a parser error state (/^[0-9]*/)', () => {
        const digits = regex(/^[0-9]*/);
        const initialState = buildParserState({ input: '' });

        const newParserState = digits.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: '',
          remainingInput: '',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });
  });

  describe('when parsing an input that "re" does not match', () => {
    it('should return a parser error state (/^[0-9]+/)', () => {
      const digits = regex(/^[0-9]+/);
      const initialState = buildParserState({ input: 'Kode9 (=)' });

      const newParserState = digits.parseFunction(initialState);

      expect(newParserState).toEqual({
        input: 'Kode9 (=)',
        remainingInput: 'Kode9 (=)',
        index: 0,
        result: null,
        error: expect.any(ParserError),
      });
    });
  });

  describe('when called on a parser error state', () => {
    it('should do nothing but return it', () => {
      const identifier = regex(/^\w+/);
      const error = new ParserError('ParserError', 'Ooops!', '', {});
      const initialState = buildParserState({ input: 'Kode9 (=)', error });

      const newParserState = identifier.parseFunction(initialState);

      expect(newParserState).toEqual(initialState);
    });
  });
});
