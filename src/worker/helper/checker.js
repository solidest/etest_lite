

function check_name(n) {
    if(!n) {
        return false;
    }
    n = n.trim();
    if(!n) {
        return false;
    }
    let reg = /^[\u4e00-\u9fa5a-zA-Z_][\u4e00-\u9fa5a-zA-Z\d_]*$/;    
    return reg.test(n);
}

function valid_name(names, n) {
    if(!check_name(n)) {
        return `名称"${n}"无效`;
    }
    n = n.trim();
    let res = 'ok';
    if(!names) {
        return res;
    }
    for(let it of names) {
        if(it === n) {
            res = '名称重复';
            break;
        }
    }
    return res;
}

export default { check_name, valid_name }