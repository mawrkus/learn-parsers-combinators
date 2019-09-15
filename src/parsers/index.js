const anyExcept = require('./anyExcept');
const anyOf = require('./anyOf');
const between = require('./between');
const chr = require('./chr');
const eoi = require('./eoi');
const lazy = require('./lazy');
const many = require('./many');
const manyOrNone = require('./manyOrNone');
const regex = require('./regex');
const sepBy = require('./sepBy');
const sequenceOf = require('./sequenceOf');
const str = require('./str');

/* function updateStateResult(parserState, result) {
  return {
    ...parserState,
    result,
    error: null,
  };
}

function updateStateError(parserState, error) {
  return {
    ...parserState,
    error,
    result: null,
  };
} */

module.exports = {
  /* updateStateResult,
  updateStateError, */
  anyExcept,
  anyOf,
  between,
  chr,
  eoi,
  lazy,
  many,
  manyOrNone,
  regex,
  sepBy,
  sequenceOf,
  str,
};
