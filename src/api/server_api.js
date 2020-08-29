
import {
    ipcMain,
} from 'electron';

let _db;

function project_list(_) {
    let data = [];
    for (let index = 0; index < 20; index++) {
        data.push({
            id: index,
            name: '项目名称xxxx' + index,
            created: Date.now(),
            updated: Date.now(),
        })
    }
    return {
        result: 'ok',
        data: data,
    };
}

function project_new(_, info) {
    console.log('TODO NEW', info);
    return {
        result: 'ok',
    }
}

function project_del(_, id) {
    console.log('TODO DEL', id);
    return {
        result: 'ok',
    }
}

function project_rename(_, info) {
    console.log('TODO RENAME', info);
    return {
        result: 'ok',
    }
}

function project_open(_, id) {
    console.log('TODO OPEN', id);
    return {
        result: 'ok',
        value: {
            id: id,
            name: 'demo'
        }
    }
}


export default {
    setup(db, win_api) {
        _db = db;
        ipcMain.handle('project_list', project_list);
        ipcMain.handle('project_new', project_new);
        ipcMain.handle('project_del', project_del);
        ipcMain.handle('project_rename', project_rename);
        ipcMain.handle('project_open', project_open);
        ipcMain.handle('project_active', win_api.project_active);
        ipcMain.handle('project_export', win_api.project_export);
        ipcMain.handle('project_open_inwin', win_api.project_open_inwin)
    }
}