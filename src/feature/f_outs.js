
function parse_kind(item) {
    let res = {};
    if(item.kind ==='debug') {
        res.is_debug = true;
    } else if(item.catalog === 'record') {
        res.is_success = true;
        res.is_system = true;
    } if(item.catalog === 'log') {
        res.is_log = true;
        if(item.kind === 'check') {
            if(item.value.result) {
                res.is_success = true;
            } else {
                res.is_error = true;
            }
        } else if(item.kind === 'warn') {
            res.is_warn = true;
        } else if (item.kind === 'error') {
            res.is_error = true;
        } else {
            res.is_log_normal = true;
        }
    } else {
        if (['error','assertFail','verifyFail'].includes(item.kind) ) {
            res.is_error = true;
        }
        if(item.catalog==='system' && !['print'].includes(item.kind)) {
            res.is_system = true;
        }
    }
    return res;
}

function _parse_system(item) {
    switch (item.kind) {
        case 'debug':
            return item.value.message;
        case 'start':
            return '执行器启动成功';
        case 'entry':
            return '调用入口函数成功';
        case 'exit':
            return '用例执行完成';
        case 'stop':
            return '执行记录已保存';
        case 'print':
            return item.value.message;
        case 'error':
            return item.value.message;
        case 'assertFail':
            return '断言失败 ' + item.value.message;
        case 'verifyFail':
            return '验证失败 ' + item.value.message;
        default:
            return JSON.stringify(item);
    }
}

function _parse_log(item) {
    switch (item.kind) {
        case 'info':
            return '日志::信息  ' + item.value.message;
        case 'error':
            return '日志::错误  ' + item.value.message;
        case 'warn':
            return '日志::警告  ' + item.value.message;
        case 'step':
            return '日志::步骤  ' + item.value.message;
        case 'action':
            return '日志::动作  ' + item.value.message;
        case 'doing':
            return '日志::正在进行  ' + item.value.message;
        case 'check':
            return (item.value.result ? '日志::检查成功  ':'日志::检查失败  ') + item.value.message;
        default:
            return JSON.stringify(item);
    }
}

function parse_text (item) {
    if(item.catalog === 'system') {
        return _parse_system(item);
    } else if(item.catalog === 'record') {
        return `record: ${JSON.stringify(item.value)}`;
    } else if(item.catalog === 'log') {
        return _parse_log(item);
    }
    return JSON.stringify(item);
}


function rcds_tip(items) {
    if(!items) {
        return;
    }
    if(items.length<10) {
        return items.map(item => JSON.stringify(item)).join('\n'); 
    }
    let res = [];
    for(let i=0; i<5; i++) {
        res.push(JSON.stringify(items[i]));
    }
    res.push('...  ...');
    for(let i=items.length-5; i<items.length; i++) {
        res.push(JSON.stringify(items[i]));
    }
    return res.join('\n');
}

export default {
    parse_text,
    parse_kind,
    rcds_tip,
};