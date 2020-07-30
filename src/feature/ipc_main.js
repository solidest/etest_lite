import {
    ipcMain,
    dialog,
} from 'electron';
import db from './m_db';
import assist from '../assist';

let worker;

function work_check(proj_id, reason) {
    if (!proj_id || !worker) {
        console.log('empty check')
        return;
    }
    worker.webContents.send('check', proj_id, reason);
}

function open(_worker, db_path) {
    worker = _worker;
    db.open(db_path);

    ipcMain.handle('load_proj', (_, id) => {
        return db.load_proj(id);
    });
    ipcMain.handle('list_proj', () => {
        return db.list_proj();
    });
    ipcMain.handle('insert_proj', (_, doc) => {
        return db.insert_proj(doc);
    });
    ipcMain.handle('update_proj', (_, doc) => {
        let res = db.update_proj(doc);
        work_check(doc.id, 'update_proj');
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
        work_check(opt.doc.proj_id, 'insert');
        return res;
    });
    ipcMain.handle('update', (_, opt) => {
        let res = db.update(opt.kind, opt.doc);
        work_check(opt.doc.proj_id, 'update');
        return res;
    });
    ipcMain.handle('remove', (_, opt) => {
        let res = db.remove(opt.kind, opt.doc);
        work_check(opt.doc.proj_id, 'remove');
        return res;
    });
    ipcMain.handle('load', (_, opt) => {
        return db.load(opt.kind, opt.id);
    });
    ipcMain.handle('clone_element', (_, opt) => {
        return assist.clone_element(opt.kind, opt.proj_id, opt.id);
    });
    ipcMain.handle('export_element', async (_, opt) => {
        let file = await dialog.showSaveDialog(null, {
            filters: [{name: 'ETL文件', extensions: [opt.kind==="panel"? 'yml':'etl']}],
            title: '导出文件',
            defaultPath: opt.name,
        });
        if(file.canceled) {
            return {
                result: 'ok',
            }
        }
        try {
            assist.export_element(opt.kind, opt.id, file.filePath);
            return {
                result: 'ok',
            }
        } catch (error) {
            return {
                result: 'error',
                value: error.message,
            }
        }
    });
}

async function close() {
    await db.close();
}

export default {
    open,
    close
}