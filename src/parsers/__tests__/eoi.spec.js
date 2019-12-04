const eoi = require('../eoi');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

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
        const initialState = buildParserState({ input: '' });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: '',
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
        const initialState = buildParserState({ input: 'life is long' });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'life is long',
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
        const initialState = buildParserState({ input: 'life is short', error });

        const newParserState = endOfremainingInput.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
