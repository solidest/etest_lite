
//查找父级数组
function findParent(items, id) {
    if(!items) {
        return null;
    }
    for(let it of items) {
        if(it.id===id) {
            return items;
        }
    }

    for(let it of items) {
        if(it.kind === 'dir') {
            let res = findParent(it.children, id);
            if(res) {
                return res;
            }
        }
    }

    return null;
}

// //查找父节点
// function findParentItem(parent, id) {
//     if(!parent || !parent.children) {
//         return null;
//     }
//     for(let it of parent.children) {
//         if(it.id===id) {
//             return parent;
//         }
//     }

//     for(let it of parent.children) {
//         if(it.is_dir) {
//             let res = findParentItem(it, id);
//             if(res) {
//                 return res;
//             }
//         }
//     }

//     return null;
// }

function findPos(items, is_dir, name) {
    let idx = 0;
    if(is_dir) {
        for(let it of items) {
            if((it.kind!=='dir') ||((it.kind==='dir') && it.name>name)){
                return idx;
            }
            idx++;
        }        
    } else {
        for(let it of items) {
            if((it.kind!=='dir') && it.name>name) {
                return idx;
            }
            idx++;
        }
    }
    return idx;
}

function insert(items, item) {
    let pos = findPos(items, item.kind==='dir', item.name);
    items.splice(pos, 0, item);
}

function remove(items, id) {
    let children = findParent(items, id);
    let idx = children.findIndex(it=>it.id===id);
    children.splice(idx, 1);
}

function findItem(items, id) {
    if(!items) {
        return null;
    }

    for(let it of items) {
        if(it.id===id) {
            return it;
        }
        if(it.kind === 'dir') {
            let f = findItem(it.children, id);
            if(f) {
                return f;
            }
        }
    }
}

function rename(items, item_id, name) {
    let children = findParent(items, item_id);
    let idx = children.findIndex(it=>it.id===item_id);
    let item = children[idx];
    children.splice(idx, 1);
    item.name = name;
    insert(children, item);
}

// //验证名称是否有效
// function validName(children, name, type, is_dir, exclude_id) {
//     if(!name) {
//         return '名称无效';
//     }
    
//     for(let it of children) {
//         if(it.id===exclude_id) {
//             continue;
//         }
//         if(it.name === name && it.type === type && it.is_dir===is_dir) {
//             return '名称重复';
//         }
//     }

//     return 'ok';
// }

function getLeafs(item, results) {
    if(item.kind==='dir') {
        for(let it of item.children) {
            getLeafs(it, results);
        }
    } else {
        results.push(item);
    }
}

// //获取某种类型文件的列表
// function getFileList(prepath, children, type, results) {
//     if(!children) {
//         return;
//     }
//     for(let fd of children) {
//         if(fd.is_dir) {
//             let subp = prepath + fd.name + '/';
//             getFileList(subp, fd.children, type, results);
//         } else if(fd.type===type) {
//             let fpath = prepath + fd.name;
//             fd.fullpath = fpath;
//             results.push(fd);
//         }
//     }
// }

// //获取某种类型文件夹的列表
// function getDirList(prepath, children, type, results, self) {
//     if(!children) {
//         return;
//     }
//     for(let fd of children) {
//         if(fd.id===self.id) {
//             continue;
//         }
//         if(fd.is_dir && fd.catalog===type) {
//             let subp = prepath + fd.name + '/';
//             fd.fullpath = subp;
//             results.push(fd);
//             getDirList(subp, fd.children, type, results, self);
//         }
//     }
// }


// //获取某个文件的全路径
// function getFullName(children, id, pre) {
//     if(!children) {
//         return null;
//     }
//     for(let fd of children) {
//         if(fd.is_dir) {
//             let fn = getFullName(fd.children, id, pre+fd.name+'/')
//             if(fn) {
//                 return fn;
//             }
//         } else if(fd.id===id) {
//             return pre+fd.name;
//         }
//     }
// }

export default { findItem, findParent, insert, rename, remove, getLeafs }