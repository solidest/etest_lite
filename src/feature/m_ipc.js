import {
    ipcMain,
} from 'electron';
import db from './m_db';

function setup() {
    ipcMain.handle('list_proj', () => {
        return db.list_proj();
    });
    ipcMain.handle('insert_proj', (_, doc) => {
        return db.insert_proj(doc);
    });
    ipcMain.handle('update_proj', (_, doc) => {
        return db.update_proj(doc);
    });
    ipcMain.handle('remove_proj', (_, doc) => {
        return db.remove_proj(doc);
    });
    ipcMain.handle('list', (_, opt) => {
        return db.list(opt.kind, opt.proj_id);
    });
    ipcMain.handle('insert', (_, opt) => {
        return db.insert(opt.kind, opt.doc);
    });
    ipcMain.handle('update', (_, opt) => {
        return db.update(opt.kind, opt.doc);
    });
    ipcMain.handle('remove', (_, opt) => {
        return db.remove(opt.kind, opt.doc);
    });
    ipcMain.handle('remove', (_, opt) => {
        return db.remove(opt.kind, opt.doc);
    });
}

export default { setup }