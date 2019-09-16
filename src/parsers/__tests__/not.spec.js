const not = require('../not');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

fdescribe('not(parser)', () => {
  it('should return a parser', () => {
    expect(not(chr('x'))).toBeInstanceOf(Parser);
  });

  describe('if "parser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => not({})).toThrow(TypeError);
    });
  });

  describe('the parser returned', () => {
    describe('when parsing an input that cannot be matched by "parser"', () => {
      it('should return the correct parser state', () => {
        const notX = not(chr('x'));
        const initialState = buildParserState({ input: 'y' });

        const newParserState = notX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'y',
          remainingInput: '',
          index: 1,
          result: 'y',
          error: null,
        });
      });
    });

    describe('when parsing an input that can be matched by "parser"', () => {
      it('should return an error state', () => {
        const notX = not(chr('x'));
        const initialState = buildParserState({ input: 'x' });

        const newParserState = notX.parseFunction(initialState);

        expect(newParserState).toEqual({
          input: 'x',
          remainingInput: 'x',
          index: 0,
          result: null,
          error: expect.any(ParserError),
        });
      });
    });

    describe('when called on a parser error state', () => {
      it('should do nothing but return it', () => {
        const notX = not(chr('x'));
        const error = new ParserError('ParserError', 'Ooops!', '', {});
        const initialState = buildParserState({ input: 'y', error });

        const newParserState = notX.parseFunction(initialState);

        expect(newParserState).toEqual(initialState);
      });
    });
  });
});
