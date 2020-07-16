const RpcTask = require('./core/rpctask');

let _post_msg;
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

    //执行服务器api
    _xfn(method, params, callback) {
        try {
            return this._srv.sendTask({
                method: method,
                params: params
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error, null);
            }
        }
    }

    make_env(cb) {
        try {
            let env = {
                proj_id: _proj.id,
                prots: _proj.prots,
                xtras: _proj.xtras,
                topos: _proj.topos,
                libs: _proj.libs
            };
            return this._xfn('makeenv', env, (error) => {
                if(error) {
                    _post_msg('system', 'error', _proj.id, 0, {
                        message: error.message
                    });
                } else {
                    _post_msg('system', 'info', _proj.id, 0, {
                        message: 'ETL执行环境生成完毕'
                    });
                    if(cb) {
                        cb();
                    }
                }
            });
        } catch (error) {
            _post_msg('system', 'error', _proj.id, 0, {
                message: error.message
            });
        }
    }

    run_case(proj_id, case_id, name, script, vars, option) {
        try {
            let info = {
                proj_id: proj_id,
                script: script,
                vars: vars,
                option: option,
                rpath_src: './'+name+'.lua',
            }

            return this._xfn('start', info, (error, uuid)=>{
                if(error) {
                    _post_msg('system', 'error', _proj.id, 0, {
                        message: error.message
                    });
                } else {
                    _run_uuid = uuid;
                    _case_id = case_id;
                    _start_readout();
                }
            });
        } catch (error) {
            _post_msg('system', 'error', _proj.id, 0, {
                message: error.message
            });
        }
    }

    run_stop() {
        try {
            return this._xfn('stop', {
                key: _run_uuid
            }, (error)=>{
                if(error) {
                    _post_msg('system', 'error', _proj.id, 0, {
                        message: error.message
                    });
                } else {
                    _post_msg('system', 'info', _proj.id, 0, {
                        message: '已发送停止指令',
                    });
                }
            });
        } catch (error) {
            if (callback) {
                _post_msg('system', 'error', _proj.id, 0, {
                    message: error.message
                });
            }
        }
    }

    run_out(run_id, callback) {
        try {
            return this._xfn('readout', {
                key: run_id
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    // //查询执行状态
    // state(callback) {
    //     try {
    //         return this._xfn('state', null, callback);
    //     } catch (error) {
    //         if (callback) {
    //             callback(error);
    //         }
    //     }
    // }

    // //回复应答信息
    // reply(run_id, answer, callback) {
    //     try {
    //         answer.key = run_id;
    //         return this._xfn('reply', answer, callback);
    //     } catch (error) {
    //         if (callback) {
    //             callback(error);
    //         }
    //     }
    // }

    // //发送命令
    // cmd(run_id, command, params, callback) {
    //     try {
    //         return this._xfn('command', {
    //             key: run_id,
    //             command: command,
    //             params: params
    //         }, callback);
    //     } catch (error) {
    //         if (callback) {
    //             callback(error);
    //         }
    //     }
    // }

}

function _on_runout(msglist) {
    let exit = false;
    for(let msg of msglist) {
        _post_msg(msg.catalog, msg.kind, _proj.id, _case_id, msg.value);
        if(msg.catalog === 'system' && msg.kind === 'stop') {
            exit = true;
        }
    }

    //TODO save to db

    if(exit) {
        //TODO save to disk
        clearInterval(_timer);
        _run_uuid = null;
        _case_id = null;
    }
}

function _start_readout() {
    if(_timer) {
        clearInterval(_timer);
    }
    _timer = setInterval(() => {
        if(_srv && _run_uuid) {
            _srv.run_out(_run_uuid, (err, msgs)=> {
                if(err) {
                    _post_msg('system', 'error', _proj.id, 0, {
                        message: err
                    });
                } 
                if(msgs && msgs.length>0) {
                    _on_runout(msgs);
                }
            })
        } 
    }, 40);
}

function _on_error(err_msg) {
    _post_msg('system', 'error', _proj.id, 0, {
        message: err_msg
    });
    if(_timer) {
        clearInterval(_timer);
        _run_uuid = null;
        _case_id = null;
    }
}

function _get_srv(cb) {
    let ip = _proj.setting.etestd_ip;
    let port = _proj.setting.etestd_port;
    if (_srv && _srv.ip === ip && _srv.port === port) {
        return cb(_srv);
    }

    _srv = new SdkApi(ip, port, (err) => {
        if (err) {
            let msg = `连接执行器失败,${err.message}`;
            _post_msg('system', 'error', _proj.id, 0, {
                message: msg
            });
            return;
        } else {
            cb(_srv);
        }
    });
}

function setup(post_msg) {
    _post_msg = post_msg;
}

function set_proj(proj) {
    _proj = proj;
}

function get_proj() {
    return _proj;
}

function run_case(id, remake) {
    let item = _proj.luas.find(it => it.id===id);
    _get_srv(srv => {
        if(remake) {
            srv.make_env(() => {
                srv.run_case(_proj.id, id, item.name, item.script, item.vars, item.option);
            })
        } else {
            srv.run_case(_proj.id, id, item.script, item.vars, item.option);
        }
    });
}

function run_stop() {
    if(!_srv || !_run_uuid) {
        return;
    }
    _srv.run_stop();
}

export default {
    setup,
    set_proj,
    get_proj,
    run_case,
    run_stop,
}