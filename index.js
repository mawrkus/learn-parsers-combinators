const CharParser = require('./CharParser');
const StringParser = require('./StringParser');
const ManyParser = require('./ManyParser');
const SequenceOfParser = require('./SequenceOfParser');
const AnyExceptParser = require('./AnyExceptParser');
const AnyOfParser = require('./AnyOfParser');

module.exports = {
  chr: (c, type) => new CharParser(c, type),
  str: (str, type) => new StringParser(str, type),
  many: (parser, type) => new ManyParser(parser, type),
  sequenceOf: (parsers, type) => new SequenceOfParser(parsers, type),
  anyExcept: (parser, type) => new AnyExceptParser(parser, type),
  anyOf: (parsers, type) => new AnyOfParser(parsers, type),
};
