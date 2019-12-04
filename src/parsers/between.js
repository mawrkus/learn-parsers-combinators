const sequenceOf = require('./sequenceOf');

module.exports = (leftParser, rightParser) => (contentParser) => sequenceOf([
  leftParser,
  contentParser,
  rightParser,
])
  .map((results) => results[1]);
