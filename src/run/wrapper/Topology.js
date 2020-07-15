
import helper from '../../helper/helper';

class Topology {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.name;
    }

    get_dev_name(id) {
        let devlist = this.proj.device;
        if(!id || !devlist) {
            return '';
        }
        let dev = devlist.find(it => it.id === id);
        return dev ? dev.name : '';
    }

    set_conn_target(oconn, conn_id) {
        let linking = this.topo.linking;
        if(!linking) {
            return;
        }
        // console.log(linking, oconn, conn_id);
        let link = linking.find(l => l.conns && l.conns.includes(conn_id));
        
        if(link) {
            if(link.conns.length === 2) {
                let t_id = link.conns.find(id => id !== conn_id);
                oconn.target = this.get_dev_conn_name(t_id);
                return;
            }
            let targets = [];
            link.conns.forEach(id => {
                if(id !== conn_id) {
                    targets.push(this.get_dev_conn_name(id));
                }
            })
            oconn.targets = targets;
            return;
        }
    }

    get_dev_conn_name(conn_id) {
        let conns = this.topo.conns;
        if(!conns) {
            return '';
        }
        let oo = conns.find(c => c.id === conn_id);
        return {device: oo.dev_obj.name, connector: oo.conn_obj.name}
    }

    get_conn_uri(id) {
        let binding = this.topo.binding;
        if(!binding) {
            return null;
        }
        let bind = binding.find(b => b.conn_id === id);
        if(bind) {
            return bind.uri;
        }
    }

    get_dev_conns(id) {
        let devlist = this.proj.device;
        if(!id || !devlist) {
            return '';
        }
        let dev = devlist.find(it => it.id === id);
        let res = [];
        let conns = dev.connectors;
        conns.forEach(conn => {
            let oconn = {name: conn.name, config: conn.config, type: conn.kind };
            let uri = this.get_conn_uri(conn.id);
            if(uri) {
                oconn.uri = uri;
            }
            this.set_conn_target(oconn, conn.id);
            res.push(oconn);
        })

        return res;
    }

    get_run_ast() {
        let devs = [];
        let mapping = this.topo.mapping;
        if(mapping) {
            mapping.forEach(dev => devs.push({'map': dev.used, name: this.get_dev_name(dev.dev_id), connectors: this.get_dev_conns(dev.dev_id)}))
        }
        return {name: this.name, devices: devs}
    }
}

export default Topology;