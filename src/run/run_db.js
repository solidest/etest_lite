
import loki  from 'lokijs';
import lfsa from 'lokijs/src/loki-fs-structured-adapter';
import path from 'path';
import fs from 'fs';
import {
    debounce
} from 'throttle-debounce';


let _db_path;
let _db;

class RunDb {
    constructor(dbfile, id, cb) {
        this.id = id;
        this.db = new loki(dbfile, {
            adapter:  new lfsa(),
            autoload: true,
            autoloadCallback : () => { _db.init(cb); },
        });
        let self = this;
        this.auto_save = debounce(4000, ()=> self.db.saveDatabase());
    }

    init(cb) {
        let coll = this.db.getCollection("project");
        if(!coll) {
            this.db.addCollection("project");
            this.db.addCollection("outs");
            this.db.addCollection("record");
        }
        if(cb) {
            cb(this);
        }
    }

    save(cb) {
        this.db.saveDatabase(cb);
    }

    save_proj(proj) {
        let coll = this.db.getCollection("project");
        let items = coll.find({'id': { '$eq' : proj.id }});
        if(items && items.length>0) {
            coll.remove(items[0]);
        }
        coll.insert(proj);
        this.save();
    }
}


function setup(db_path) {
    _db_path = db_path;
    console.log('db_path', db_path);
}

function get_db(proj_id, cb) {
    if(_db && _db.id === proj_id) {
        return cb(_db);
    }
    
    if(_db) {
        _db.save();
        _db = null;
    }
    let pf = path.resolve(_db_path, proj_id);
    if(!fs.existsSync(pf)) {
        fs.mkdirSync(pf);
    }
    let f = path.resolve(pf, 'run.db');
    _db = new RunDb(f, proj_id, cb);
}

function save_proj(proj) {
    get_db(proj.id, (db)=>{
        if(!db) {
            console.log('aaaaa')
        }
        db.save_proj(proj);
    });
}

function save(cb) {
    if(_db) {
        _db.save(cb);
    } else {
        cb();
    }
}

export default {
    setup,
    save,
    save_proj,

}