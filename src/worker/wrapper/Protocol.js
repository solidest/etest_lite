import checker from '../helper/checker';
import segparser from '../helper/segParser';
import expparser from '../helper/expParser';

const KIND = 'protocol';


class Protocol {
    constructor(data, proj) {
        this.data = data;
        this.proj = proj;
    }
    get id() {
        return this.data.id;
    }

    _check_get_oneof_names(oneof) {
        let res = [];
        oneof.items.forEach(br => {
            br.items.forEach(it => {
                if(it.kind === 'oneof') {
                    res.push(...this._check_get_oneof_names(it));
                } else {
                    if(!res.includes(it.name)) {
                        res.push(it.name);
                    }
                }
            });
        });
        return res;
    }

    _check_oneof_names(oneof) {
        if(!oneof || !oneof.items) {
            return false;
        }
        let res = true;
        oneof.items.forEach(br => {
            if(!this._check_names(br.items)) {
                res = false;
            }
        });
        return res;
    }

    _check_names(items) {
        // console.log(items)
        if(!items) {
            return false;
        }
        let res = true;
        let names = [];
        for(let it of items) {
            if(it.kind === 'oneof') {
                if(this._check_oneof_names(it)) {
                    let ns = this._check_get_oneof_names(it);
                    ns.forEach(n => {
                        if(names.includes(n)) {
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
            if(msg === 'ok') {
                it.name = it.name.trim();
                names.push(it.name);
            } else {
                res = false;
                this.proj.pushError(msg, KIND, this.id, it.id);
            }
            if(it.kind === 'segments') {
                if(!this._check_names(it.items)) {
                    res = false;
                }
            }
        }
        return res;
    }

    _check_autovalue(seg) {
        let av = '' + (seg.autovalue||'');
        if(!av || !av.trim()) {
            return;
        }
        try{
            expparser.parse(seg.autovalue);
        } catch (error) {
            this.proj.pushError('自动赋值设置错误', KIND, this.id, seg.id);
        }
    }

    _check_arrlen(seg) {
        let len = '' + (seg.arrlen||'');
        if(!len || !len.trim()) {
            return;
        }
        try{
            expparser.parse(seg.arrlen);
        } catch (error) {
            this.proj.pushError('数组长度设置错误', KIND, this.id, seg.id);
        }
    }

    check_segment(seg) {
        try {
            segparser.parse(seg.parser);
        } catch (error) {
            this.proj.pushError('解析方式设置错误', KIND, this.id, seg.id);
        }
        this._check_autovalue(seg);
        this._check_arrlen(seg);
        if(seg.parser && seg.parser.indexOf('string') >= 0) {
            if(seg.length) {
                try {
                    expparser.parse(seg.length);
                } catch (error) {
                    this.proj.pushError('字节长度设置错误', KIND, this.id, seg.id);
                }
            }
            if(seg.endwith) {
                try {
                    let res = eval(seg.endwith);
                    if(typeof res !== 'string') {
                        throw new Error();
                    }
                } catch (error) {
                    this.proj.pushError('结尾符设置错误', KIND, this.id, seg.id);
                }
            }
            if(!seg.length && !seg.endwith) {
                this.proj.pushError('string类型必须设置字节长度或结尾符', KIND, this.id, seg.id);
            }
        }
    }

    check_segments(segs) {
        this._check_autovalue(segs);
        this._check_arrlen(segs);
        if(segs.items) {
            segs.items.forEach(seg => this['check_' + seg.kind](seg));
        }
    }

    check_oneof(oneof) {
        if(!oneof.items) {
            return;
        }
        let idx = 1
        oneof.items.forEach(br => {
            try{
                expparser.parse(br.condition);
                idx++;
            } catch (error) {
                this.proj.pushError('分支' + idx +'条件设置错误', KIND, this.id, oneof.id);
            }
            if(br.items) {
                br.items.forEach(seg => this['check_' + seg.kind](seg));
            }
        });
    }

    check() {
        if(!this.data || !this.data.content || !this.data.content.items) {
            return;
        }
        let items = this.data.content.items;
        this._check_names(items);
        items.forEach(seg => this['check_' + seg.kind](seg));
    }
}

export default Protocol;