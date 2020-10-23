import loki from 'lokijs';
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter';

let _db;
let _colls = {};

function _err_res(id, err_kind, value) {
    self.postMessage({
        id,
        result: err_kind,
        value
    });
}

function _res_res(id, value) {
    self.postMessage({
        id,
        value,
        result: 'ok'
    });
}

function _init(colls) {
    colls.forEach(coll => {
        let c = _db.getCollection(coll);
        if(!c) {
            c = _db.addCollection(coll, {unique: ['id']});
        }
        _colls[coll] = c;
    })
}

function _get(coll, id) {
    if (!coll || !id) {
        throw new Error('get参数错误');
    }
    let c = _colls[coll];
    if(!c) {
        throw new Error(`集合名称“${coll}”错误`);
    }
    return c.findOne({id});
}

function _remove(coll, id) {
    if (!coll || !id) {
        throw new Error('get参数错误');
    }
    let c = _colls[coll];
    if(!c) {
        throw new Error(`集合名称“${coll}”错误`);
    }
    c.findAndRemove({id});
    return id;
}

function _insert(coll, doc) {
    if (!coll || !doc) {
        throw new Error('insert参数错误');
    }
    let c = _colls[coll];
    if(!c) {
        throw new Error(`集合名称“${coll}”错误`);
    }
    c.insert(doc);
    return doc.id;
}


function _update(coll, doc) {
    if (!coll || !doc) {
        throw new Error('update参数错误');
    }
    let c = _colls[coll];
    if(!c) {
        throw new Error(`集合名称“${coll}”错误`);
    }
    c.findAndUpdate({id: doc.id}, (olddoc => {
        for(let k in doc) {
            olddoc[k] = doc[k];
        }
    }));
    return doc.id;
}

function _find(coll, filter, sort, is_desc, limit) {
    if (!coll) {
        throw new Error('find参数错误');
    }
    let c = _colls[coll];
    if(!c) {
        throw new Error(`集合名称“${coll}”错误`);
    }
    let cc = c.chain().find(filter);
    if(sort) {
        cc = cc.simplesort(sort, is_desc);
    }
    if(limit>0) {
        cc = cc.limit(limit);
    }
    return cc.data();
}

function open(cmd_id, params) {
    if (!params || !params.colls) {
        throw new Error('未指定数据库集合列表');
    }
    if (params.dbname) {
        let db = new loki(params.dbname, {
            adapter: new LokiIndexedAdapter(),
            autosave: true,
            autoload: true,
            autoloadCallback: () => {
                _db = db;
                _init(params.colls);
                _res_res(cmd_id, params.dbname);
            }
        });
    } else {
        _db = new loki('MEMORY', {
            autoload: false,
            autosave: false,
        });
        _init(params.colls);
        _res_res(cmd_id, 'MEMORY');
    }
}

function close(cmd_id) {
    if (_db) {
        _db.saveDatabase(() => {
                _db = null;
                _colls = {};
                _res_res(cmd_id, null)
            }
        )
    } else {
        _res_res(cmd_id, null)
    }
}

function destroy(cmd_id, params) {
    let db = new loki(params.dbname, {
        adapter: new LokiIndexedAdapter(),
        autosave: true,
        autoload: true,
        autoloadCallback: () => {
            db.deleteDatabase(() => {
                _res_res(cmd_id, params.dbname);
            });
        }
    });
}


self.addEventListener('message', (e) => {
    let id = e.data.id;
    let params = e.data.params;
    let res;
    try {
        switch (e.data.method) {
            case 'open':
                return open(id, params);
            case 'close':
                return close(id);
            case 'destroy':
                return destroy(id, params);

            case 'insert':
                res = _insert(params.coll, params.doc);
                break;
            case 'get':
                res = _get(params.coll, params.id);
                break;
            case 'update':
                res = _update(params.coll, params.doc);
                break;
            case 'find':
                res = _find(params.coll, params.filter, params.sort, params.is_desc, params.limit);
                break;
            case 'remove':
                res = _remove(params.coll, params.id);
                break;

            default:
                throw new Error(`无效命令"${e.data.method}"`);
        }
        _res_res(id, res);
    } catch (error) {
        _err_res(id, 'error', error.message);
    }
})