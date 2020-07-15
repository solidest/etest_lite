
const RpcTask = require('../core/rpctask');
const yaml = require('js-yaml');

class SdkApi {
    constructor(ip, port) {
        this._srv = new RpcTask(ip, port, false);
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

    setup(proj_id, prots, xtras, topos, libs, callback) {
        try {
            let env = {
                proj_id: proj_id,
                prots: prots,
                xtras: xtras,
                topos: topos,
                libs: libs
            };
            return this._xfn('makeenv', env, callback);
        } catch (error) {
            // console.log(error)
            if (callback) {
                callback(error);
            }
        }
    }

    start(id, script, vars, option, callback) {
        try {
            let run = {
                id: id,
                script: script,
                vars: vars,
                option: option,
            }
            return this._xfn('start', run, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //读取执行输出
    readout(run_id, callback) {
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

    //查询执行状态
    state(callback) {
        try {
            return this._xfn('state', null, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //停止执行
    stop(run_id, callback) {
        try {
            return this._xfn('stop', {
                key: run_id
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //回复应答信息
    reply(run_id, answer, callback) {
        try {
            answer.key = run_id;
            return this._xfn('reply', answer, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //发送命令
    cmd(run_id, command, params, callback) {
        try {
            return this._xfn('command', {
                key: run_id,
                command: command,
                params: params
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

}

module.exports = SdkApi;