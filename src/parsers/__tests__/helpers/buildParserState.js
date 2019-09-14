module.exports = (state) => ({
  remainingInput: state.input,
  index: 0,
  result: null,
  error: null,
  ...state,
});
