/* eslint-disable no-unused-expressions */
const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const udpee = require('../lib/udpee');

const HOST = 'localhost';
const PORT = 45688;

describe('udpee', () => {
  describe('bindUDPServer()', () => {
    let server;
    const buf = Buffer.from('_MSG_VIA_UDP_', 'utf8');
    afterEach((done) => {
      try {
        server.close(done);
      } catch (e) {
        // eslint-disable-next-line callback-return
        done();
      }
    });

    it('should receive a message', (done) => {
      server = udpee.bindUDPServer(PORT, HOST);
      server.on('message', (msg) => {
        msg.should.eql(buf);
        done();
      });
      udpee.sendUDPMsg(buf, PORT, HOST);
    });
    it('should set `message` listener by function', (done) => {
      const listener = (msg, rinfo) => {
        msg.should.eql(buf);
        rinfo.size.should.eql(buf.length);
        done();
      };
      server = udpee.bindUDPServer(PORT, HOST, listener);
      udpee.sendUDPMsg(buf, PORT, HOST);
    });
    it('should set `message` listener by object', (done) => {
      const eventName = 'message';
      const listener = (msg, rinfo) => {
        msg.should.eql(buf);
        rinfo.size.should.eql(buf.length);
        done();
      };
      server = udpee.bindUDPServer(PORT, HOST, { [eventName]: listener });
      udpee.sendUDPMsg(buf, PORT, HOST);
    });
    it('should set `listening` listener by object', (done) => {
      const eventName = 'listening';
      const listener = () => {
        done();
      };
      server = udpee.bindUDPServer(PORT, HOST, { [eventName]: listener });
    });
    it('should set `error` listener by object', (done) => {
      const eventName = 'error';
      const listener = (err) => {
        err.should.be.an('error');
        done();
      };
      server = udpee.bindUDPServer(PORT, '10.0.0.1', { [eventName]: listener });
    });
    it('should set `close` listener by object', (done) => {
      const eventName = 'close';
      const listener = () => {
        done();
      };
      const server2 = udpee.bindUDPServer(PORT, HOST,
                                          { [eventName]: listener });
      server2.close();
    });
  });

  describe('sendUDPMsg()', () => {
    let server;
    beforeEach((done) => {
      server = udpee.bindUDPServer(PORT, HOST, {
        listening: done,
      });
    });
    afterEach((done) => {
      server.close(done);
    });

    it('should send a string message', (done) => {
      const buf = Buffer.from('_MSG_VIA_UDP_', 'utf8');
      server.on('message', (msg, rinfo) => {
        msg.should.eql(buf);
        rinfo.size.should.eql(buf.length);
        done();
      });
      udpee.sendUDPMsg(buf, PORT, HOST);
    });
    it('should send a binary message', (done) => {
      const buf = Buffer.from('0102030405060708090a', 'hex');
      server.on('message', (msg, rinfo) => {
        msg.should.eql(buf);
        rinfo.size.should.eql(buf.length);
        done();
      });
      udpee.sendUDPMsg(buf, PORT, HOST);
    });
  });
});
