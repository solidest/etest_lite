
import checker from '../helper/checker';

const KIND = 'device';

class Device {
    constructor(data, proj, name) {
        this.data = data;
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get items() {
        if(!this.data.content) {
            return [];
        }
        return this.data.content.items || [];
    }

    get connectors() {
        if(!this.data.content) {
            return [];
        }
        return this.data.content.items || [];
    }

    _check_names(items) {
        let names = [];
        for(let it of items) {
            let msg = checker.valid_name(names, it.name);
            if(msg === 'ok') {
                it.name = it.name.trim();
                names.push(it.name);
            } else {
                this.proj.pushError(msg, KIND, this.id, it.id);
            }
        }
    }
    _check_config_di(item) {
        if(!item.config) {
            return;
        }
    }
    _check_config_do(item) {
        if(!item.config) {
            return;
        }
    }
    _check_config_ad(item) {
        if(!item.config) {
            return;
        }
    }
    _check_config_da(item) {
        if(!item.config) {
            return;
        }
    }
    _check_config_udp(item) {
        let cfg = item.config;
        if(cfg.ip && !checker.check_ip(cfg.ip)) {
            this.proj.pushError('IP地址设置错误', KIND, this.id, item.id);
        }
        if(cfg.port && !checker.isPositiveNumber(cfg.port)) {
            this.proj.pushError('端口号设置错误', KIND, this.id, item.id);
        }
    }
    _check_config_tcp_client(item) {
        let cfg = item.config;
        if(cfg.ip && !checker.check_ip(cfg.ip)) {
            this.proj.pushError('IP地址设置错误', KIND, this.id, item.id);
        }
        if(cfg.port && !checker.isPositiveNumber(cfg.port)) {
            this.proj.pushError('端口号设置错误', KIND, this.id, item.id);
        }
    }
    _check_config_tcp_server(item) {
        let cfg = item.config;
        if(!checker.check_ip(cfg.ip)) {
            this.proj.pushError('IP地址设置错误', KIND, this.id, item.id);
        }
        if(!checker.isPositiveNumber(cfg.port)) {
            this.proj.pushError('端口号设置错误', KIND, this.id, item.id);
        }
        
    }
    _check_config_serial(item) {
        let cfg = item.config;
        if(!checker.isPositiveNumber(cfg.baudrate)) {
            this.proj.pushError('波特率设置错误', KIND, this.id, item.id);
        }
        if(![5, 6, 7, 8].includes(cfg.bytesize)) {
            this.proj.pushError('数据位设置错误', KIND, this.id, item.id);
        }
        if(![1, 2, 1.5].includes(cfg.stopbits)) {
            this.proj.pushError('停止位设置错误', KIND, this.id, item.id);
        }
        if(!['none', 'odd', 'event', 'mark', 'space'].includes(cfg.parity)) {
            this.proj.pushError('校验方式设置错误', KIND, this.id, item.id);
        }
        if(!['none', 'software', 'hardware'].includes(cfg.flowcontrol)) {
            this.proj.pushError('流控方式设置错误', KIND, this.id, item.id);
        }
    }
    _check_config_serial_232(item) {
        return this._check_config_serial(item);
    }
    _check_config_serial_422(item) {
        return this._check_config_serial(item);
    }
    _check_config_serial_485(item) {
        return this._check_config_serial(item);
    }
    _check_config_serial_ttl(item) {
        return this._check_config_serial(item);
    }


    check() {
        if(!this.data.content) {
            return;
        }
        let items = this.data.content.items;
        if(!items || items.length === 0) {
            return 0;
        }
        this._check_names(items);
        for(let it of items) {
            if(!it.config) {
                this.proj.pushError('未知错误1', KIND, this.id, it.id);
                continue;
            }
            let fn = '_check_config_' + it.kind;
            if(!this[fn]) {
                console.log('TODO ', fn);
            } else {
                this[fn](it);
            }
        }
    }
}

export default Device;