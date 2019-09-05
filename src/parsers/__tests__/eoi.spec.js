const eoi = require('../eoi');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

describe('eoi()', () => {
  it('should return a parser', () => {
    expect(eoi()).toBeInstanceOf(Parser);
  });

  describe('the parser returned', () => {
    it('should expose an "end of input" (EOI) symbol', () => {
      const endOfInput = eoi();

      expect(typeof endOfInput.eoiSymbol).toBe('symbol');
    });

    describe('when parsing an empty target string', () => {
      it('should return the proper parser state', () => {
        const endOfInput = eoi();
        const initialState = buildParserState({ targetString: '' });

        const newParserState = endOfInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: '',
          index: 0,
          result: endOfInput.eoiSymbol,
          error: null,
        });
      });
    });

    describe('when parsing a non-empty target string', () => {
      it('should return a parser error state', () => {
        const endOfInput = eoi();
        const initialState = buildParserState({ targetString: 'life is long' });

        const newParserState = endOfInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          targetString: 'life is long',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const endOfInput = eoi();
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ targetString: 'life is short', error });

        const newParserState = endOfInput.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
