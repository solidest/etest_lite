
import f from '../../feature/f_topo';

const KIND = 'topology';

class Topology {
    constructor(data, proj, name) {
        this.data = data;
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    _check_buslink(link_id, conn_refs) {
        let o1 = conn_refs[0].conn_obj;
        let conns = conn_refs.map(it => it.conn_obj);
        switch (o1.kind) {
            case 'da':
            case 'di':
            case 'ad':
            case 'do':
            case 'serial_232':
            case 'serial_ttl':
                this.proj.pushError('连接方式错误', KIND, this.id, link_id);
                break;
            case 'serial_422':
            case 'serial_485': {
                    for(let c of conns) {
                        if(c.kind !== o1.kind) {
                            this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                            break;
                        }
                    }
                }
                break;
            case 'udp': {
                    for(let c of conns) {
                        if(c.kind !== o1.kind) {
                            this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                            break;
                        }
                    }
                }
                break;
            case 'tcp_client': {
                    let ok = true;
                    for(let c of conns) {
                        if(c.kind !== o1.kind && c.kind !== 'tcp_server') {
                            this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                            ok = false;
                            break;
                        }
                    }
                    if(ok && !conns.find(it => it.kind === 'tcp_server')) {
                        this.proj.pushError('缺少tcp_server', KIND, this.id, link_id);
                    }
                }
                break;
            case 'tcp_server': {
                    let ok = true;
                    for(let c of conns) {
                        if(c.kind !== o1.kind && c.kind !== 'tcp_client') {
                            this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                            ok = false;
                            break;
                        }
                    }
                    if(ok && !conns.find(it => it.kind === 'tcp_client')) {
                        this.proj.pushError('缺少tcp_client', KIND, this.id, link_id);
                    }
                }
                break;
        
            default:
                console.log('TODO kind', o1);
                break;
        }
    }

    _check_pplink(link_id, conns) {
        let o1 = conns[0].conn_obj;
        let o2 = conns[1].conn_obj;
        switch (o1.kind) {
            case 'da':
                if(o2.kind !== 'ad') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'di':
                if(o2.kind !== 'do') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'ad':
                if(o2.kind !== 'da') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'do':
                if(o2.kind !== 'di') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'serial_232':
            case 'serial_422':
            case 'serial_485':
            case 'serial_ttl':
                if(!['serial_232', 'serial_422', 'serial_485', 'serial_ttl',].includes(o2.kind)) {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'udp':
                if(o2.kind !== 'udp') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'tcp_client':
                if(o2.kind !== 'tcp_server') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
            case 'tcp_server':
                if(o2.kind !== 'tcp_client') {
                    this.proj.pushError('接口类型不匹配', KIND, this.id, link_id);
                }
                break;
        
            default:
                console.log('TODO o1', o1);
                break;
        }
    }

    _check_link(link) {
        let conn_refs = [];
        link.conns.forEach(cid => {
            conn_refs.push(this.topo.conns.find(it => it.id === cid));
        })
        if(link.conns.length===2) {
            this._check_pplink(link.id, conn_refs);
        } else if(link.conns.length>2) {
            this._check_buslink(link.id, conn_refs);
        }
    }

    _check_topo() {
        if(this.topo.linking) {
            for(let link of this.topo.linking) {
                if(link && link.conns && link.conns.length>1) {
                    this._check_link(link);
                }
            }
        }
    }

    check() {
        if(!this.data) {
            return;
        }

        let devlist = this.proj.device;
        let devs = devlist ? devlist.map(it => {
            return {
                id: it.id,
                name: it.name,
                items: it.items
            }
        }) : [];
       
        let doc = (this.data && this.data.content) ? this.data.content : {};
        this.topo = f.load_topo(devs, doc);
        this._check_topo();
    }
}

export default Topology;