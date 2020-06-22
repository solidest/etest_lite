
import {
    app,
} from 'electron';
import path from 'path';
import loki  from 'lokijs';
import fs from 'fs';

let _db

function setup(is_dev) {
    let exe_path = is_dev ? 'C:/Users/solidest/Desktop/etest_lite/db' : path.dirname(app.getPath('exe'));
    let f = path.resolve(exe_path, 'db.json');

    let bexists = fs.existsSync(f);
    _db = new loki(f, {
        autoload: true,
        autosave: true, 
        autosaveInterval: 3000
    });

    if(!bexists) {
        _db.addCollection("project");
        _db.addCollection("program");
        _db.addCollection("protocol");
        _db.addCollection("device");
        _db.addCollection("topology");
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
    return coll.chain().find({'proj_id': { '$eq' : proj_id }}).simplesort(name).data();
}

function insert(kind, doc) {
    let coll = _db.getCollection(kind);
    coll.insert(doc);
}

function update(kind, doc) {
    let coll = _db.getCollection(kind);
    let olddoc = coll.find({'id': { '$eq' : doc.id }});
    for(let k in doc) {
        olddoc[k] = doc[k];
    }
}

function remove(kind, doc) {
    let coll = _db.getCollection(kind);
    coll.remove(doc);
}

//{name: 'xx', last_open: xxxx, created: xxxx}
function list_proj() {
    let coll = _db.getCollection('project');
    return coll.chain().simplesort(last_open, true).data();
}

function insert_proj(proj) {
    let coll = _db.getCollection('project');
    coll.insert(proj);
}

function update_proj(proj) {
    let coll = _db.getCollection('project');
    let doc = coll.find({'id': { '$eq' : proj.id }});
    for(let k in proj) {
        doc[k] = proj[k];
    }
}

function remove_proj(proj) {
    let coll = _db.getCollection('project');
    let doc = coll.find({'id': { '$eq' : proj.id }});
    coll.remove(doc);
}


export default { setup, save, list, insert, update, remove, list_proj, insert_proj, update_proj, remove_proj }
