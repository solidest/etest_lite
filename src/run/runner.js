const RpcTask = require('./core/rpctask');

let _post_sys_msg, _post_out_msgs;
let _proj;
let _run_uuid;
let _case_id;
let _srv;
let _timer;

class SdkApi {
    constructor(ip, port, cb) {
        this.ip = ip;
        this.port = port;
        this._srv = new RpcTask(ip, port, false, cb);
        this._srv.setup(_on_error);
    }

    _xfn(method, params) {
        return new Promise(resolve => {
            try {
                this._srv.sendTask({
                    method: method,
                    params: params
                }, (err, value) => {
                    if(err) {
                        return resolve({
                            result: 'error',
                            value: err.message||err,
                        });                        
                    }
                    return resolve({
                        result: 'ok',
                        value: value
                    }); 
                });
            } catch (error) {
                return resolve({
                    result: 'error',
                    value: error.message
                });
            }
        });
    }

    async make_env() {
        let env = {
            proj_id: _proj.id,
            prots: _proj.prots,
            xtras: _proj.xtras,
            topos: _proj.topos,
            libs: _proj.libs
        };
        return await this._xfn('makeenv', env);
    }

    async run_case(name, script, vars, option) {
        let info = {
            proj_id: _proj.id,
            script: script,
            vars: vars,
            option: option,
            rpath_src: './' + name + '.lua',
        }
        return await this._xfn('start', info);
    }

    async run_stop() {
        return await this._xfn('stop', {
            key: _run_uuid
        })
    }

    async run_out() {
        return await this._xfn('readout', {
            key: _run_uuid
        });
    }

    async state() {
        return await this._xfn('state', null);
    }

    async reply(answer) {
        answer.key = _run_uuid;
        return await this._xfn('reply', answer);
    }

    async cmd(command, params) {
        return await this._xfn('command', {
            key: run_id,
            command: command,
            params: params
        });
    }

}

function _on_runout(res) {
    if(res.result !== 'ok') {
        return _post_sys_msg(res, _proj.id);
    }

    let msglist = res.value;
    if(msglist.length===0) {
        return;
    }

    let exit = false;
    for (let msg of msglist) {
        //TODO save to db
        if (msg.catalog === 'system' && msg.kind === 'stop') {
            exit = true;
        }
    }

    if (exit) {
        //TODO save db to disk
        clearInterval(_timer);
        _run_uuid = null;
        _case_id = null;
    }

    return _post_out_msgs(msglist, _proj.id, _case_id)
}

function _start_readout() {
    if (_timer) {
        clearInterval(_timer);
    }
    _timer = setInterval(async () => {
        if (_srv && _run_uuid) {
            let res = await _srv.run_out();
            _on_runout(res);
        }
    }, 40);
}

function _on_error(err_msg) {
    if (_timer) {
        clearInterval(_timer);
    }
    _srv = null;
    _run_uuid = null;
    _case_id = null;
    _post_sys_msg({
        kind: 'error',
        value: err_msg
    }, _proj ? _proj.id : 0);
}

function _get_srv() {
    return new Promise((resolve) => {
        let ip = _proj.setting.etestd_ip;
        let port = _proj.setting.etestd_port;
        if (_srv && _srv.ip === ip && _srv.port === port) {
            return resolve({
                result: 'ok',
                value: _srv
            });
        }
        let srv = new SdkApi(ip, port, (err) => {
            if (err) {
                return resolve({
                    result: 'error',
                    value: '连接执行器失败:' + err.message
                });
            }
            _srv = srv;
            return resolve({
                result: 'ok',
                value: srv
            });
        });
    });
}

function setup(post_sys_msg, post_out_msgs) {
    _post_out_msgs = post_out_msgs;
    _post_sys_msg = post_sys_msg;
}

function set_proj(proj) {
    _proj = proj;
}

function get_proj() {
    return _proj;
}

async function run_case(id, remake) {
    let item = _proj.luas.find(it => it.id === id);
    let res = await _get_srv();
    if (res.result !== 'ok') {
        return res;
    }
    let srv = res.value;
    if (remake) {
        res = await srv.make_env();
        if (res.result !== 'ok') {
            return res;
        }
    }
    res = await srv.run_case(item.name, item.script, item.vars, item.option);
    if (res.result === 'ok') {
        _run_uuid = res.value;
        _case_id = id;
        _start_readout();
    }
    return res;
}

async function run_stop() {
    if (!_srv || !_run_uuid) {
        return {
            result: 'error',
            value: '没有需要停止的执行',
        };
    }
    return await _srv.run_stop();
}

export default {
    setup,
    set_proj,
    get_proj,
    run_case,
    run_stop,
}