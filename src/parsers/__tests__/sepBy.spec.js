const sepBy = require('../sepBy');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('sepBy(sepParser)', () => {
  it('should return a factory function sepByFactory(valueParser)', () => {
    expect(sepBy(chr(','))).toBeInstanceOf(Function);
  });

  describe('if "sepParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => sepBy({})).toThrow(TypeError);
    });
  });

  describe('sepByFactory(valueParser)', () => {
    it('should return a parser', () => {
      const sepBySlashes = sepBy(chr(','));
      const parser = sepBySlashes(chr('x'));
      expect(parser).toBeInstanceOf(Parser);
    });

    describe('if "valueParser" is not an instance of the "Parser" class', () => {
      it('should throw a TypeError', () => {
        const sepBySlashes = sepBy(chr(','));
        expect(() => sepBySlashes({})).toThrow(TypeError);
      });
    });

    describe('the parser returned sepBy(chr(","))(chr("x"))', () => {
      describe('when parsing the input "x', () => {
        it('should return the correct parser state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x',
            remainingInput: '',
            index: 1,
            result: ['x'],
            error: null,
          });
        });
      });

      describe('when parsing the input "x)"', () => {
        it('should return the correct parser state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x)' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x)',
            remainingInput: ')',
            index: 1,
            result: ['x'],
            error: null,
          });
        });
      });

      describe('when parsing the input "x,x"', () => {
        it('should return the correct parser state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,x',
            remainingInput: '',
            index: 3,
            result: ['x', 'x'],
            error: null,
          });
        });
      });

      describe('when parsing the input "x,x)"', () => {
        it('should return the correct parser state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x)' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,x)',
            remainingInput: ')',
            index: 3,
            result: ['x', 'x'],
            error: null,
          });
        });
      });

      describe('when parsing the input "xx,"', () => {
        it('should return the correct parser state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'xx,' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'xx,',
            remainingInput: 'x,',
            index: 1,
            result: ['x'],
            error: null,
          });
        });
      });

      describe('when parsing the input "y"', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'y' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'y',
            remainingInput: 'y',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the input "x,"', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,',
            remainingInput: '',
            index: 2,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the input ",x"', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: ',x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: ',x',
            remainingInput: ',x',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the input ",,x"', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: ',,x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: ',,x',
            remainingInput: ',,x',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the input "x,x,"', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x,' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,x,',
            remainingInput: '',
            index: 4,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing an empty input', () => {
        it('should return an error state', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ input: '' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: '',
            remainingInput: '',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when called on a parser error state', () => {
        it('should do nothing but return it', () => {
          const sepBySlashes = sepBy(chr(','));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const error = new ParserError('ParserError', 'Ooops!', '', {});
          const initialState = buildParserState({ input: 'xyz', error });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual(initialState);
        });
      });
    });
  });
});
