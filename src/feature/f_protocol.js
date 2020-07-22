
import shortid from 'shortid';

function property_str(name, value) {
    if(value === null || value === undefined || value==='') {
        return '';
    }
    return `${name}: ${value}`;
}


function _get_value(fullname, obj) {
    let keys = fullname.split('.');
    let o = obj;
    let idx = 0;
    let last = keys.length - 1;
    while (o && (typeof o === 'object')) {
        if (idx === last) {
            return o[keys[last]];
        }
        o = o[keys[idx]];
        idx++;
    }
    return undefined;
}


function _get_pos(bitpos, is_end) {
    if(bitpos === 0) {
        return 'byte[0] bit[0]';
    }
    if(!bitpos) {
        return;
    }
    if(is_end) {
        bitpos--;
    }
    let byte = Math.floor(bitpos/8);
    let bit = bitpos%8;
    return `byte[${byte}] bit[${bit}]`
}

class OneofItem {
    constructor(data, parent, condition) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), kind: 'oneofitem', condition: condition||'', items: []};
        this.children = load(this.data.items, this);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get kind() {
        return this.data.kind;
    }
    get condition() {
        return this.data.condition;
    }
    set_condition(c) {
        this.data.condition = c;
    }
    full_name() {
        return this.parent.full_name();
    }
    last_index(draw_items) {
        if(this.children.length === 0) {
            return draw_items.findIndex(it => it === this.parent);
        } else {
            return this.children[this.children.length-1].last_index(draw_items);
        }
    }
    save_append(items) {
        let its = [];
        this.children.forEach(child => child.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.children.forEach(child => {
            child.draw_append(items, level, deep);
        })
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    insert_children(segs) {
        this.children.push(...segs);
    }
    load_msg(res, vmsg, detail) {
        this.children.forEach(ch => {
            ch.load_msg(res, vmsg, detail);
        })
    }
    eval_conditon(vmsg) {
        let reg = new RegExp(/\b(this\.)/,"g")
        let exp = this.condition.replace(reg,"self.");
        let sevl = 'let self = ' + JSON.stringify(vmsg) + ';' + exp;
        return eval(sevl);
    }
}

class Oneof{
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), kind: 'oneof', items: []};
        let self = this;
        let branchs = [];
        if(this.data.items) {
            this.data.items.forEach(it => {
                branchs.push(new OneofItem(it, self));
            });
        }
        this.children = branchs;
        this.data.sel_id = this.select(this.data.sel_id);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return '';
    }
    get kind() {
        return this.data.kind;
    }
    get memo() {
        return '';
    }
    get condition() {
        return this.selected ? this.selected.condition : '';
    }
    conditions() {
        let res = [];
        this.children.forEach(child => res.push({id: child.id, condition: child.condition, selected: child===this.selected}));
        return res;
    }
    full_name() {
        return this.parent.full_name();
    }
    select(id) {
        if(this.children.length === 0) {
            this.selected = null;
            return null;
        } else {
            let sel = this.children.find(it => it.id === id);
            this.selected = sel || this.children[0];
            return this.selected.id;
        }
    }
    to_code() {
        return JSON.stringify(this.data);
    }
    last_index(draw_items) {
        if(this.selected) {
            return this.selected.last_index(draw_items);
        }
        return draw_items.findIndex(it => it=== this);
    }
    save_append(items) {
        let its = [];
        this.children.forEach(ch => ch.save_append(its));
        this.data.items = its;
        this.data.sel_id = this.sel_id;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep + 1;
        items.push(this);
        if(this.selected) {
            this.selected.draw_append(items, level, this.deep);
        }
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    add_oneof_branchs(count) {
        for(let i=0; i<count; i++) {
            let br = new OneofItem(null, this);
            br.level = this.level;
            br.deep = this.deep;
            this.children.push(br);
        }
        this.select();
    }
    insert_children(segs) {
        this.selected.insert_children(segs);
    }
    udpate_conditions(items) {
        let chs = [];
        this.selected = null;
        items.forEach( e => {
            let ch = this.children.find(c => c.id === e.id);
            if(ch) {
                ch.set_condition(e.condition);
                chs.push(ch);
            } else {
                chs.push(new OneofItem(null, this, e.condition));
            }
            if(e.selected) {
                this.selected = chs[chs.length-1];
            }
        });
        this.children = chs;
        if(!this.selected && this.children.length>0) {
            this.selected = this.children[0];
        }
    }
    load_msg(res, vmsg, detail) {
        this.children.forEach(ch => {
            if(ch.eval_conditon(vmsg)) {
                ch.load_msg(res, vmsg, detail);
                return;
            }
        })
    }
    
}

