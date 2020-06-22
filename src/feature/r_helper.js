
import ipc from './r_ipc';
import shortid from 'shortid'

async function check_proj_newname(name) {
    name = (name ? name : '').trim();
    if(!name) {
        return '名称不能为空';
    }
    let projs = await ipc.list_proj();
    if(!projs) {
        return 'ok';
    }
    for(let p of projs) {
        if(p.name === name) {
            return '名称重复';
        }
    }
    return 'ok';
}

function new_id() {
    return shortid.generate();
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

export default { check_proj_newname, new_id, date_fmt }
