
let map_default = {
    DEFAULT_ITEM_HEIGHT: 46,
    DEFAULT_BUS_SIZE: 160,
    DEFAULT_CANVASE_WIDTH: 1000,
    DEFAULT_SPACE: 30,
    DEFAULT_WIDTH: 260,
    DEFAULT_ITEMS_OTHERHEIGHT: 8*2+48,
    DEFAULT_ITEMS_MAXCOUNT: 10,
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
    let dev = new Dev(raw_dev.id, raw_dev.name, raw_dev.kind, raw_dev.pos, raw_dev.memo);
    if (raw_dev.conns) {
        raw_dev.conns.forEach(it => {
            dev.pushConn(new Conn(it.id, it.name, it.kind, it.memo));
        })
    }
    return dev;
}

function _create_map_empty(devs) {
    let map = new Map();
    if (!devs) {
        return map;
    }
    devs.forEach(dev => {
        if (dev.kind !== 'none') {
            map.pushDev(_create_dev(dev));
        }
    });
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

function _get_new_pos(used_rec, w, h) {
    let pos;
    if (used_rec.right + w + map_default.DEFAULT_SPACE < map_default.DEFAULT_CANVASE_WIDTH) {
        pos = {
            top: map_default.DEFAULT_SPACE,
            left: used_rec.right + map_default.DEFAULT_SPACE,
        }
    } else {
        pos = {
            top: used_rec.bottom + map_default.DEFAULT_SPACE,
            left: map_default.DEFAULT_SPACE,
        }
    }
    pos.height = h;
    pos.width = w;
    _merge_recs(used_rec, pos);
    return pos;
}

function update_layout(map) {
    if (!map) {
        return;
    }
    let rec;
    let empty_devs = [];
    let empty_buses = [];
    map.devs.forEach(dev => {
        if (dev.pos) {
            if (!rec) {
                rec = JSON.parse(JSON.stringify(dev.pos));
            } else {
                _merge_recs(rec, dev.pos);
            }
        } else {
            empty_devs.push(dev);
        }
    });
    map.links.forEach(link => {
        if (link.is_bus) {
            if (link.pos) {
                if (!rec) {
                    rec = JSON.parse(JSON.stringify(link.pos));
                } else {
                    _merge_recs(rec, link.pos);
                }
            } else {
                empty_buses.push(link);
            }
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
            if(len > map_default.DEFAULT_ITEMS_MAXCOUNT) {
                len = map_default.DEFAULT_ITEMS_MAXCOUNT;
            }
            empty_devs[index].pos = _get_new_pos(rec, map_default.DEFAULT_WIDTH, len*map_default.DEFAULT_ITEM_HEIGHT + map_default.DEFAULT_ITEMS_OTHERHEIGHT);
        }
        if (index < len2) {
            empty_buses[index].pos = _get_new_pos(rec, map_default.DEFAULT_BUS_SIZE, map_default.DEFAULT_BUS_SIZE);
        }
    }
}

function create_map_byold(raw_devs, old_map) {
    let map = _create_map_empty(raw_devs);
    if (old_map) {
        let links = old_map.links;
        links.forEach(link => {
            link.is_bus ? map.pushBLink(link.name, link.dcs, link.pos) : map.pushPLink(link.name, link.dc1, link.dc2);
        });
    }
    update_layout(map);
    return map;
}

function create_map_bydb(raw_devs, bus_links, pp_links) {
    let map = _create_map_empty(raw_devs);
    if (bus_links) {
        bus_links.forEach(link => {
            map.pushBLink(link.name, link.dcs, link.pos);
        })
    }
    if (pp_links) {
        pp_links.forEach(link => {
            map.pushPLink(link.name, link.dc1, link.dc2);
        })
    }
    update_layout(map);
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

function create_dbcontent(raw_devs, map) {
    let devs = raw_devs.map(it => {
        return {
            id: it.id,
            name: it.name,
            kind: it.kind
        }
    });
    let bus_links = [];
    let pp_links = [];
    map.links.forEach(l => {
        if (l.is_bus) {
            bus_links.push({
                name: l.name,
                pos: l.pos,
                dcs: l.dcs.map(i => {
                    return _get_dbdc(i)
                }),
            })
        } else {
            pp_links.push({
                name: l.name,
                dc1: _get_dbdc(l.dc1),
                dc2: _get_dbdc(l.dc2),
            })
        }
    })
    return {
        devs,
        bus_links,
        pp_links
    }
}

function set_config(cfg) {
    map_default = cfg;
}

function set_container_size(width, height) {
    map_default.DEFAULT_CANVASE_WIDTH = width;
    console.log('set_container_size', height);
}

export default {
    set_config,
    create_map_bydb,
    create_map_byold,
    create_dbcontent,
    set_container_size,
}