class Segments {
    constructor(data, parent, name, arrlen) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', arrlen: arrlen, kind: 'segments', items: [], memo: '', autovalue: ''};
        this.children = load(this.data.items, this);
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get memo() {
        return this.data.memo;
    }
    get kind() {
        return this.data.kind;
    }
    get arrlen() {
        return this.data.arrlen;
    }
    get autovalue() {
        return this.data.autovalue;
    }
    get config() {
        return property_str('autovalue', this.data.autovalue);
    }
    full_name() {
        let pn = this.parent.full_name();
        return pn ? `${pn}.${this.name}` : this.name;
    }
    udpate_autovalue(av) {
        this.data.autovalue = av;
    }

    to_code() {
        return JSON.stringify(this.data);
    }
    last_index(draw_items) {
        if(this.children.length === 0) {
            return draw_items.findIndex(it => it=== this);
        } else {
            return this.children[this.children.length-1].last_index(draw_items);
        }
    }
    save_append(items) {
        let its = [];
        this.children.forEach(child => child.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
        this.children.forEach(child => {
            child.draw_append(items, level+1, deep);
        });
    }
    list_append(items) {
        items.push(this);
        this.children.forEach(child => {
            child.list_append(items);
        });
    }
    insert_children(segs) {
        this.children.push(...segs);
    }
    update_name_arrlen(name, memo, arrlen){
        this.data.name = name || '';
        this.data.memo = memo || '';
        this.data.arrlen = arrlen;
    }
    load_msg(res, vmsg, detail) {
        let fname = this.full_name();
        let pos = detail['this.' + fname] || {};
        let v = {
            name: fname,
            parser: '{ }',
            value: '',
            begin: _get_pos(pos.bit_begin_pos, false),
            end: _get_pos(pos.bit_end_pos, true),
            pos: pos,
        }
        res.push(v);
        this.children.forEach(ch => {
            ch.load_msg(res, vmsg, detail);
        })
    }
}

class Segment {
    constructor(data, parent, name, arrlen) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', kind: 'segment', arrlen: arrlen, memo: ''};
    }
    get id() {
        return this.data.id;
    }
    get name() {
        return this.data.name;
    }
    get arrlen() {
        return this.data.arrlen;
    }
    get memo() {
        return this.data.memo;
    }
    get kind() {
        return this.data.kind;
    }
    get parser() {
        return this.data.parser||'';
    }
    get autovalue() {
        return this.data.autovalue||'';
    }
    get length() {
        return this.data.length||'';
    }
    get endwith() {
        return this.data.endwith || '';
    }
    get config() {
        let p1 = property_str('autovalue', this.data.autovalue);
        let p2 = property_str('endwith', this.data.endwith);
        let p3 = property_str('length', this.data.length);
        let res = [];
        if(p1) {
            res.push(p1);
        }
        if(p2) {
            res.push(p2);
        }
        if(p3) {
            res.push(p3);
        }
        if(res.length===0) {
            return '';
        }
        return res.join(', ');
    }
    update_config(parser, autovalue, length, endwith) {
        this.data.parser = parser;
        this.data.autovalue = autovalue||'';
        this.data.endwith = endwith||'';
        this.data.length = length||'';
    }
    full_name() {
        let pn = this.parent.full_name();
        return pn ? `${pn}.${this.name}` : this.name;
    }
    to_code() {
        return JSON.stringify(this.data);
    }
    last_index(draw_items) {
        return draw_items.findIndex(it => it=== this);
    }
    save_append(items) {
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
    }
    update_name_arrlen(name, memo, arrlen){
        this.data.name = name || '';
        this.data.memo = memo || '';
        this.data.arrlen = arrlen;
    }

