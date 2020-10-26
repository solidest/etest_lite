const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 600;
const BUS_WIDTH = 30;
const BUS_HEIGHT = 300;
const CANVASE_WIDTH = 940;

class Conn {
    constructor(id, name, kind) {
        this.id = id;
        this.name = name;
        this.kind = kind;
        this.link = null;
    }

    setLink(link) {
        this.link = link;
    }
}

class Dev {
    constructor(id, name, kind, pos) {
        this.id = id;
        this.name = name;
        this.conns = [];
        this.kind = kind;
        this.pos = pos;
    }

    setConns(items) {
        this.conns = [];
        if (items) {
            for (const it of items) {
                this.pushConn(it);
            }
        }
    }

    pushConn(conn) {
        this.conns.push(conn);
    }
}

class Dev_Conn {
    constructor(dev, conn) {
        this.dev = dev;
        this.conn = conn;
    }
}

class BLink {
    constructor(name, dcs, pos) {
        this.name = name;
        this.dcs = dcs;
        this.pos = pos;
        this.is_bus = true;
        let self = this;
        dcs.forEach(dev => {
            dev.conns.forEach(conn => {
                conn.setLink(self);
            })
        });
    }
    clear() {
        this.dcs.forEach(dev => {
            dev.conns.forEach(conn => {
                conn.setLink(null);
            })
        });
    }
}

class PLink {
    constructor(name, dc1, dc2) {
        this.name = name;
        this.dc1 = dc1;
        this.dc1 = dc2;
        dc1.conn.setLink(this);
        dc2.conn.setLink(this);
    }
    clear() {
        this.dc1.conn.setLink(null);
        this.dc2.conn.setLink(null);
    }
}

class Map {
    constructor() {
        this.devs = [];
        this.links = [];
    }
    _create_empty_dev_conn(old_dev_conn) {
        if (!old_dev_conn) {
            return null;
        }
        let dev = this.devs.find(it => it.id === old_dev_conn.dev.id) || this.devs.find(it => it.name === old_dev_conn.dev.name);
        if (!dev) {
            return null;
        }
        let conn = dev.conns.find(it => it.id === old_dev_conn.conn.id) || dev.conns.find(it => it.name === old_dev_conn.conn.name);
        if (!conn || conn.link) {
            return null;
        }
        return new Dev_Conn(dev, conn);
    }
    setDevs(devs) {
        this.devs = [];
        if (devs) {
            for (const it of devs) {
                this.pushDev(it);
            }
        }
    }
    pushDev(dev) {
        this.devs.push(dev);
    }
    pushBLink(name, old_dcs, pos) {
        if (!old_dcs) {
            return false;
        }
        let conns = [];
        for (const dev_conn of old_dcs) {
            let dc = this._create_empty_dev_conn(dev_conn);
            if (dc) {
                conns.push(dc);
            }
        }
        if (conns.length < 1) {
            return false;
        }
        this.links.push(new BLink(name, conns, pos));
        return true;
    }
    pushPLink(name, old_dc1, old_dc2) {
        let dc1 = this._create_empty_dev_conn(old_dc1);
        let dc2 = this._create_empty_dev_conn(old_dc2);
        if (!dc1 || !dc2) {
            return false;
        }
        this.links.push(new PLink(name, dc1, dc2));
        return true;
    }
    removeLink(link) {
        let idx = this.links.findIndex(it => it === link)
        if (idx >= 0) {
            this.links.splice(idx, 1);
            link.clear();
        }
    }
}

function _create_dev(raw_dev) {
    let dev = new Dev(raw_dev.id, raw_dev.name, raw_dev.kind, raw_dev.pos);
    if(dev.conns) {
        dev.conns.forEach(it => {
            dev.pushConn(new Conn(it.id, it.name, it.kind));
        })
    }
    return dev;
}

function _create_map_empty(devs) {
    let map = new Map();
    if(!devs) {
        return map;
    }
    devs.forEach(dev => {
        if(dev.kind !== 'nil') {
            map.pushDev(_create_dev(dev));
        }
    });
    return map;
}

function _merge_recs(to, from) {
    if(from.left<to.left) {
        to.left = from.left;
    }
    if(from.top<to.top) {
        to.top = from.top;
    }
    if(from.bottom>to.bottom) {
        to.bottom = from.bottom;
    }
    if(from.right>to.right) {
        to.right = from.right;
    }
}

function _get_new_pos(used_rec, default_width, default_height) {
    let rec;
    if(used_rec.right + default_width + 10 < CANVASE_WIDTH) {
        rec = {
            top: 10,
            left: used_rec.right + 10,
        }
    } else {
        rec = {
            top: used_rec.bottom + 10,
            left: 10,
        }
    }
    rec.bottom = rec.top + default_height;
    rec.right = rec.left + default_width;
    _merge_recs(used_rec, rec);
    return rec;
}

function update_layout(map) {
    if(!map) {
        return;
    }
    let rec;
    let empty_devs = [];
    let empty_buses = [];
    map.devs.forEach(dev => {
        if(dev.pos) {
            if(!rec) {
                rec = JSON.parse(JSON.stringify(dev.pos));
            } else {
                _merge_recs(rec, dev.pos);
            }
        } else {
            empty_devs.push(dev);
        }
    });
    map.links.forEach(link => {
        if(link.is_bus) {
            if(link.pos) {
                if(!rec) {
                    rec = JSON.parse(JSON.stringify(link.pos));
                } else {
                    _merge_recs(rec, link.pos);
                }                
            } else {
                empty_buses.push(link);
            }
        }
    })
    rec = rec || {left:0, top:0, right:0, bottom:0};
    let len1 = empty_devs.length;
    let len2 = empty_buses.length;
    let len = Math.max(len1, len2);
    for (let index = 0; index < len; index++) {
        if(index<len1) {
            empty_devs[index].pos = _get_new_pos(rec, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        }
        if(index<len2) {
            empty_buses[index].pos = _get_new_pos(rec, BUS_WIDTH, BUS_HEIGHT);
        }
    }
}

function create_map_byold(devs, old_map) {
    let map = _create_map_empty(devs);
    if(old_map) {
        let links = old_map.links;
        links.forEach(link => {
            link.is_bus ? map.pushBLink(link.name, link.dcs, link.pos) : map.pushPLink(link.name, link.dc1, link.dc2);
        });        
    }
    update_layout(map);
    return map;
}

function create_map_bydb(devs, bus_links, pp_links) {
    let map = _create_map_empty(devs);
    if(bus_links) {
        bus_links.forEach(link => {
            map.pushBLink(link.name, link.dcs, link.pos);
        })
    }
    if(pp_links) {
        pp_links.forEach(link => {
            map.pushPLink(link.name, link.dc1, link.dc2);
        })
    }
    update_layout(map);
    return map;
}

export default {
    create_map_bydb,
    create_map_byold,
    update_layout,
}

