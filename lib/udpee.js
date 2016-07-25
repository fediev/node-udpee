const dgram = require('dgram');

function sendUDPMsg(buf, port, host) {
  const socket = dgram.createSocket('udp4');
  socket.send(buf, port, host, (err) => {
    if (err) {
      // TODO: better error handling
      console.warn('w sendUDPMsg()', err);
    }
    socket.close();
  });
}

function bindUDPServer(port, host, clbks) {
  const server = dgram.createSocket('udp4');

  // when `clbks` is a function, it will be a `message` event listener.
  if (typeof clbks === 'function') {
    _addEventListner(server, 'message', clbks);
  } else if (typeof clbks === 'object') {
    for (const evtName in clbks) {
      const listener = clbks[evtName];
      _addEventListner(server, evtName, listener);
    }
  }

  server.bind(port, host);
  return server;
}

function _addEventListner(emitter, event, handler) {
  if (typeof handler === 'function') {
    emitter.on(event, handler);
  }
}

module.exports = {
  sendUDPMsg,
  bindUDPServer,
};
