# node-udpee

node udp helper

# Install

```
npm install udpee
```

# How to use

- sendUDPMsg(buf, port, host)

```
const udpee = require('udpee');
const PORT = 10190;
const HOST = 'localhost';
const buf = Buffer.from('Hello World', 'utf8');
sendUDPMsg(buf, port, host);
```

- bindUDPServer(port, host, clbks)

When `clbks` is a function, it will be a `message` event handler.

```
const udpee = require('udpee');
const PORT = 40190;
const HOST = 'localhost';
const listener = (msg, rinfo) => {
  console.log(msg.toString(), rinfo);
};
const server = udpee.bindUDPServer(PORT, HOST, listener);

const buf = Buffer.from('Hello World', 'utf8');
udpee.sendUDPMsg(buf, PORT, HOST);
setTimeout(() => server.close(), 1000);
```

When `clbks` is an object, `clbks`'s keys will be used as event names and
values will be used as event listners.

```
const udpee = require('udpee');
const PORT = 40190;
const HOST = 'localhost';
const listeners = {
  listening: () => { console.log('listening'); },
  message: (msg, rinfo) => {
    console.log('message', msg.toString(), rinfo);
  },
  errer: (err) => { console.log('error', err); },
  close: () => { console.log('close'); },
};
const server = udpee.bindUDPServer(PORT, HOST, listeners);

const buf = Buffer.from('Hello World', 'utf8');
udpee.sendUDPMsg(buf, PORT, HOST);
setTimeout(() => server.close(), 1000);
```
