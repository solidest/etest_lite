/**
 * 执行输出信息解析模块
 */

const print = require('./print');
const reply_ask = require('./reply_ask');

//读取执行输出 返回是否应该退出的布尔值
function parse_out(res, auto_reply) {
    if (!res) {
        return;
    }

    for (let r of res) {
        if (r.catalog === 'system') {
            switch (r.kind) {
                case 'start':
                    print.sys_recved(' ', '::start:: ' + r.value);
                    break;

                case 'entry':
                    print.sys_recved(' ', '::entry:: ' + r.value);
                    console.log('')
                    break;

                case 'exit':
                    console.log('')
                    print.sys_recved(' ', '::exit:: ' + r.value);
                    break;

                case 'stop': {
                    print.sys_recved(' ', `::stop:: ${r.value} (${Math.round(r.time/1000000000)}s)\n`)
                    return true;
                }

                case 'print': {
                    print.usr_print(r.value);
                    break;
                }

                case 'verifyFail': 
                    print.sys_error(r.value, ' ');
                    break;

                case 'assertFail':
                    print.sys_error(r.value, ' ');
                    return true;
                    
                case 'error': {
                    //console.log('xxxxxxxxxxxxxxxxx')
                    print.sys_error(r.value, ' ');
                    break;
                }

                default:
                    print.sys_recved('?', typeof r == 'object' ? JSON.stringify(r) : r);
                    break;
            }
        } else if (r.catalog === 'log') {
            print.usr_log(r.kind, r.value);
        } else if (r.catalog === 'ask') {
            reply_ask(r, auto_reply);
        } else {
            if(r.catalog!=="record") {
                print.sys_recved('?', r);
            }
        }
    }

    return false;

}

module.exports = parse_out;