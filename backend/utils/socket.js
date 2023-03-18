module.exports = (name, data) => {
  global.io.sockets.emit(name, data);
};
