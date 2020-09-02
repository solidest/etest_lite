
import path from 'path';
import loki  from 'lokijs';

import {
    debounce
} from 'throttle-debounce';

const kinds = ['program', 'panel', 'protocol', 'device', 'topology', 'simu', 'doc']

let _db;
let _init = false;

let auto_save = debounce(4000, () => {_db.saveDatabase();});

function open(db_path) {
    let f = path.resolve(db_path, 'db.json');
    _db = new loki(f, {
        autoload: true,
        autoloadCallback : init,
    });
}

function init() {
    _init = true;
    let coll = _db.getCollection("project");
    if(!coll) {
        _db.addCollection("project");
        kinds.forEach(kind => {
            _db.addCollection(kind);
        });        
    }
}

function close() {
    if(!_db || !_init) {
        return;
    }
    return new Promise(resolve => {
        _db.saveDatabase(() =>{
            _db.close();
            _db = null;
            return resolve();
        });  
    })
}

// {id: 'xx', proj_id: 'xx', name: 'xx', ....}
function list(kind, proj_id) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    return coll.chain().find({'proj_id': { '$eq' : proj_id }}).simplesort('name').data();
}

function load(kind, id) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    let res = coll.find({'id': { '$eq' : id }});
    if(res && res.length===1) {
        return res[0];
    }
    return null;
}

function insert(kind, doc) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    coll.insert(doc);
    return update_proj({id: doc.proj_id});
}

function update(kind, doc) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    let olddocs = coll.find({'id': { '$eq' : doc.id }});
    if(!olddocs || olddocs.length === 0) {
        insert(kind, doc);
    } else {
        let olddoc = olddocs[0];
        for(let k in doc) {
            olddoc[k] = doc[k];
        }
    }
    return update_proj({id: doc.proj_id});
}

function _remove_doc(id) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('doc');
    let items = coll.find({'id': { '$eq' : id }});
    if(!items || items.length===0) {
        return;
    }
    coll.remove(items[0]);
}

function _remove_kinds(proj_id) {
    if(!_db || !_init) {
        return;
    }
    kinds.forEach(k => {
        let coll = _db.getCollection(k);
        let items = coll.find({'proj_id': { '$eq' : proj_id }});
        if(items) {
            for(let it of items) {
                coll.remove(it);
            }
        }
    });
}


function remove(kind, doc) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    let id = doc.id;
    let proj_id = doc.proj_id;
    let item = coll.find({'id': { '$eq' : id }})[0];
    if(!item) {
        return;
    }
    if(kind!=='doc' && id!==proj_id) {
        _remove_doc(id);
    }
    coll.remove(item);
    return update_proj({id: proj_id});
}

//{name: 'xx', last_open: xxxx, created: xxxx}
function load_proj(id) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('project');
    let res = coll.find({'id': { '$eq' : id }});
    if(res && res.length===1) {
        return res[0];
    }
    return null;
}

function list_proj() {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error list_proj');
        return;
    }
    return coll.chain().simplesort('updated', true).data();
}

function insert_proj(proj) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error proj =', proj);
        return;
    }
    if(!proj.updated) {
        proj.updated = Date.now();
    }
    coll.insert(proj);
    auto_save();
    return proj.updated;
}

function update_proj(proj) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error proj =', proj);
        return;
    }
    let doc = coll.find({'id': { '$eq' : proj.id }})[0];
    proj.updated = Date.now();
    for(let k in proj) {
        doc[k] = proj[k];
    }
    auto_save();
    return proj.updated;
}

function remove_proj(proj) {
    if(!_db || !_init) {
        return;
    }
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error proj =', proj);
        return;
    }
    let doc = coll.find({'id': { '$eq' : proj.id }})[0];
    _remove_kinds(proj.id);
    coll.remove(doc);
    auto_save();
}

function recent_proj() {
    if(!_db || !_init) {
        return;
    }
    let projs = list_proj();
    if(projs && projs.length>0){
        return projs[0].id;
    }
    return null;
}

export default { 
    open, close, list, load, insert, update, remove, load_proj,
    list_proj, insert_proj, update_proj, remove_proj, recent_proj, 
}
