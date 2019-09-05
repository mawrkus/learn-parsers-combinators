const sepBy = require('../sepBy');
const chr = require('../chr');
const Parser = require('../../Parser');
const ParserError = require('../../ParserError');

const buildParserState = require('./buildParserState');

describe('sepBy(sepParser)', () => {
  it('should return a factory function sepByFactory(valueParser)', () => {
    expect(sepBy(chr('/'))).toBeInstanceOf(Function);
  });

  describe('if "sepParser" is not an instance of the "Parser" class', () => {
    it('should throw a TypeError', () => {
      expect(() => sepBy({})).toThrow(TypeError);
    });
  });

  describe('sepByFactory(valueParser)', () => {
    it('should return a parser', () => {
      const sepBySlashes = sepBy(chr('/'));
      const parser = sepBySlashes(chr('x'));
      expect(parser).toBeInstanceOf(Parser);
    });

    describe('if "valueParser" is not an instance of the "Parser" class', () => {
      it('should throw a TypeError', () => {
        const sepBySlashes = sepBy(chr('/'));
        expect(() => sepBySlashes({})).toThrow(TypeError);
      });
    });

    describe('the parser returned SepBy(chr("x"))(chr("/"))', () => {
      describe('when parsing the target string "x', () => {
        it('should return the proper parser state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '',
            index: 1,
            result: ['x'],
            error: null,
          });
        });
      });

      describe('when parsing the target string "y"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'y' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: 'y',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the target string "x/"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'x/' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '',
            index: 2,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the target string "xx/"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'xx/' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: 'x/',
            index: 1,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the target string "//x"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: '//x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '//x',
            index: 0,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the target string "x/x"', () => {
        it('should return the proper parser state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'x/x' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '',
            index: 3,
            result: ['x', 'x'],
            error: null,
          });
        });
      });

      describe('when parsing the target string "x/x/"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'x/x/' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '',
            index: 4,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when parsing the target string "x/x//"', () => {
        it('should return a parser error state', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const initialState = buildParserState({ targetString: 'x/x//' });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual({
            targetString: '/',
            index: 4,
            result: null,
            error: expect.any(ParserError),
          });
        });
      });

      describe('when called on a parser error state', () => {
        it('should do nothing but return it', () => {
          const sepBySlashes = sepBy(chr('/'));
          const xSepBySlashes = sepBySlashes(chr('x'));
          const error = new ParserError('ParserError', 'Ooops!', '', {});
          const initialState = buildParserState({ targetString: 'xyz', error });

          const newParserState = xSepBySlashes.parseFunction(initialState);

          expect(newParserState).toEqual(initialState);
        });
      });
    });
  });
});
