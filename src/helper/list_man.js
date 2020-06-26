
function insertBefore(items, at_item, news) {
    let idx = 0;
    if(at_item) {
        idx = items.findIndex(it => it === at_item);
    }
    items.splice(idx, 0, ...news);
    return idx;
}

function insertAfter(items, at_item, news) {
    let idx = items.length;
    if(at_item) {
        idx = items.findIndex(it => it === at_item) + 1;
    }
    items.splice(idx, 0, ...news);
    return idx;
}

function moveUp(items, item) {
    if(!item) {
        return false;
    }
    let idx = items.findIndex(it => it===item);
    if(idx===0) {
        return false;
    }
    items.splice(idx, 1);
    items.splice(idx-1, 0, item);
    return true;
}

function moveDown(items, item) {
    if(!item) {
        return false;
    }
    let idx = items.findIndex(it => it===item);
    if(idx===items.length-1) {
        return false;
    }
    items.splice(idx, 1);
    items.splice(idx+1, 0, item);
    return true;
}

function removeItem(items, item) {
    if(!item) {
        return false;
    }
    let idx = items.findIndex(it => it===item);
    items.splice(idx, 1);
    return true;
}
export default { insertBefore, insertAfter, moveUp, moveDown, removeItem }