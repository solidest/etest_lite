
import ipc from './r_ipc';
import fp from './f_protocol';

class Env {

    async open(proj_id) {
        this.proj_id = proj_id;
        this.devs = await ipc.list({proj_id: proj_id, kind: 'device'});
        for(let dev of this.devs) {
            let doc = await ipc.load({
                kind: 'doc',
                id: dev.id
            });
            let content = doc ? (doc.content || {}) : {};
            dev.conns = content.items || [];
        }
        this.prots = await ipc.list({proj_id: proj_id, kind: 'protocol'});
        for(let prot of this.prots) {
            let doc = await ipc.load({
                kind: 'doc',
                id: prot.id
            });
            let content = doc ? (doc.content || {}) : {};
            if(content.items) {
                prot.frm = fp.load_frm(content.items);
            }
        }
    }

    get_dev_list() {
        let res = {};
        this.devs.forEach(dev => {
            let conns = [];
            dev.conns.forEach(conn => {
                if(conn.name && conn.name.trim()) {
                    conns.push(conn.name.trim());
                }
            });
            res[dev.name] = conns;
        });
        return res;
    }

    get_proto_list() {
        return this.prots.map(p => p.name);
    }


}


export default Env