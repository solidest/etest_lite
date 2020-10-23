
let worker = new Worker('./worker.js', {
    type: 'module'
});

let _id = 0;
let _evs = [];

function sub_res(id, cb) {
    _evs.push({id, cb});
}

worker.onmessage = function(e) {
    if(e.data.result!=='ok') {
        console.error('bad result', e.data);
        return;
    }
    let idx = _evs.findIndex(it => it.id === e.data.id);
    if(idx<0) {
        console.error('bad msg');
        return;
    }
    let cb = _evs[idx].cb;
    _evs.splice(idx, 1);
    return cb(e.data.value);
}

async function open(dbname, colls) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'open', params: {dbname, colls}});
        sub_res(id, resolve);
    });
}

async function close() {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'close'});
        sub_res(id, resolve);
    });
}

async function destroy(dbname) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'destroy', params: {dbname}});
        sub_res(id, resolve);
    });
}

async function insert(coll, doc) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'insert', params: {coll, doc}});
        sub_res(id, resolve);
    });
}

async function get(coll, doc_id) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'get', params: {coll, id: doc_id}});
        sub_res(id, resolve);
    });
}

async function update(coll, doc) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'update', params: {coll, doc}});
        sub_res(id, resolve);
    });
}

async function find(coll, filter, sort, is_desc, limit) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'find', params: {coll, filter, sort, is_desc, limit}});
        sub_res(id, resolve);
    });
}

async function remove(coll, doc_id) {
    return new Promise(resolve => {
        let id = _id++;
        worker.postMessage({id, method:'remove', params: {coll, id: doc_id}});
        sub_res(id, resolve);
    });
}

export default {
    open,
    close,
    destroy,
    insert,
    get,
    update,
    find,
    remove,
};