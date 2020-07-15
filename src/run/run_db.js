import fs from 'fs';
import loki  from 'lokijs';

class RunDb {
    static create(db_path, proj) {
        let f = path.resolve(db_path, proj.id + '.etp');
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
        }
    }
}

export default RunDb;