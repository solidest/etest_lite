
const path = require('path');
const loki = require('lokijs');
const fs = require('fs');
const cfg = require('../../src/api/config');

async function open_exit() {
    let db_file = path.resolve(cfg.db_path, 'db01.db');
    if(!fs.existsSync(db_file)) {
        return null;
    }
    return new Promise(resolve => {
        let db = new loki(db_file, {
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
