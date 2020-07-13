
import ipc from './r_ipc';
import fp from './f_protocol';
import yaml from 'js-yaml';


class Env {

    async load_all_devs() {
        let devs = await ipc.list({proj_id: this.proj_id, kind: 'device'});
        for(let dev of devs) {
            let doc = await ipc.load({
                kind: 'doc',
                id: dev.id
            });
            let content = doc ? (doc.content || {}) : {};
            dev.conns = content.items || [];
        }
        return devs;
    }

    async load_devs(topo_id) {
        let all_devs = await this.load_all_devs();
        if(!topo_id) {
            return all_devs;
        }
        let topo = await ipc.load({kind: 'doc', id: topo_id});
        if(!topo || !topo.content || !topo.content.mapping) {
            return [];
        }
        let devs = topo.content.mapping.filter(it => it.used === 'etest');
        let res = [];
        for(let dev of devs) {
            let f = all_devs.find(it => it.id === dev.dev_id);
            if(f) {
                res.push(f);
            }
        }
        return res;
    }

    async load_prots() {
        let prots = await ipc.list({proj_id: this.proj_id, kind: 'protocol'});
        for(let prot of prots) {
            let doc = await ipc.load({
                kind: 'doc',
                id: prot.id
            });
            let content = doc ? (doc.content || {}) : {};
            if(content.items) {
                prot.frm = fp.load_frm(content.items);
            }
        }
        return prots;
    }

    async load_records(panel_id) {
        if(!panel_id) {
            return {};
        }
        let doc = await ipc.load({
            kind: 'doc',
            id: panel_id
        });
        let content = doc ? (doc.content || {}) : {};
            if(!content.data_yaml) {
            return {};
        }

        let res = {}
        try {
            res = yaml.safeLoad(content.data_yaml, 'utf8');
            return res.record || {};
        } catch (error) {
            return res;
        }
    }

    async open(proj_id, topo_id, panel_id) {
        this.proj_id = proj_id;
        this.devs = await this.load_devs(topo_id);        
        this.records = await this.load_records(panel_id);
        this.prots = await this.load_prots();
        this.topos = await ipc.list({proj_id: proj_id, kind: 'topology'});
        this.panels = await ipc.list({proj_id: proj_id, kind: 'panel'});
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

    get_topo_list() {
        return this.topos.map(t => {return {text: t.name, value: t.id}});
    }

    get_only_topo() {
        if(this.topos.length === 1) {
            return this.topos[0].id;
        }
        return null;
    }

    get_panel_list() {
        let res = this.panels.map(p => {return {text: p.name, value: p.id}});
        res.push({text: '<无>', value: ''});
        return res;
    }
}


export default Env