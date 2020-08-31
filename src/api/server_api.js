
import {
    ipcMain,
} from 'electron';

const src_tree = require('../views/MainBar/SrcTree/config');
const debounce = require('throttle-debounce').debounce;
const helper = require('../utility/helper');

let _db;
const auto_save = debounce(4000, () => {_db.saveDatabase();});

function project_list(_) {
    let coll = _db.getCollection('project');
    let projs = coll.chain().simplesort('updated', true).data();
    let data = projs.map(p => {
        return {
            id: p.id,
            name: p.name,
            created: p.created,
            updated: p.updated,
            memo: p.memo,
            case_count: p.count,
            run_result: p.result,
        }
    });
    return {
        result: 'ok',
        data: data,
    };
}

function project_new(_, info) {
    let coll = _db.getCollection('project');
    let t = Date.now();
    coll.insert({
        id: info.id,
        name: info.name,
        memo: info.memo,
        updated: t,
        created: t,
        tree: helper.default.deep_copy(src_tree.default_src)
    });
    auto_save();
    return {
        result: 'ok',
    }
}

function project_del(_, id) {
    let coll = _db.getCollection('doc');
    let items = coll.find({'proj_id': { '$eq' : id }});
    if(items) {
        for(let it of items) {
            coll.remove(it);
        };
    }

    console.log('CLEAR RUNS');
    
    coll = _db.getCollection('project');
    proj = coll.find({'id': { '$eq' : id }})[0];
    coll.remove(proj);

    auto_save();
    return {
        result: 'ok',
    }
}

function project_rename(_, info) {
    let coll = _db.getCollection('project');
    let doc = coll.find({'id': { '$eq' : info.id }})[0];
    info.updated = Date.now();
    for(let k in info) {
        doc[k] = info[k];
    }
    auto_save();
    return {
        result: 'ok',
        value: doc.updated
    }
}

function project_open(_, id) {
    let coll = _db.getCollection('project');
    let res = coll.find({'id': { '$eq' : id }});
    if(res && res.length === 1) {
        return {
            result: 'ok',
            value: res[0]
        }        
    }
    return {
        result: 'nil',
        value: '项目未找到'
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
        ipcMain.handle('project_open_inwin', win_api.project_open_inwin);
    }
}