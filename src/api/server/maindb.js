const loki = require('lokijs');
const lfsa = require('lokijs/src/loki-fs-structured-adapter');
const shortid = require('shortid');
const { app } = require('electron');

const colls = ['project', 'public', 'config'];
const VERSION = 1;
let db_name = app.getPath('appData') + '/etest_dev/basedb.db';
console.log('db path :', db_name);
let _base_db;
let _coll_proj;

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
        value: VERSION,
    });
    db.saveDatabase();
}

async function open() {
    return new Promise((resolve, reject) => {
        if (_base_db) {
            return resolve(_base_db);
        }
        let db = new loki(db_name, {
            adapter: new lfsa(),
            autosave: false,
            autoload: true,
            autoloadCallback: () => {
                let coll = db.getCollection('config');
                if (coll) {
                    let v = coll.findOne({
                        id: 'version'
                    });
                    if (v > VERSION) {
                        return reject({
                            message: 'ETestDev版本过低, 请升级到新的版本!'
                        });
                    } else if (v < VERSION) {
                        let up_handle = _upgrade[`upgrade_${v}_${VERSION}`];
                        if(up_handle) {
                            db = up_handle(db);
                        } else {
                            console.error('TODO upgrade');
                        }
                    }
                } else {
                    _init_db(db);
                }
                _base_db = db;
                _coll_proj = db.getCollection('project');
                return resolve(_base_db);
            }
        });
    });
}

function create(name, memo) {
    let t = Date.now();
    let doc = {
        id: shortid.generate(),
        created: t,
        updated: t,
        name,
        memo,
    }
    doc = _coll_proj.insert(doc);
    _base_db.saveDatabase();
    return doc;
}

function update(proj) {
    _coll_proj.findAndUpdate({id: proj.id}, (olddoc => {
        for(let k in proj) {
            olddoc[k] = proj[k];
        }
    }));
    _base_db.saveDatabase();
}

function remove(proj_id) {
    _coll_proj.findAndRemove({id: proj_id});
    _base_db.saveDatabase();
}

function list() {
    return _coll_proj.chain().find().simplesort('updated', true).data();
}

function changed(proj_id) {
    _coll_proj.findAndUpdate({id: proj_id}, (doc => {
        doc.updated = Date.now();
    }));
}

function close() {
    return new Promise((resolve) => {
        _base_db.saveDatabase(() => {
            _base_db = null;
            return resolve();
        });        
    });
}

function tpl_add(doc) {
    let coll = _base_db.getCollection('public');
    doc.id = shortid.generate();
    coll.insert(doc);
    _base_db.saveDatabase();
}

function tpl_list(kind) {
    let coll = _base_db.getCollection('public');
    return coll.chain().find({kind}).simplesort('name').data();
}

function tpl_del(id) {
    let coll = _base_db.getCollection('public');
    _base_db.saveDatabase();
    coll.findAndRemove({id});
}

module.exports = {
    open,
    close,
    create,
    remove,
    list,
    update,
    changed,
    tpl_add,
    tpl_list,
    tpl_del
}