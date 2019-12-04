const sepByOrNone = require('../sepByOrNone');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./helpers/buildParserState');

describe('sepByOrNone(sepParser)', () => {
  it('should return a factory function sepByOrNoneFactory(valueParser)', () => {
    expect(sepByOrNone(chr(','))).toBeInstanceOf(Function);
  });

  describe('if "sepParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => sepByOrNone({})).toThrow(TypeError);
    });
  });

  describe('sepByOrNoneFactory(valueParser)', () => {
    it('should return a parser', () => {
      const sepByOrNoneSlashes = sepByOrNone(chr(','));
      const parser = sepByOrNoneSlashes(chr('x'));
      expect(parser).toBeInstanceOf(Parser);
    });

    describe('if "valueParser" is not an instance of the "Parser" class', () => {
      it('should throw a TypeError', () => {
        const sepByOrNoneSlashes = sepByOrNone(chr(','));
        expect(() => sepByOrNoneSlashes({})).toThrow(TypeError);
      });
    });

    describe('the parser returned sepByOrNone(chr(","))(chr("x"))', () => {
      describe('when parsing the input "x', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

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
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x)' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

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
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

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
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x)' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

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
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'xx,' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

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
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'y' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'y',
            remainingInput: 'y',
            index: 0,
            result: [],
            error: null,
          });
        });
      });

      describe('when parsing the input "x,"', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,',
            remainingInput: '',
            index: 2,
            result: [],
            error: null,
          });
        });
      });

      describe('when parsing the input ",x"', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: ',x' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: ',x',
            remainingInput: ',x',
            index: 0,
            result: [],
            error: null,
          });
        });
      });

      describe('when parsing the input ",,x"', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: ',,x' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: ',,x',
            remainingInput: ',,x',
            index: 0,
            result: [],
            error: null,
          });
        });
      });

      describe('when parsing the input "x,x,"', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: 'x,x,' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: 'x,x,',
            remainingInput: '',
            index: 4,
            result: [],
            error: null,
          });
        });
      });

      describe('when parsing an empty input', () => {
        it('should return the correct parser state', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const initialState = buildParserState({ input: '' });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            input: '',
            remainingInput: '',
            index: 0,
            result: [],
            error: null,
          });
        });
      });

      describe('when called on a parser error state', () => {
        it('should do nothing but return it', () => {
          const sepByOrNoneSlashes = sepByOrNone(chr(','));
          const xSepByOrNoneSlashes = sepByOrNoneSlashes(chr('x'));
          const error = new ParserError('ParserError', 'Ooops!', '', {});
          const initialState = buildParserState({ input: 'xyz', error });

          const newParserState = xSepByOrNoneSlashes.parseFunction(initialState);

          expect(newParserState).toEqual(initialState);
        });
      });
    });
  });
});
