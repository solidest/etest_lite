import loki from 'lokijs';
import lfsa from 'lokijs/src/loki-fs-structured-adapter';
import path from 'path';
import fs from 'fs';
import helper from './helper';

class RunDb {
    constructor(proj_id, db_path) {
        this.proj_id = proj_id;
        this.db_path = db_path;
    }

    open() {
        let self = this;
        return new Promise(resolve => {
            try {
                let pf = path.resolve(this.db_path, this.proj_id);
                if (!fs.existsSync(pf)) {
                    fs.mkdirSync(pf);
                }
                let dbfile = path.resolve(pf, 'run.db');
                self.db = new loki(dbfile, {
                    adapter: new lfsa(),
                    autoload: true,
                    autoloadCallback: () => {
                        let coll = self.db.getCollection("project");
                        if (!coll) {
                            self.db.addCollection("project");
                        } else {
                            let items = coll.find({
                                'id': {
                                    '$eq': self.proj_id
                                }
                            });
                            if (items && items.length > 0) {
                                self.proj = items[0];
                            }
                        }
                        return resolve({
                            result: 'ok',
                            value: self.proj
                        });
                    },
                });
            } catch (error) {
                return resolve({
                    result: 'error',
                    value: error.message,
                })
            }

        });
    }

    close() {
        let self = this;
        return new Promise(resolve => {
            self.db.saveDatabase(() => {
                self.db.close();
                self.db = null;
                return resolve(null);
            })
        });
    }

    save_proj(proj) {
        let coll = this.db.getCollection("project");
        let items = coll.find({
            'id': {
                '$eq': proj.id
            }
        });
        if (items && items.length > 0) {
            coll.remove(items[0]);
        }
        coll.insert(proj);
        this.proj = proj;
    }

    find_case(case_id) {
        return this.proj.luas.find(it => it.id === case_id);
    }

    clear_outs(case_id) {
        this.db.removeCollection(case_id);
        this.db.addCollection(case_id, {
            unique: ['time']
        });
        this.db.removeCollection(case_id + '_rcd');
        this.db.addCollection(case_id + '_rcd', {
            unique: ['$time']
        });
        this.last_msg = {};
    }

    save() {
        this.db.saveDatabase();
    }

    save_outs(case_id, outs) {
        let coll_msg = this.db.getCollection(case_id);
        let coll_rcd = this.db.getCollection(case_id + '_rcd');
        let last_msg = {}
        outs.forEach(msg => {
            if (msg.catalog === 'record') {
                let rcd = msg.value;
                rcd.$time = msg.time;
                coll_rcd.insert(rcd);
                if (last_msg.catalog !== 'record') {
                    last_msg = {
                        time: msg.time,
                        kind: 'record',
                        catalog: 'record',
                        count: 1,
                        from: msg.time,
                        to: msg.time,
                        front_rcds: [rcd],
                        back_rcds: [],
                    }
                    coll_msg.insert(last_msg);
                } else {
                    last_msg.count++;
                    last_msg.to = msg.time;
                    if (last_msg.front_rcds.length < 5) {
                        last_msg.front_rcds.push(rcd);
                    } else {
                        last_msg.back_rcds.push(rcd);
                        if (last_msg.back_rcds.length > 5) {
                            last_msg.back_rcds.shift();
                        }
                    }
                }
            } else {
                coll_msg.insert(msg);
                last_msg = msg;
            }
        });
    }

    get_outs_items(case_id, begin_time) {
        let coll = this.db.getCollection(case_id);
        if (!coll) {
            return null;
        }
        return coll.find({
            'time': {
                '$gt': begin_time
            }
        });
    }

    get_outs_rcds(case_id, begin_time) {
        let coll = this.db.getCollection(case_id + '_rcd');
        if (!coll) {
            return [];
        }
        return coll.find({
            '$time': {
                '$gt': begin_time
            }
        });
    }

    get_outs_debug_reverse(items, limit) {
        let res = [];
        let idx = 0;
        for (let index = items.length - 1; index >= 0; index--) {
            res.unshift(helper.format_item(items[index]));
            idx++;
            if (idx >= limit) {
                return res;
            }
        }
        return res;
    }

    get_outs_debug(items, limit) {
        let res = [];
        let idx = 0;
        items.forEach(item => {
            res.push(helper.format_item(item));
            idx++;
            if (idx >= limit) {
                return res;
            }
        });
        return res;
    }

    get_outs(info) {
        if (info.proj_id !== this.proj_id) {
            return null;
        }

        let items = this.get_outs_items(info.case_id, info.begin_time);
        if (!items || items.length === 0) {
            return null;
        }

        let res = {
            is_stop: !!items.find(msg => msg.kind === 'stop' && msg.catalog === 'system')
        }
        if (info.kinds.debug) {
            res.debug = info.limit >= 0 ? this.get_outs_debug(items, info.limit) : this.get_outs_debug_reverse(items, -info.limit);
        }
        if (info.kinds.console) {
            let nitems = items.filter(item => item.catalog === 'log' || (item.catalog === 'system' && ['exit', 'error', 'assertFail', 'verifyFail', 'print'].includes(item.kind)));
            res.console = info.limit >= 0 ? this.get_outs_debug(nitems, info.limit) : this.get_outs_debug_reverse(nitems, -info.limit);
        }
        if (info.kinds.recorder || info.kinds.records) {
            let rcds = this.get_outs_rcds(info.case_id, info.begin_time);
            if (rcds && rcds.length > 0) {
                if (info.kinds.recorder) {
                    let rcd = {};
                    rcds.forEach(r => {
                        for (let k in r) {
                            rcd[k] = r[k];
                        }
                    });
                    res.recorder = rcd;
                }
            }
        }
        return res;
    }

}

export default RunDb;