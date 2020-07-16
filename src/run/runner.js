const RpcTask = require('./core/rpctask');

let _post_msg;
let _proj;
let _srv;

class SdkApi {
    constructor(ip, port, cb) {
        this.ip = ip;
        this.port = port;
        this._srv = new RpcTask(ip, port, false, cb);
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

    run_case(id, script, vars, option) {
        try {
            let info = {
                id: id,
                script: script,
                vars: vars,
                option: option,
            }
            console.log('run info', info)
            return this._xfn('start', info, (error, uuid)=>{
                if(error) {
                    _post_msg('system', 'error', _proj.id, 0, {
                        message: error.message
                    });
                } else {
                    _post_msg('system', 'start', _proj.id, 0, {
                        message: '执行加载完毕',
                        run_uuid: uuid
                    });
                }
            });
        } catch (error) {
            _post_msg('system', 'error', _proj.id, 0, {
                message: error.message
            });
        }
    }


    // start(id, script, vars, option, callback) {
    //     try {
    //         let run = {
    //             id: id,
    //             script: script,
    //             vars: vars,
    //             option: option,
    //         }
    //         return this._xfn('start', run, callback);
    //     } catch (error) {
    //         if (callback) {
    //             callback(error);
    //         }
    //     }
    // }

    // //读取执行输出
    // readout(run_id, callback) {
    //     try {
    //         return this._xfn('readout', {
    //             key: run_id
    //         }, callback);
    //     } catch (error) {
    //         if (callback) {
    //             callback(error);
    //         }
    //     }
    // }

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

    // //停止执行
    // stop(run_id, callback) {
    //     try {
    //         return this._xfn('stop', {
    //             key: run_id
    //         }, callback);
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

function get_srv(cb) {
    let ip = _proj.setting.etestd_ip;
    let port = _proj.setting.etestd_port;
    if (_srv && _srv.ip === ip && _srv.port === port) {
        return cb(_srv);
    }

    _srv = new SdkApi(ip, port, (err) => {
        if (err) {
            let msg = `连接执行器失败(${err.message})`;
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

function run_case(id, make_env) {
    let item = _proj.luas.find(it => it.id===id);
    get_srv(srv => {
        if(make_env) {
            srv.make_env(() => {
                srv.run_case(id, item.script, item.vars, item.option);
            })
        } else {
            srv.run_case(id, item.script, item.vars, item.option);
        }
    })
}

export default {
    setup,
    set_proj,
    get_proj,
    run_case,
}