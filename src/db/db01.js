
const path = require('path');
const loki = require('lokijs');
const lfsa = require('lokijs/src/loki-fs-structured-adapter');
const fs = require('fs');
const cfg = require('../api/config');

const db00 = require('./db00.js');
let _db;

const colls = ['project', 'doc', 'public', 'config']

async function _create_db(db_file) {
    return new Promise(resolve => {
        let db = new loki(db_file, {
            adapter: new lfsa(),
            autoload: true,
            autoloadCallback : () => {
                colls.forEach(kind => {
                    db.addCollection(kind);
                });
                db.saveDatabase(() => {
                    return resolve(db);
                });
            }
        });
    });
}

async function _create_from(old_db, new_db_file) {
    let db = await _create_db(new_db_file);
    console.log('TODO SAVE OLD DB DATA', old_db);
    return db;
}

async function open() {
    let db_file = path.resolve(cfg.db_path, 'db01.db');
    if(!fs.existsSync(db_file)) {
        let old_db = await db00.open_exit(db_path);
        let _db = old_db ? await _create_from(old_db) : await _create_db(db_file);
        return _db;
    }
    return new Promise(resolve => {
        let db = new loki(db_file, {
            adapter: new lfsa(),
            autoload: true,
            autoloadCallback : () => {
                _db = db;
                return resolve(_db);
            }
        });
    });
}

// function open(db_path) {
//     let f = path.resolve(db_path, 'db.json');
//     _db = new loki(f, {
//         autoload: true,
//         autoloadCallback : init,
//     });
// }

// function init() {
//     _init = true;
//     let coll = _db.getCollection("project");
//     if(!coll) {
//         _db.addCollection("project");
//         kinds.forEach(kind => {
//             _db.addCollection(kind);
//         });        
//     }
// }

// function close() {
//     if(!_db || !_init) {
//         return;
//     }
//     return new Promise(resolve => {
//         _db.saveDatabase(() =>{
//             _db.close();
//             _db = null;
//             return resolve();
//         });  
//     })
// }

// // {id: 'xx', proj_id: 'xx', name: 'xx', ....}
// function list(kind, proj_id) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection(kind);
//     if(!coll) {
//         console.log('error kind =', kind);
//         return;
//     }
//     return coll.chain().find({'proj_id': { '$eq' : proj_id }}).simplesort('name').data();
// }

// function load(kind, id) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection(kind);
//     if(!coll) {
//         console.log('error kind =', kind);
//         return;
//     }
//     let res = coll.find({'id': { '$eq' : id }});
//     if(res && res.length===1) {
//         return res[0];
//     }
//     return null;
// }

// function insert(kind, doc) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection(kind);
//     if(!coll) {
//         console.log('error kind =', kind);
//         return;
//     }
//     coll.insert(doc);
//     return update_proj({id: doc.proj_id});
// }

// function update(kind, doc) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection(kind);
//     if(!coll) {
//         console.log('error kind =', kind);
//         return;
//     }
//     let olddocs = coll.find({'id': { '$eq' : doc.id }});
//     if(!olddocs || olddocs.length === 0) {
//         insert(kind, doc);
//     } else {
//         let olddoc = olddocs[0];
//         for(let k in doc) {
//             olddoc[k] = doc[k];
//         }
//     }
//     return update_proj({id: doc.proj_id});
// }

// function _remove_doc(id) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('doc');
//     let items = coll.find({'id': { '$eq' : id }});
//     if(!items || items.length===0) {
//         return;
//     }
//     coll.remove(items[0]);
// }

// function _remove_kinds(proj_id) {
//     if(!_db || !_init) {
//         return;
//     }
//     kinds.forEach(k => {
//         let coll = _db.getCollection(k);
//         let items = coll.find({'proj_id': { '$eq' : proj_id }});
//         if(items) {
//             for(let it of items) {
//                 coll.remove(it);
//             };
//         }
//     });
// }


// function remove(kind, doc) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection(kind);
//     if(!coll) {
//         console.log('error kind =', kind);
//         return;
//     }
//     let id = doc.id;
//     let proj_id = doc.proj_id;
//     let item = coll.find({'id': { '$eq' : id }})[0];
//     if(!item) {
//         return;
//     }
//     if(kind!=='doc' && id!==proj_id) {
//         _remove_doc(id);
//     }
//     coll.remove(item);
//     return update_proj({id: proj_id});
// }

// //{name: 'xx', last_open: xxxx, created: xxxx}
// function load_proj(id) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('project');
//     let res = coll.find({'id': { '$eq' : id }});
//     if(res && res.length===1) {
//         return res[0];
//     }
//     return null;
// }

// function list_proj() {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('project');
//     if(!coll) {
//         console.log('error list_proj');
//         return;
//     }
//     return coll.chain().simplesort('updated', true).data();
// }

// function insert_proj(proj) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('project');
//     if(!coll) {
//         console.log('error proj =', proj);
//         return;
//     }
//     if(!proj.updated) {
//         proj.updated = Date.now();
//     }
//     coll.insert(proj);
//     auto_save();
//     return proj.updated;
// }

// function update_proj(proj) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('project');
//     if(!coll) {
//         console.log('error proj =', proj);
//         return;
//     }
//     let doc = coll.find({'id': { '$eq' : proj.id }})[0];
//     proj.updated = Date.now();
//     for(let k in proj) {
//         doc[k] = proj[k];
//     }
//     auto_save();
//     return proj.updated;
// }

// function remove_proj(proj) {
//     if(!_db || !_init) {
//         return;
//     }
//     let coll = _db.getCollection('project');
//     if(!coll) {
//         console.log('error proj =', proj);
//         return;
//     }
//     let doc = coll.find({'id': { '$eq' : proj.id }})[0];
//     _remove_kinds(proj.id);
//     coll.remove(doc);
//     auto_save();
// }

// function recent_proj() {
//     if(!_db || !_init) {
//         return;
//     }
//     let projs = list_proj();
//     if(projs && projs.length>0){
//         return projs[0].id;
//     }
//     return null;
// }


module.exports = {
    open, 
}
