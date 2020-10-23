import loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter.js';
import cfg from '../src/doc/config';
import helper from '../src/utility/helper';

let _proj_id;
let _proj_db;

const version = 1;
const colls = ['src', 'panel', 'config'];

const _upgrade = {
    upgrade_1_2: function (db) {
        return db;
    }
}

function _init_db(db) {
    colls.forEach(kind => {
        db.addCollection(kind, {
            unique: ["id"],
        });
    });
    let coll = db.getCollection('config');
    coll.insert({
        id: 'version',
        value: version,
    });
    coll.insert({
        id: 'tree',
        value: helper.deep_copy(cfg.default_tree),
    })
    db.saveDatabase();
}


async function open(proj_id) {
    return new Promise((resolve, reject) => {
        if (_proj_id === proj_id) {
            return resolve(_proj_db);
        }
        let db = new loki(`etestdev_${proj_id}.db`, {
            adapter: new LokiIndexedAdapter(),
            autosave: true,
            autoload: true,
            autoloadCallback: () => {
                let coll = db.getCollection('config');
                if (coll) {
                    let v = coll.findOne({
                        id: 'version'
                    });
                    if (v > version) {
                        return reject({
                            message: 'ETestDev版本过低, 请升级到新的版本!'
                        });
                    } else if (v < version) {
                        _upgrade[`upgrade_${v}_${version}`](db);
                    }
                } else {
                    _init_db(db);
                }
                _proj_id = proj_id;
                _proj_db = db;
                return resolve(_proj_db);
            }
        });
    });
}

function get_tree() {
    let coll = _proj_db.getCollection('config');
    return coll.findOne({id: 'tree'}).value;
}

function set_tree(tree) {
    let coll = _proj_db.getCollection('config');
    return coll.findAndUpdate({id: 'tree'}, it=>it.value=tree);
}

function del_doc(id) {
    let coll = _proj_db.getCollection('src');
    return coll.findAndRemove({id});
}

function get_doc(id) {
    let coll = _proj_db.getCollection('src');
    return coll.findOne({id: id});
}

function set_doc(doc) {
    let coll = _proj_db.getCollection('src');
    return coll.update(doc);
}

function put_doc(doc) {
    let coll = _proj_db.getCollection('src');
    return coll.insert(doc);
}

async function save(close) {
    return new Promise((resolve) => {
        _proj_db.save(()=>{
            if (close) {
                _proj_id = null;
                _proj_db = null;
            }
            return resolve();
        });
    });
}

export default {
    open,
    get_tree,
    set_tree,
    get_doc,
    set_doc,
    put_doc,
    del_doc,
    save,
}