const CharParser = require('./parsers/CharParser');
const StringParser = require('./parsers/StringParser');
const ManyParser = require('./parsers/ManyParser');
const ManyOrNoneParser = require('./parsers/ManyOrNoneParser');
const SequenceOfParser = require('./parsers/SequenceOfParser');
const AnyExceptParser = require('./parsers/AnyExceptParser');
const AnyOfParser = require('./parsers/AnyOfParser');

module.exports = {
  chr: (c, type) => new CharParser(c, type),
  str: (str, type) => new StringParser(str, type),
  many: (parser, type) => new ManyParser(parser, type),
  manyOrNone: (parser, type) => new ManyOrNoneParser(parser, type),
  sequenceOf: (parsers, type) => new SequenceOfParser(parsers, type),
  anyExcept: (parser, type) => new AnyExceptParser(parser, type),
  anyOf: (parsers, type) => new AnyOfParser(parsers, type),
};
