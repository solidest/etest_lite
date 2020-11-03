
let map_default = {
    DEFAULT_ITEM_HEIGHT: 48,
    DEFAULT_ITEM_WIDTH: 260,
    DEFAULT_ITEMS_TITLEHEIGHT: 60,
    DEFAULT_ITEMS_TAILHEIGHT: 6,
    DEFAULT_ITEMS_MAXCOUNT: 15,
    DEFAULT_ITEMS_MINCOUNT: 5,
    DEFAULT_BUS_SIZE: 100,
    DEFAULT_CANVASE_WIDTH: 1000,
    DEFAULT_SPACE: 30,
}

class Conn {
    constructor(id, name, kind, memo) {
        this.id = id;
        this.name = name;
        this.kind = kind;
        this.memo = memo;
        this.link = null;
    }

    setLink(link) {
        this.link = link;
    }
}

class Dev {
    constructor(id, name, kind, pos, memo) {
        this.id = id;
        this.name = name;
        this.conns = [];
        this.kind = kind;
        this.pos = pos;
        this.memo = memo;
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
    constructor(id, name, bus_id, dc) {
        this.id = id;
        this.name = name;
        this.bus_id = bus_id;
        this.dc = dc;
        this.dc.conn.setLink(self);
    }
    clear() {
        this.dc.conn.setLink(null);
        this.dc = null;
        this.bus_id = null;
    }
}

class PLink {
    constructor(id, name, dc1, dc2) {
        this.id = id;
        this.name = name;
        this.dc1 = dc1;
        this.dc2 = dc2;
        dc1.conn.setLink(this);
        dc2.conn.setLink(this);
    }
    clear() {
        this.dc1.conn.setLink(null);
        this.dc2.conn.setLink(null);
        this.dc1 = null;
        this.dc2 = null;
    }
}

class Map {
    constructor() {
        this.devs = [];
        this.links = [];
        this.buses = [];
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
    linksOfbus(bus_id) {
        return this.links.filter(l=>l.bus_id&&l.bus_id===bus_id);
    }
    pushDev(dev) {
        this.devs.push(dev);
    }
    pushBus(id, pos) {
        this.buses.push({id, pos});
    }
    pushBLink(id, name, bus_id, old_dc) {
        if (!old_dc) {
            return false;
        }
        let bus = this.buses.find(b => b.id === bus_id);
        if(!bus) {
            return false;
        }
        let dc = this._create_empty_dev_conn(old_dc);
        if (dc) {
            this.links.push(new BLink(id, name, bus.id, dc));
            return true;
        }
        return false;
    }
    pushPLink(id, name, old_dc1, old_dc2) {
        let dc1 = this._create_empty_dev_conn(old_dc1);
        let dc2 = this._create_empty_dev_conn(old_dc2);
        if (!dc1 || !dc2) {
            return false;
        }
        this.links.push(new PLink(id, name, dc1, dc2));
        return true;
    }
    removeLink(dev_id, conn_id) {
        let idx = this.links.findIndex(it => {
            if(it.bus_id) {
                return (it.dc.dev.id === dev_id && it.dc.conn.id === conn_id);
            } else {
                return (it.dc1.dev.id === dev_id && it.dc1.conn.id === conn_id);
            }
        })
        if (idx >= 0) {
            this.links[idx].clear();
            this.links.splice(idx, 1);
            return true;
        }
        return null;
    }
    removeBus(bus_id) {
        let idx = this.buses.findIndex(b => b.id === bus_id);
        if(idx<0){
            return false;
        }
        this.buses.splice(idx, 1);
        let ls = this.links.filter(l => l.bus_id === bus_id);
        for (const link of ls) {
            this.removeLink(link.dc.dev.id, link.dc.conn.id);
        }
    }
    getKind(dev_id, conn_id) {
        if(!this.raw_devs) {
            return;
        }
        let dev = this.raw_devs.find(d => d.id === dev_id);
        if(dev) {
            let conn = dev.conns.find(c => c.id === conn_id);
            return conn ? conn.kind : '';
        }
        return '';
    }
    getBusKinds(bus_id) {
        let res = [];
        let self = this;
        this.links.forEach(l => {
            if(l.bus_id === bus_id) {
                res.push(self.getKind(l.dc.dev.id, l.dc.conn.id));
            }
        })
        return res;
    }
}

function _create_dev(raw_dev) {
    let dev = new Dev(raw_dev.id, raw_dev.name, raw_dev.kind, raw_dev.pos, raw_dev.memo);
    if (raw_dev.conns) {
        raw_dev.conns.forEach(it => {
            dev.pushConn(new Conn(it.id, it.name, it.kind, it.memo));
        })
    }
    return dev;
}

function _create_map_empty(devs, buses) {
    let map = new Map();
    if (!devs) {
        return map;
    }
    devs.forEach(dev => {
        if (dev.kind !== 'none') {
            map.pushDev(_create_dev(dev));
        }
    });
    if(buses) {
        buses.forEach(bus => {
            map.pushBus(bus.id, bus.pos);
        });
    }
    return map;
}

function _merge_recs(rec, pos) {
    if (pos.left < rec.left) {
        rec.left = pos.left;
    }
    if (pos.top < rec.top) {
        rec.top = pos.top;
    }
    if (pos.left+pos.width > rec.right) {
        rec.right = pos.left+pos.width;
    }
    if (pos.top+pos.height > rec.bottom) {
        rec.bottom = pos.top+pos.height;
    }
}

function _get_dev_pos(used_rec, count, show_count, last_pos) {
    let show = Math.min(count, show_count);
    let width = map_default.DEFAULT_ITEM_WIDTH;
    let height = map_default.DEFAULT_ITEMS_TITLEHEIGHT + map_default.DEFAULT_ITEM_HEIGHT*show;
    if(show<count) {
        height += map_default.DEFAULT_ITEMS_TAILHEIGHT;
    }
    let pos = {
        width,
        height,
        show_count: show,
    }
    if(last_pos && last_pos.left + last_pos.width + map_default.DEFAULT_SPACE + width < map_default.DEFAULT_CANVASE_WIDTH) {
        pos.top = last_pos.top;
        pos.left = last_pos.left + last_pos.width + map_default.DEFAULT_SPACE;
        return pos;
    }
    if (used_rec.right + width + map_default.DEFAULT_SPACE < map_default.DEFAULT_CANVASE_WIDTH) {
        pos.top = map_default.DEFAULT_SPACE;
        pos.left = used_rec.right + map_default.DEFAULT_SPACE;
    } else {
        pos.top = used_rec.bottom + map_default.DEFAULT_SPACE;
        pos.left = map_default.DEFAULT_SPACE;
    }
    return pos;
}

function _get_bus_pos(used_rec, last_pos) {
    let pos = {
        width: map_default.DEFAULT_BUS_SIZE,
        height: map_default.DEFAULT_BUS_SIZE,
    }
    if(last_pos && last_pos.left + last_pos.width + map_default.DEFAULT_SPACE + map_default.DEFAULT_BUS_SIZE < map_default.DEFAULT_CANVASE_WIDTH) {
        pos.top = last_pos.top;
        pos.left = last_pos.left + last_pos.width + map_default.DEFAULT_SPACE;
        return pos;
    }
    if (used_rec.right + pos.width + map_default.DEFAULT_SPACE < map_default.DEFAULT_CANVASE_WIDTH) {
        pos.top = map_default.DEFAULT_SPACE;
        pos.left = used_rec.right + map_default.DEFAULT_SPACE;
    } else {
        pos.top = used_rec.bottom + map_default.DEFAULT_SPACE;
        pos.left = map_default.DEFAULT_SPACE;
    }
    return pos;
}

function _pos_to_rec(pos) {
    return {
        left: pos.left,
        top: pos.top,
        bottom: pos.top + pos.height,
        right: pos.left + pos.width,
    }
}

function update_layout(map) {
    if (!map) {
        return;
    }
    let rec;
    let last_pos;
    let empty_devs = [];
    let empty_buses = [];
    map.devs.forEach(dev => {
        if (dev.pos) {
            last_pos = dev.pos;
            if (!rec) {
                rec = _pos_to_rec(dev.pos);
            } else {
                _merge_recs(rec, dev.pos);
            }
        } else {
            empty_devs.push(dev);
        }
    });
    map.buses.forEach(bus => {
        if (bus.pos) {
            last_pos = bus.pos;
            if (!rec) {
                rec = _pos_to_rec(bus.pos);
            } else {
                _merge_recs(rec, bus.pos);
            }
        } else {
            empty_buses.push(bus);
        }
    })
    rec = rec || {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    let len1 = empty_devs.length;
    let len2 = empty_buses.length;
    let len = Math.max(len1, len2);
    for (let index = 0; index < len; index++) {
        if (index < len1) {
            let len = empty_devs[index].conns.length;
            last_pos = _get_dev_pos(rec, len, map_default.DEFAULT_ITEMS_MINCOUNT, last_pos);
            empty_devs[index].pos = last_pos;
            _merge_recs(rec, last_pos);
        }
        if (index < len2) {
            last_pos = _get_bus_pos(rec, last_pos);
            empty_buses[index].pos = last_pos;
            _merge_recs(rec, last_pos);
        }
    }
}

function _update_conns_count(dev) {
    if(dev.pos.show_count < map_default.DEFAULT_ITEMS_MINCOUNT || dev.pos.show_count > dev.conns.length) {
        dev.pos.show_count = Math.min(map_default.DEFAULT_ITEMS_MINCOUNT, dev.conns.length);
        return
    }
    if(dev.pos.show_count > map_default.DEFAULT_ITEMS_MAXCOUNT || dev.pos.show_count < dev.conns.length) {
        dev.pos.show_count = Math.min(map_default.DEFAULT_ITEMS_MAXCOUNT, dev.conns.length);
        return
    }
}

function create_map_byold(raw_devs, old_map) {
    let map = _create_map_empty(raw_devs, old_map ? old_map.buses : []);
    if (old_map) {
        let links = old_map.links;
        links.forEach(link => {
            link.bus_id ? map.pushBLink(link.id, link.name, link.bus_id, link.dc) : map.pushPLink(link.id, link.name, link.dc1, link.dc2);
        });
    }
    update_layout(map);
    map.raw_devs = raw_devs;
    map.devs.forEach(d => _update_conns_count(d));
    return map;
}

function create_map_bycontent(raw_devs, buses, bus_links, pp_links) {
    let map = _create_map_empty(raw_devs, buses);

    if (bus_links) {
        bus_links.forEach(link => {
            map.pushBLink(link.id, link.name, link.bus_id, link.dc);
        });
    }
    if (pp_links) {
        pp_links.forEach(link => {
            map.pushPLink(link.id, link.name, link.dc1, link.dc2);
        })
    }
    update_layout(map);
    map.raw_devs = raw_devs;
    map.devs.forEach(d => _update_conns_count(d));
    return map;
}

function _get_dbdc(dc) {
    return {
        dev: {
            id: dc.dev.id,
            name: dc.dev.name,
        },
        conn: {
            id: dc.conn.id,
            name: dc.conn.name,
        }
    }
}

function create_content(map) {
    let devs = map.devs.map(it => {
        return {
            id: it.id,
            name: it.name,
            kind: it.kind,
            pos: it.pos,
        }
    });
    let bus_links = [];
    let pp_links = [];
    map.links.forEach(l => {
        if (l.bus_id) {
            bus_links.push({
                name: l.name,
                bus_id: l.bus_id,
                dc: _get_dbdc(l.dc)
            })
        } else {
            pp_links.push({
                name: l.name,
                dc1: _get_dbdc(l.dc1),
                dc2: _get_dbdc(l.dc2),
            })
        }
    });
    let buses = map.buses.map(it => {
        return {
            id: it.id,
            pos: it.pos,
        }
    });
    return {
        devs,
        bus_links,
        pp_links,
        buses,
    }
}

function set_container_width(width) {
    map_default.DEFAULT_CANVASE_WIDTH = width;
}

function add_bus(map, bus_id) {
    map.pushBus(bus_id);
    update_layout(map);
}

function adjust(map) {
    let res = false;
    let minleft = 10000;
    let mintop = 10000;
    map.devs.forEach(dev=>{
        if(dev.pos) {
            if(dev.pos.left<minleft) {
                minleft = dev.pos.left;
            }
            if(dev.pos.top<mintop) {
                mintop = dev.pos.top;
            } 
        }
    });
    map.buses.forEach(bus=> {
        if(bus.pos) {
            if(bus.pos.left<minleft) {
                minleft = bus.pos.left;
            }
            if(bus.pos.top<mintop) {
                mintop = bus.pos.top;
            } 
        }
    });
    let left_adj = minleft - 30;
    let top_adj = mintop - 30;
    if(left_adj!==0) {
        map.devs.forEach(dev => {
            if(dev.pos) {
                dev.pos.left -= left_adj;
            }
        });
        map.buses.forEach(bus => {
            if(bus.pos) {
                bus.pos.left -= left_adj;
            }
        })
        res = true;
    }
    if(top_adj!==0) {
        map.devs.forEach(dev => {
            if(dev.pos) {
                dev.pos.top -= top_adj;
            }
        });
        map.buses.forEach(bus => {
            if(bus.pos) {
                bus.pos.top -= top_adj;
            }
        })
        res = true;
    }
    return res;
}


export default {
    map_default,
    create_map_bycontent,
    create_map_byold,
    create_content,
    add_bus,
    set_container_width,
    adjust,
}