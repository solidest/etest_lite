
let _wins = new Set();

function add(win, proj_id) {
    _wins.add({win: win, proj_id: proj_id});
}

function del(win) {
    let keys = _wins.keys();
    for(let k of keys) {
        if(k.win === win) {
            _wins.delete(k);
            return;
        }
    }
    console.log('del fail');
}

function update(win, proj_id) {
    let keys = _wins.keys();
    for(let k of keys) {
        if(k.win === win) {
            k.proj_id = proj_id;
            return;
        }
    }
    console.log('udpate fail');
}

function find(proj_id) {
    let keys = _wins.keys();
    for(let k of keys) {
        if(k.proj_id === proj_id) {
            return k.win;
        }
    }
    return null;
}

function size() {
    return _wins.size;
}

export default { add, del, find, update, size }
