import {
    ipcMain,
} from 'electron';
import db from './m_db';

let worker;

function try_check(proj_id, reason) {
    if(!proj_id || !worker) {
        console.log('empty check')
        return;
    }
    worker.webContents.send('check', proj_id, reason);
}

function setup(w) {
    worker = w;
    ipcMain.handle('list_proj', () => {
        return db.list_proj();
    });
    ipcMain.handle('insert_proj', (_, doc) => {
        return db.insert_proj(doc);
    });
    ipcMain.handle('update_proj', (_, doc) => {
        let res = db.update_proj(doc);
        try_check(doc.id, 'update_proj');
        return res;
    });
    ipcMain.handle('remove_proj', (_, doc) => {
        return db.remove_proj(doc);
    });
    ipcMain.handle('list', (_, opt) => {
        return db.list(opt.kind, opt.proj_id);
    });
    ipcMain.handle('insert', (_, opt) => {
        let res = db.insert(opt.kind, opt.doc);
        try_check(opt.doc.proj_id, 'insert');
        return res;
    });
    ipcMain.handle('update', (_, opt) => {
        let res = db.update(opt.kind, opt.doc);
        try_check(opt.doc.proj_id, 'update');
        return res;
    });
    ipcMain.handle('remove', (_, opt) => {
        let res = db.remove(opt.kind, opt.doc);
        try_check(opt.doc.proj_id, 'remove');
        return res;
    });
    ipcMain.handle('load', (_, opt) => {
        return db.load(opt.kind, opt.id);
    });
}

export default { setup }