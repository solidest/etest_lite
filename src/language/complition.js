import * as monaco from 'monaco-editor';

const keywords = ['protocol', 'device', 'record', 'entry', 'print',
    'exit', 'assert', 'verify', 'delay', 'now', 'error', 'message', 'pack',
    'unpack', 'send', 'recv', 'ioctl', 'write', 'read', 'nameof', 'ask',
    'insert', 'async', 'log', 'string', 'math', 'table', 'utf8'
]

const sub_api = {
    'async': [
        ['timeout', '(tout, fn, ...)'],
        ['interval', '(delay, intv, fn, ...)'],
        ['clear', '(id)'],
        ['send', '(conn, msg, option, fn)'],
        ['recv', '(conn, nil|p, tout, fn)'],
        ['ioctl', '(conn, cmd, opt, fn )'],
        ['on_recv', '(conn, nil|p, fn)'],
        ['off_recv', '(conn)'],
        ['on', '(event, fn)'],
        ['off', '(event)'],
        ['emit', '(event, udata)'],
    ],
    'log': [
        ['info', '(string)'],
        ['warn', '(string)'],
        ['error', '(string)'],
        ['step', '(string)'],
        ['action', '(string)'],
        ['doing', '(string)'],
        ['check', '(string)'],
    ],
    'string': [
        ['buff2hex', 'buff'],
        ['hex2buff', 'hex2string'],
        ['arr2buff', 'table'],
        ['byte', '(string[, start_index[, end_start]])'],
        ['char', '(...)'],
        ['dump', '(fn, boolean)'],
        ['find', '(string, substring, [init, [end]])'],
        ['format', '(...)'],
        ['gmatch', '(s, pattern)'],
        ['gsub', '(mainString,findString,replaceString,num)'],
        ['len', '(string)'],
        ['match', '(str, pattern[, init])'],
        ['rep', '(string, n[, sep])'],
        ['reverse', '(string)'],
        ['sub', '(string, start[, end])'],
        ['lower', '(string)'],
        ['upper', '(string)'],
        ['pack', '(check, pattern)'],
        ['unpack', '(check, pattern)'],
        ['packsize', '(check, pattern)'],

    ],
    'math': [
        ['abs', '(number)'],
        ['acos', '(number)'],
        ['asin', '(number)'],
        ['atan', '(number)'],
        ['ceil', '(number)'],
        ['cos', '(number)'],
        ['deg', '(number)'],
        ['exp', '(number)'],
        ['floor', '(number)'],
        ['fmod', '(number1, number2)'],
        ['huge', ''],
        ['log', '(number)'],
        ['max', '(...)'],
        ['maxinteger', ''],
        ['min', '(number)'],
        ['mininteger', ''],
        ['pi', ''],
        ['rad', '(number)'],
        ['random', '([number1[, number2]])'],
        ['sin', '(number)'],
        ['sqrt', '(number)'],
        ['tan', '(number)'],
        ['tointeger', '(patter)'],
        ['type', '(patter)'],
        ['ult', '(number1, number2)'],
        ['iseaqual', '(number1, number1[, is_double])'],
    ],
    'table': [
        ['concat', '(list [, sep [, i [, j]]])'],
        ['insert', '(list, [pos,] value)'],
        ['move', '(list1, index_start, index_end, list2_index [,list2])'],
        ['pack', '(...)'],
        ['remove', 'remove (list [, pos])'],
        ['sort', '(list [, comp])'],
        ['unpack', '(list [, i [, j]])'],
    ],
    'utf8': [
        ['char', '(...)'],
        ['charpattern', ''],
        ['codes', '(s)'],
        ['codepoint', '(s [, i [, j]])'],
        ['len', '(s [, i [, j]])'],
        ['offset', '(s, n [, i])']
    ]
}
let protocol = [];
let device = {};
let record = {};
let vars = {};

function get_text_suggestions(keys, result) {
    if (keys.length === 1) {
        keywords.forEach(key => {
            if (key.indexOf(keys[0]) === 0) {
                result.push({
                    label: key,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: key,
                });
            }
        })
    } else if (keys.length === 2) {
        let key = keys.find(k => k === keys[0]);
        if (key && sub_api[key]) {
            sub_api[key].forEach(sub => {
                if (sub[0].indexOf(keys[1]) === 0) {
                    result.push({
                        label: sub[0],
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: sub[0],
                        detail: sub[1],
                    })
                }
            })
        }
    }
}

function get_connor_suggestions(dev, result) {
    let conns = device[dev]
    if (!conns) {
        return;
    }
    conns.forEach(conn => {
        result.push({
            label: conn,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: conn
        });
    })
}

function get_device_suggestions(result) {
    for (let dev in device) {
        result.push({
            label: dev,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: dev
        });
    }
}

function get_protocol_suggestions(result) {
    protocol.forEach(prot => {
        result.push({
            label: prot,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: prot
        });
    })
}

function get_obj_suggestions(o, keys, result) {
    for(let i=1; i<keys.length; i++) {
        o = o[keys[i]];
        if(typeof o !== 'object') {
            return;
        }
    }
    for(let k in o) {
        result.push({
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            detail: JSON.stringify(o[k]),
        });
    }
}


function get_sub_suggestions(keys, result) {
    let len = keys.length;
    if (len === 0) {
        return;
    }
    if (!keys[keys.length - 1]) {
        keys.pop();
    }
    let k = keys[0];
    switch (k) {
        case 'record':
            return get_obj_suggestions(record, keys, result);
        case 'vars':
            return get_obj_suggestions(vars, keys, result);
        case 'device': {
            if(len>3) {
                return;
            }
            if(len>2) {
                return get_connor_suggestions(keys[1], result);
            }
            return get_device_suggestions(result);
        }
        case 'protocol':
            return get_protocol_suggestions(result);
 
    
        default: {
            let subs = sub_api[k];
            if (!subs) {
                return;
            }
            subs.forEach(sub => {
                result.push({
                    label: sub[0],
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: sub[0],
                    detail: sub[1],
                })
            });
            return;
        }
    }
}

function set_env(devs, prots, rcd, vs) {
    device = devs;
    protocol = prots;
    record = rcd;
    vars = vs;
} 

const provider = {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
        // get editor content before the pointer
        let textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
        let match = textUntilPosition.match(/([a-zA-Z\d_\\.]+)$/);
        if (!match) return [];
        let keys = match[0].split('.');
        let suggestions = [];

        if (textUntilPosition.charAt(textUntilPosition.length - 1) == '.') {
            get_sub_suggestions(keys, suggestions);
        } else {
            get_text_suggestions(keys, suggestions);
        }
        return {
            suggestions
        };
    }
}

export default {
    provider,
    set_env,
};