    load_msg(res, vmsg, detail) {
        let fname = this.full_name();
        let pos = detail['this.'+fname] || {};
        let v = {
            name: fname,
            parser: this.parser,
            value: _get_value(fname, vmsg),
            begin: _get_pos(pos.bit_begin_pos, false),
            end: _get_pos(pos.bit_end_pos, true),
            pos: pos,
        }
        res.push(v);
    }
}

class Frame {
    constructor() {
        this.children = [];
        this.draw_items = [];
    }

    full_name() {
        return null;
    }

    last_index(draw_items) {
        if(this.children.length===0) {
            return -1;
        } else {
            return this.children[this.children.length-1].last_index(draw_items);
        }
    }

    save() {
        let items = [];
        this.children.forEach(it => {
            it.save_append(items);
        });
        return items;
    }


    draw() {
        let items = [];
        this.children.forEach(it => {
            it.draw_append(items, 0, 0);
        });
        return items;
    }
}

function load(items, parent) {
    if(!items || items.length === 0) {
        return [];
    }
    let objs = [];
    if(!parent) {
        parent = new Frame(objs);        
    }

    items.forEach(it => {
        if(it.kind === 'segment') {
            objs.push(new Segment(it, parent));
        } else if(it.kind === 'segments') {
            objs.push(new Segments(it, parent));
        } else if(it.kind === 'oneof') {
            objs.push(new Oneof(it, parent));
        } else {
            console.log('TODO load', it);
        }
    });
    return objs;
}

function load_frm(items) {
    let frm = new Frame();
    frm.children = load(items, frm);
    frm.draw_items = frm.draw();
    return frm;
}

function insert_brother_(segs, frm, parent, seg, offset) {
    let data_idx //, draw_idx
    if(seg) {
        data_idx = parent.children.findIndex(it => it === seg) + offset;
    } else {
        if(offset===0) {
            data_idx = 0;
        } else {
            data_idx = parent.children.length;    
        }
    }
    parent.children.splice(data_idx, 0, ...segs);
}

function insert(frm, seg, info, offset) {
    let kind = info.type;
    let count = info.count || 1;
    let name = info.name || '';
    let arrlen = info.arrlen;
    if(count<1) {
        count = 1;
    } else {
        if(count>20) {
            count = 20;
        }
    }
    let parent = seg ? seg.parent : frm;
    let segs = [];
    if(kind === 'oneof') {
        let nseg = new Oneof(null, offset===-1 ? seg : parent);
        nseg.add_oneof_branchs(count);
        segs.push(nseg);
    } else {
        for(let i=0; i<count; i++) {
            let nseg = null;
            let n = name;
            if(count>1) {
                n = name + (i+1);
            }
            let p = offset===-1 ? seg : parent;
            if(kind === 'segment') {
                nseg = new Segment(null, p, n, arrlen);
                nseg.update_config(info.parser);
            } else if(kind === 'segments') {
                nseg = new Segments(null, p, n, arrlen);
            }
            if(!nseg){
                console.log('TODO new type', kind);
            } else {
                segs.push(nseg);
            }
        }        
    }

    if(segs.length === 0) {
        return null;
    }

    let level = seg ? seg.level : 0;
    let deep = seg ? seg.deep : 0;
    if(seg && seg.kind === 'segments' && offset===-1) {
        level++;
    }
    if(seg && seg.kind === 'oneof' && offset!==-1) {
        deep--;
    }
    if(kind==='oneof') {
        deep++;
    }
    segs.forEach(s => {
        s.level = level;
        s.deep = deep;
    })

    if(offset===-1) {
        if(seg.kind!=='segments' && seg.kind!=='oneof') {
            console.error('ERROR1', seg.kind);
            return null;
        }
        seg.insert_children(segs);
    } else {
        insert_brother_(segs, frm, parent, seg, offset);
    }
    frm.draw_items = frm.draw();
    if(frm.draw_items.findIndex(it => it.id === segs[0].id)<0) {
        console.error('ERROR2 insert');
        return null;
    }
    return segs;
}

