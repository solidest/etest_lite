
class RpcTask {
    constructor(ip, port, delay, cb) {
        this._tasks = [];
        this._nextid = 0;
        this._net = new NetWork(ip, port, delay, this, cb);
    }

    setup(on_error) {
        this.on_error = on_error;
        this._net.setup(on_error);
    }

    close() {
        this.on_error = null;
        if(this._net) {
            this._net.close();
            this._net = null;            
        }
    }

    sendTask(task_info, call_back) {
        task_info.id = ++this._nextid;
        this._tasks.push({info: task_info, cb: call_back});
        this._net.send(task_info);
        return task_info.id;
    }

    clear() {
        this._tasks = [];
    }

    recvedTask(recv_info) {
        let id = recv_info.id;
        let idx = this._tasks.findIndex(it => it.info.id===id);
        if(idx<0) {
            throw new Error('bad info:', JSON.stringify(recv_info));
        }
        let cb = this._tasks[idx].cb;
        this._tasks.splice(idx, 1);
        if(cb) {
            if(recv_info.error) {
                cb(recv_info.error, null, id);
            } else {
                cb(null, recv_info.result, id);
            }
        }
    }
}

module.exports = RpcTask;
