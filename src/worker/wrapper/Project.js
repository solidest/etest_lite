

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