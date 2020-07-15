

class Project {
    constructor(data) {
        this.data = data;
    }
    get id() {
        return this.data.id;
    }
    get version() {
        return this.data.updated;
    }

    addKind(kind, kind_obj) {
        if(!this[kind]) {
            this[kind] = [];
        }
        this[kind].push(kind_obj);
    }

    check_setting() {
        let setting = this.data.setting;
        if(!setting || !setting.etestd_ip || !setting.etestd_port) {
            this.pushError('缺少执行器设置', 'project', 'setting', 0);
        }
    }

    check_special() {
        let libs = [];
        if(this.lua) {
            for(let l of this.lua) {
                if(l.is_lib) {
                    if(libs.includes(l.name)) {
                        this.pushError('共享库名称重复', 'program', l.id, -1);
                        console.log('rename lib', l.name);
                    } else {
                        libs.push(l.name);
                    }
                }
            }
        }
    }

    check() {
        this.check_res = {};
        if(this.device) {
            this.device.forEach(dev => dev.check());
        }
        if(this.topology) {
            this.topology.forEach(topo => topo.check());
        }
        if(this.protocol) {
            this.protocol.forEach(topo => topo.check());
        }
        if(this.lua) {
            this.lua.forEach(lua => lua.check());
        }
        if(this.project) {
            this.project.forEach(xt => xt.check());
        }
        this.check_setting();
        this.check_special();
        return this.check_res;
    }
   
    pushError(msg, kind, doc_id, item_id) {
        if(!this.check_res[kind]) {
            this.check_res[kind] = {$count: 0};
        }
        if(!this.check_res[kind][doc_id]) {
            this.check_res[kind][doc_id] = {$count: 0};
            this.check_res[kind].$count++;
        }
        if(!this.check_res[kind][doc_id][item_id]) {
            this.check_res[kind][doc_id][item_id] = [];
            this.check_res[kind][doc_id].$count++;
        }
        this.check_res[kind][doc_id][item_id].push({
            type: 'error',
            msg: msg
        })
    }
}

export default Project;