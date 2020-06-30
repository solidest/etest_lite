


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

function valid_name(items, n) {
    if(!check_name(n)) {
        return `名称"${n}"无效`;
    }
    n = n.trim();
    let res = 'ok';
    if(!items) {
        return res;
    }
    for(let it of items) {
        if(it.name === n) {
            res = '名称重复';
            break;
        }
    }
    return res;
}

function date_fmt(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }

    return fmt;
}

function obj_fmt(obj) {
    if(!obj) {
        return '';
    }
    let res = [];
    for(let it in obj) {
        let v = isNaN(obj[it]) ? `'${obj[it]}'` : obj[it]
        res.push(it + ': ' + v);
    }
    return res.join(', ');
}

export default {date_fmt, valid_name, check_name, obj_fmt }