function remove(frm, seg) {
    let items = [];
    seg.draw_append(items, seg.level, seg.deep);
    let index = seg.parent.children.findIndex(it => it === seg);
    seg.parent.children.splice(index, 1);
    items.forEach(item => {
        let idx = frm.draw_items.findIndex(it => it === item);
        if(idx>=0) {
            frm.draw_items.splice(idx, 1);
        }
    })
}

function moveup(frm, seg) {
    let index = seg.parent.children.findIndex(it => it === seg);
    if(index===0) {
        return false;
    }

    let up_seg = seg.parent.children[index-1];
    let items = [];
    seg.draw_append(items, seg.level, seg.deep-(seg.kind==='oneof'?1:0));

    seg.parent.children.splice(index, 1);
    seg.parent.children.splice(index-1, 0, seg);
    items.forEach(item => {
        let idx = frm.draw_items.findIndex(it => it === item);
        if(idx>=0) {
            frm.draw_items.splice(idx, 1);
        }
    })
    let draw_idx = frm.draw_items.findIndex(it => it === up_seg);
    frm.draw_items.splice(draw_idx, 0, ...items);
    return true;
}

function movedown(frm, seg) {
    let index = seg.parent.children.findIndex(it => it === seg);
    if(index===seg.parent.children.length-1) {
        return false;
    }
    let down_seg = seg.parent.children[index+1];
    let items = [];
    seg.draw_append(items, seg.level, seg.deep-(seg.kind==='oneof'?1:0));

    seg.parent.children.splice(index, 1);
    seg.parent.children.splice(index+1, 0, seg);
    items.forEach(item => {
        let idx = frm.draw_items.findIndex(it => it === item);
        if(idx>=0) {
            frm.draw_items.splice(idx, 1);
        }
    })
    let draw_idx = down_seg.last_index(frm.draw_items)+1;
    frm.draw_items.splice(draw_idx, 0, ...items);
    return true;
}

function copy(seg) {
    let res = [];
    seg.save_append(res);
    return res;
}

function _update_id(items) {
    if(!items) {
        return;
    }
    for(let it of items) {
        it.id = shortid.generate();
        _update_id(it.items);
    }
}

function paste(frm, seg, its) {
    _update_id(its);
    let p = seg ? seg.parent : frm;
    let obj = load(its, p)[0];
    let deep = seg ? seg.deep : 0;
    let level = seg ? seg.level : 0;
    let data_idx = seg ? p.children.findIndex(it=>it===seg)+1 : p.children.length;
    let draw_idx = seg? seg.last_index(frm.draw_items)+1 : p.last_index(frm.draw_items)+1;
    let draw_its = [];
    if(seg && seg.kind==='oneof') {
        deep--;
    }

    p.children.splice(data_idx, 0, obj);
    obj.draw_append(draw_its, level, deep);
    frm.draw_items.splice(draw_idx, 0, ...draw_its);
    return draw_its[0];
}

function udpate_conditions(frm, oneof_id, conditions) {
    let seg = frm.draw_items.find(it => it.id === oneof_id);
    seg.udpate_conditions(conditions);
    frm.draw_items = frm.draw();
}


function load_msg(items, msg, detail) {
    if(!items || !msg || !detail) {
        return [];
    }
    let res = [];
    let frm = load_frm(items);
    frm.children.forEach(ch =>{
        ch.load_msg(res, msg, detail);
    })
    return res;
}

export default { load_msg, load_frm, insert, remove, moveup, movedown, copy, paste, udpate_conditions }
