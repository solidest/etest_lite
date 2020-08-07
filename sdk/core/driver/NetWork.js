const net = require('net');
const Frame = require('./Frame');

class NetWork {

    on(event, callback) {
        if (event === 'recv') {
            this.on_recv = callback;
        } else if (event === 'error') {
            this.on_error = callback;
        }
    }

    is_open() {
        return !!this._socket;
    }

    open(ip, port) {
        if(ip && port) {
            this._ip = ip;
            this._port = port;            
        }
        this._frm = new Frame();

        let self = this;
        return new Promise(resolve => {
            try {
                self._timer = setTimeout(() => {
                    return resolve({
                        result: 'error',
                        value: '连接执行器失败',
                    })
                }, 600);

                let socket = net.connect(this._port, this._ip, ()=> {
                    self._socket = socket;

                    socket.on('data', function (data) {
                        let body = self._frm.unpack(data);
                        while (body) {
                            self.on_recv.recvedTask(body);
                            body = self._frm.unpack(null);
                        }
                    });
                    return resolve({
                        result: 'ok'
                    });
                });
                socket.setKeepAlive(true, 1);

                socket.on('close', function () {
                    if(self._timer) {
                        self.close();
                    }
                    console.error('net close');
                });

                socket.on('error', function (err) {
                    self.close();
                    return (resolve({
                        result: 'error',
                        value: err.message,
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
        if(this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this._socket) {
            this._socket.destroy();
            this._socket = null;
        }
    }

    send(body) {
        if (!this._socket) {
            if(this.on_error) {
                this.on_error('未连接执行器');
            } else {
                console.error('_socket is null');
            }
        }
        this._socket.write(Frame.pack(body));
    }
}

module.exports = NetWork;