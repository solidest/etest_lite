
const path = require('path');
const loki = require('lokijs');
const fs = require('fs');
const debounce = require('throttle-debounce').debounce;
const auto_save = debounce(4000, () => {_db.saveDatabase();});

async function open_exit(db_path) {
    let db_file = path.resolve(db_path, 'db01.db');
    if(!fs.existsSync(db_file)) {
        return null;
    }
    return new Promise(resolve => {
        db = new loki(f, {
            autoload: true,
            autoloadCallback : () => {
                return resolve(db);
            }
        });
    });
}

module.exports = {
    open_exit, 
}
