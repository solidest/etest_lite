import checker from '../helper/checker';
import segparser from '../../../sdk/core/parser/segParser';
import expparser from '../../../sdk/core/parser/expParser';

const KIND = 'protocol';


class Protocol {
    constructor(data, proj, name) {
        this.data = data;
        this.proj = proj;
        this.name = name;
    }
    get id() {
        return this.data.id;
    }

    _check_pid(ids) {
        if (!ids || ids.length < 1 || ids[0] !== 'this') {
            throw new Error('协议段引用错误');
        }

        if (!this.$children_names.includes(ids[1])) {
            throw new Error('协议段引用错误');
        }

    }

    _check_exp(exp) {
        if (!exp) {
            throw new Error('表达式为空');
        }
        if (exp.kind === 'pid') {
            this._check_pid(exp.list);
            return;
        }
        if (exp.left) {
            this._check_exp(exp.left);
        }
        if (exp.right) {
            this._check_exp(exp.right);
        }
    }

    _is_string(str) {
        try {
            let res = eval(str);
            if (typeof res === 'string') {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    _get_custom_parser(parser) {
        if (!parser || parser.length === 0) {
            throw new Error('表达式为空');
        }
        let res = {}
        parser.forEach(prop => {
            if (prop.kind !== 'prop' || prop.value.kind !== 'pid' || prop.value.list.length !== 1 || !['pack', 'unpack'].includes(prop.name)) {
                throw new Error('自定义解析设置错误');
            }
            if (prop.name === 'pack') {
                if (res.pack) {
                    throw new Error('重复设置打包函数');
                }
                res.pack = prop.value.list[0];
            } else if (prop.name === 'unpack') {
                if (res.unpack) {
                    throw new Error('重复设置解包函数');
                }
                res.unpack = prop.value.list[0];
            }
        });
        res.type = 'string';
        return res;
    }

    _check_get_oneof_names(oneof) {
        let res = [];
        oneof.items.forEach(br => {
            br.items.forEach(it => {
                if (it.kind === 'oneof') {
                    let sub_ns = this._check_get_oneof_names(it);
                    sub_ns.forEach(n => {
                        if(!res.includes(n)) {
                            res.push(n);
                        }
                    })
                } else {
                    if (!res.includes(it.name)) {
                        res.push(it.name);
                    }
                }
            });
        });
        return res;
    }

    _check_oneof_names(oneof) {
        if (!oneof || !oneof.items) {
            return false;
        }
        let res = true;
        oneof.items.forEach(br => {
            br.$children_names = this._get_check_names(br.items)
            if (!br.$children_names) {
                res = false;
            }
        });
        return res;
    }

    _get_check_names(items) {
        // console.log(items)
        if (!items) {
            return false;
        }
        let res = true;
        let names = [];
        for (let it of items) {
            if (it.kind === 'oneof') {
                if (this._check_oneof_names(it)) {
                    let ns = this._check_get_oneof_names(it);
                    ns.forEach(n => {
                        if (names.includes(n)) {
                            this.proj.pushError(`名称"${n}"重复`, KIND, this.id, it.id);
                            res = false;
                        } else {
                            names.push(n);
                        }
                    })
                } else {
                    res = false;
                }
                continue;
            }
            let msg = checker.valid_name(names, it.name);
            if (msg === 'ok') {
                it.name = it.name.trim();
                names.push(it.name);
            } else {
                res = false;
                this.proj.pushError(msg, KIND, this.id, it.id);
            }
            if (it.kind === 'segments') {
                it.$children_names = this._get_check_names(it.items);
                if (!it.$children_names) {
                    res = false;
                }
            }
        }
        return res ? names : null;
    }

    _check_autovalue(seg) {
        let av = '' + (seg.autovalue || '');
        if (!av || !av.trim()) {
            return;
        }
        try {
            seg.autovalue = expparser.parse(seg.autovalue);
            this._check_exp(seg.autovalue);
        } catch (error) {
            this.proj.pushError('自动赋值设置错误: ' + error.message, KIND, this.id, seg.id);
        }
    }

    _check_arrlen(seg) {
        let len = '' + (seg.arrlen || '');
        if (!len || !len.trim()) {
            return;
        }
        try {
            seg.arrlen = expparser.parse(seg.arrlen);
            this._check_exp(seg.arrlen);
        } catch (error) {
            this.proj.pushError('数组长度设置错误: ' + error.message, KIND, this.id, seg.id);
        }
    }

    check_segment(seg) {
        try {
            if (!seg.parser || !seg.parser.trim()) {
                throw new Error('缺少解析方式');
            }
            let p = seg.parser.trim();
            if (p.startsWith('{')) {
                seg.parser = expparser.parse(seg.parser);
                seg.parser = this._get_custom_parser(seg.parser);
            } else {
                seg.parser = segparser.parse(seg.parser);
                if(seg.parser && ['float', 'double'].includes(seg.parser.type)  && seg.parser.encode) {
                    throw new Error('编码设置无效');
                }
            }
        } catch (error) {
            this.proj.pushError('解析方式设置错误: ' + error.message, KIND, this.id, seg.id);
        }
        if (seg.parser && seg.parser.type === 'string') {
            if (seg.autovalue && seg.autovalue.trim()) {
                try {
                    seg.autovalue = expparser.parse(seg.autovalue);
                    if (seg.autovalue.kind !== 'string') {
                        this.proj.pushError('自动赋值必须设置为字符串', KIND, this.id, seg.id);
                    }
                } catch (error) {
                    this.proj.pushError('自动赋值设置错误: ' + error.message, KIND, this.id, seg.id);
                }
            }
        } else {
            this._check_autovalue(seg);
        }
        this._check_arrlen(seg);
        if (seg.parser && seg.parser.type === 'string' && !seg.parser.pack && !seg.parser.unpack) {
            if (seg.length) {
                try {
                    seg.length = expparser.parse(seg.length);
                    this._check_exp(seg.length);
                } catch (error) {
                    this.proj.pushError('字节长度设置错误: ' + error.message, KIND, this.id, seg.id);
                }
            }
            if (seg.endwith && seg.endwith.trim() && !this._is_string(seg.endwith)) {
                try {
                    seg.endwith = expparser.parse(seg.endwith);
                    if (seg.endwith.kind !== 'string') {
                        this.proj.pushError('结尾符必须设置为字符串', KIND, this.id, seg.id);
                    }
                } catch (error) {
                    this.proj.pushError('结尾符设置错误: ' + error.message, KIND, this.id, seg.id);
                }
            }
            if (!seg.length && !seg.endwith) {
                this.proj.pushError('string类型必须设置字节长度或结尾符', KIND, this.id, seg.id);
            }
        }
    }

    check_segments(segs) {
        this._check_autovalue(segs);
        this._check_arrlen(segs);
        if (segs.items) {
            segs.items.forEach(seg => this['check_' + seg.kind](seg));
        }
    }

    check_oneof(oneof) {
        if (!oneof.items) {
            return;
        }
        let idx = 0
        oneof.items.forEach(br => {
            try {
                idx++;
                br.condition = expparser.parse(br.condition);
                this._check_exp(br.condition);
            } catch (error) {
                this.proj.pushError('分支' + idx + '条件设置错误: ' + error.message, KIND, this.id, oneof.id);
            }
            if (br.items) {
                br.items.forEach(seg => this['check_' + seg.kind](seg));
            }
        });
    }


    check() {
        if (!this.data || !this.data.content || !this.data.content.items) {
            return;
        }
        let items = this.data.content.items;
        this.$children_names = this._get_check_names(items);

        items.forEach(seg => this['check_' + seg.kind](seg));
    }
}

export default Protocol;