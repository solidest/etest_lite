
const bins_dict = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'a': '1010',
    'b': '1011',
    'c': '1100',
    'd': '1101',
    'e': '1110',
    'f': '1111',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
};

const hexs_dict = {
    '0000': '0',
    '0001': '1',
    '0010': '2',
    '0011': '3',
    '0100': '4',
    '0101': '5',
    '0110': '6',
    '0111': '7',
    '1000': '8',
    '1001': '9',
    '1010': 'A',
    '1011': 'B',
    '1100': 'C',
    '1101': 'D',
    '1110': 'E',
    '1111': 'F'
};

function valid_hex(str) {
    if(!str) {
        return false;
    }
    let reg = new RegExp(/[0-9a-fA-F\s\r\n]/);
    let reg_v = new RegExp(/[0-9a-fA-F]/);
    let count = 0;
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(!reg.test(c)) {
            return false;
        }
        if(reg_v.test(c)) {
            count++;
        }
    }
    return count>0 && count%2===0;
}

function format_hex(str) {
    let res = [];
    let r = '';
    let reg_v = new RegExp(/[0-9a-fA-F]/);
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(reg_v.test(c)) {
            if(r) {
                res.push((r+c).toUpperCase());
                r = '';
            } else {
                r = c;
            }
        }
    }
    return res.join('\n');
}

function hex2bin(str) {
    let res = [];
    let r = '';
    let reg_v = new RegExp(/[0-9a-fA-F]/);
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(reg_v.test(c)) {
            if(!r) {
                r = bins_dict[c];
            } else {
                res.push(r +' ' + bins_dict[c]);
                r = '';
            }
        }
    }
    return res.join('\n');
}

function valid_bin(str) {
    if(!str) {
        return false;
    }
    let reg = new RegExp(/[01\s\r\n]/);
    let reg_v = new RegExp(/[01]/);
    let count = 0;
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(!reg.test(c)) {
            return false;
        }
        if(reg_v.test(c)) {
            count++;
        }
    }
    return count>0 && count%8===0;
}

function format_bin(str) {
    let res = [];
    let r = '';
    let reg_v = new RegExp(/[01]/);
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(reg_v.test(c)) {
            if(r.length<8) {
                if(r.length===4) {
                    r += ' ';
                }
                r+=c;
            } else {
                res.push(r+c);
                r = '';
            }
        }
    }
    return res.join('\n');
}

function bin2hex(str) {
    let res = [];
    let r = '';
    let reg_v = new RegExp(/[01]/);
    let len = str.length;
    for (let index = 0; index < len; index++) {
        const c = str.charAt(index);
        if(reg_v.test(c)) {
            if(r.length<3) {
                r+=c;
            } else {
                res.push(hexs_dict[r+c]);
                r = '';
            }
        }
    }
    return format_hex(res.join(''));
}

export default {valid_hex, format_hex, hex2bin, valid_bin, format_bin, bin2hex}
