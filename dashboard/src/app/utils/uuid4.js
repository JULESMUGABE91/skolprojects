module.exports = () =>
  Math.random().toString(36).slice(2, 7) + '' + new Date().getTime();
