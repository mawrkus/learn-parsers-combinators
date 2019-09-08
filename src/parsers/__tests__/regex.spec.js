
const regex = require('../regex');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

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
    describe('if "capture" is false', () => {
      describe('when parsing a target string that "regex" matches', () => {
        it('should return the correct parser state (/\\w+/)', () => {
          const identifier = regex(/\w+/);
          const initialState = buildParserState({ remainingInput: '*** Kode9 (=)' });

          const newParserState = identifier.parseFunction(initialState);

          expect(newParserState).toEqual({
            remainingInput: ' (=)',
            index: 9,
            result: 'Kode9',
            error: null,
          });
        });

        it('should return the correct parser state (/[a-z]+$/)', () => {
          const letters = regex(/[a-z]+$/);
          const initialState = buildParserState({ remainingInput: '1 2 1 2... the earth is flat' });

          const newParserState = letters.parseFunction(initialState);

          expect(newParserState).toEqual({
            remainingInput: '',
            index: 28,
            result: 'flat',
            error: null,
          });
        });

        it('should return the correct parser state (/^[a-z]+/)', () => {
          const letters = regex(/^[a-z]+/);
          const initialState = buildParserState({ remainingInput: 'welcome to the world' });

          const newParserState = letters.parseFunction(initialState);

          expect(newParserState).toEqual({
            remainingInput: ' to the world',
            index: 7,
            result: 'welcome',
            error: null,
          });
        });
      });

      describe('when parsing an empty target string', () => {
        it('should return an error state', () => {
          const digits = regex(/[0-9]*/);
          const initialState = buildParserState({ remainingInput: '' });

          const newParserState = digits.parseFunction(initialState);

          expect(newParserState).toEqual({
            remainingInput: '',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });
    });

    describe('if "capture" is true', () => {
      it('should return the correct parser state, using the first captured group', () => {
        const identifier = regex(/.+(\dpm)/, true);
        const initialState = buildParserState({ remainingInput: 'Kode9 live at 9pm at Apolo' });

        const newParserState = identifier.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: ' at Apolo',
          index: 17,
          result: '9pm',
          error: null,
        });
      });

      describe('when parsing an empty target string', () => {
        it('should return the correct parser state (/[0-9]*/)', () => {
          const digits = regex(/([0-9]*)/, true);
          const initialState = buildParserState({ remainingInput: '' });

          const newParserState = digits.parseFunction(initialState);

          expect(newParserState).toEqual({
            remainingInput: '',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });
    });

    describe('when parsing a target string that "regex" does not match', () => {
      it('should return an error state', () => {
        const digits = regex(/$[0-9]+/);
        const initialState = buildParserState({ remainingInput: 'Kode9 (=)' });

        const newParserState = digits.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'Kode9 (=)',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const identifier = regex(/\w+/);
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ remainingInput: 'Kode9 (=)', error });

        const newParserState = identifier.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
