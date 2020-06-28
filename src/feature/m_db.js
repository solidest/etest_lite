
import {
    app,
} from 'electron';
import path from 'path';
import loki  from 'lokijs';
import fs from 'fs';

const kinds = ['program', 'panel', 'protocol', 'device', 'topology', 'simu', 'doc']

let _db

function setup(is_dev) {
    let df = process.platform === 'darwin' ? '/Users/baiyunxiang/Desktop/etest_lite/db' : 'C:/Users/solidest/Desktop/etest_lite/db';
    let exe_path = is_dev ? df : path.dirname(app.getPath('exe'));
    let f = path.resolve(exe_path, 'db.json');

    let bexists = fs.existsSync(f);
    _db = new loki(f, {
        autoload: true,
        autosave: true, 
        autosaveInterval: 3000
    });

    if(!bexists) {
        _db.addCollection("project");
        kinds.forEach(kind => {
            _db.addCollection(kind);
        });
        // _db.addCollection("program");
        // _db.addCollection("panel");
        // _db.addCollection("protocol");
        // _db.addCollection("device");
        // _db.addCollection("topology");
        // _db.addCollection("simu");
        // _db.addCollection("doc");
    }
}

function save() {
    if(!_db) {
        return;
    }
    _db.saveDatabase();
    _db = null;
}

// {id: 'xx', proj_id: 'xx', name: 'xx', ....}
function list(kind, proj_id) {
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    return coll.chain().find({'proj_id': { '$eq' : proj_id }}).simplesort('name').data();
}

function load(kind, id) {
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
    let coll = _db.getCollection(kind);
    if(!coll) {
        console.log('error kind =', kind);
        return;
    }
    coll.insert(doc);
    update_proj({id: doc.proj_id});
}

function update(kind, doc) {
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
    update_proj({id: doc.proj_id});
}

function _remove_doc(id) {
    let coll = _db.getCollection('doc');
    let items = coll.find({'id': { '$eq' : id }});
    if(!items || items.length===0) {
        return;
    }
    coll.remove(items[0]);
    console.log('remove doc', id);
}

// function _remove_docs(proj_id) {
//     let coll = _db.getCollection('doc');
//     let items = coll.find({'proj_id': { '$eq' : proj_id }});
//     if(!items || items.length===0) {
//         return;
//     }
//     for(let it of items) {
//         coll.remove(it);
//     }
//     console.log('remove docs', items.length);
// }

function _remove_kinds(proj_id) {
    kinds.forEach(k => {
        let coll = _db.getCollection(k);
        let items = coll.find({'proj_id': { '$eq' : proj_id }});
        if(items) {
            for(let it of items) {
                coll.remove(it);
            };
        }
    });
}


function remove(kind, doc) {
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
    update_proj({id: proj_id});
}

//{name: 'xx', last_open: xxxx, created: xxxx}
function list_proj() {
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error list_proj');
        return;
    }
    return coll.chain().simplesort('updated', true).data();
}

function insert_proj(proj) {
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error proj =', proj);
        return;
    }
    coll.insert(proj);
}

function update_proj(proj) {
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
}

function remove_proj(proj) {
    let coll = _db.getCollection('project');
    if(!coll) {
        console.log('error proj =', proj);
        return;
    }
    let doc = coll.find({'id': { '$eq' : proj.id }})[0];
    _remove_kinds(proj.id);
    coll.remove(doc);
}

function recent_proj() {
    let projs = list_proj();
    if(projs && projs.length>0){
        return projs[0].id;
    }
    return null;
}



export default { 
    setup, save, list, load, insert, update, remove,
    list_proj, insert_proj, update_proj, remove_proj, recent_proj, 
}
