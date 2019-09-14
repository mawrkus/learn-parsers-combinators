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
      const endOfremainingInput = eoi();

      expect(typeof endOfremainingInput.eoiSymbol).toBe('symbol');
    });

    describe('when parsing an empty input', () => {
      it('should return the correct parser state', () => {
        const endOfremainingInput = eoi();
        const initialState = buildParserState({ remainingInput: '' });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: '',
          index: 0,
          result: endOfremainingInput.eoiSymbol,
          error: null,
        });
      });
    });

    describe('when parsing a non-empty input', () => {
      it('should return an error state', () => {
        const endOfremainingInput = eoi();
        const initialState = buildParserState({ remainingInput: 'life is long' });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          remainingInput: 'life is long',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const endOfremainingInput = eoi();
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ remainingInput: 'life is short', error });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
