import loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter.js';
import shortid from 'shortid';

let _base_db;

const version = 1;
const db_name = 'etestdev_basedb.db';
const colls = ['project', 'public', 'config'];

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
    db.saveDatabase();
}

async function open() {
    return new Promise((resolve, reject) => {
        if (_base_db) {
            return resolve(_base_db);
        }
        let db = new loki(db_name, {
            adapter: new LokiIndexedAdapter(),
            autosave: false,
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
                _base_db = db;
                return resolve(_base_db);
            }
        });
    });
}

function create(name, memo) {
    let coll = _base_db.getCollection('project');
    let t = Date.now();
    let doc = {
        id: shortid.generate(),
        created: t,
        updated: t,
        name,
        memo,
    }
    doc = coll.insert(doc);
    _base_db.save();
    return doc;
}

function remove(proj) {
    let coll = _base_db.getCollection('project');
    coll.remove(proj);
    _base_db.save();
}

function list() {
    let coll = _base_db.getCollection('project');
    return coll.find();
}

function save(close) {
    _base_db.save(() => {
        if (close) {
            _base_db = null;
        }        
    });
}

export default {
    open,
    create,
    remove,
    list,
    save,
}