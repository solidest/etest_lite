const net = require('net');


class NetWork {
    constructor(ip, port) {
        this._ip = ip;
        this._port = port;
        this._frm = new Frame();
    }

    on(event, callback) {
        if (event === 'recv') {
            this.on_recv = callback;
        } else if (event === 'error') {
            this.on_error = callback;
        }
    }

    open() {
        let self = this;
        return new Promise(resolve => {
            try {
                let socket = net.connect(this._port, this._ip, ()=> {
                    self._socket = socket;
                    return resolve({
                        result: 'ok'
                    });
                });
                socket.setKeepAlive(true, 1);

                socket.on('data', function (data) {
                    let body = self._frm.unpack(data);
                    while (body) {
                        self._recver.recvedTask(body);
                        body = self._frm.unpack(null);
                    }
                });

                socket.on('close', function () {
                    console.error('net close');
                });

                socket.on('error', function (err) {
                    self.close();
                    return (resolve({
                        result: err.message,
                    }));
                });

                socket.on('end', function () {
                    self.close();
                    if (self.on_error) {
                        return self.on_error('与执行器的连接已断开');
                    }
                });

                socket.on('timeout', function () {
                    self.close();
                    if (self.on_error) {
                        return self.on_error('连接执行器超时');
                    }
                });
            } catch (error) {
                return resolve({
                    result: 'error',
                    value: error.message,
                });
            }
        });
    }

    close() {
        this.on_error = null;
        this.on_recv = null;
        if (this._socket) {
            this._socket.destroy();
            this._socket = null;
        }
    }

    send(body) {
        if (!this._socket) {
            this._setupSocket();
        } else if (this._closed) {
            this._reconnect();
        }
        this._socket.write(Frame.pack(body));
    }

    // //重新连接
    // _reconnect() {
    //     if (this._socket && !this._socket.destroyed) {
    //         this._closed = false;
    //         this._socket.connect(this._port, this._ip);
    //         return;
    //     }
    //     this._setupSocket();
    // }

    // //设置socket
    // _setupSocket(cb) {

    //     let self = this;
    //     let socket = net.connect(this._port, this._ip, cb);
    //     self._socket = socket;
    //     self._closed = false;

    //     socket.setKeepAlive(true, 1);
    //     socket.on('data', function (data) {
    //         let body = self._frm.unpack(data);
    //         while (body) {
    //             self._recver.recvedTask(body); //接收回调
    //             body = self._frm.unpack(null);
    //         }
    //     });

    //     socket.on('close', function () {
    //         self._closed = true;
    //     });

    //     socket.on('error', function (err) {
    //         if (self.on_error) {
    //             return self.on_error(err.message);
    //         }
    //         if (cb) {
    //             return cb(err.message);
    //         }
    //         console.error('on_error', err);
    //     });

    //     socket.on('end', function () {
    //         if (self.on_error) {
    //             return self.on_error('ETestD退出');
    //         }
    //         if (cb) {
    //             return cb('ETestD退出');
    //         }
    //         console.error('ETestD退出');
    //     });

    //     socket.on('timeout', function () {
    //         if (self.on_error) {
    //             return self.on_error('连接执行器超时');
    //         }
    //         if (cb) {
    //             return cb('连接执行器超时');
    //         }
    //         console.error('on_timeout');
    //     });
    // }
}

module.exports = NetWork;