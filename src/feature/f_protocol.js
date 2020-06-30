
import shortid from 'shortid';
import { set } from 'core-js/fn/dict';

class OneofItem {
    constructor(data, parent, condition) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), kind: 'oneofitem', condition: condition||'', items: []};
        this.children = load_objs(this.data.items, this);
    }
    save_append(items) {
        this.data.items = save_objs(this.children);
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.children.forEach(child => {
            child.draw_append(items, level, deep);
        })
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
        if(branchs.length>0) {
            this.selected = branchs[0];
        }
    }
    save_append(items) {
        let its = [];
        this.children.forEach(ch => ch.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
        if(this.selected) {
            this.selected.draw_append(items, level, deep+1);
        }
    }
}

class Segments {
    constructor(data, parent, name) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', kind: 'segments', items: []};
        this.children = load_objs(this.data.items, this);
    }
    save_append(items) {
        this.data.items = save_objs(this.children);
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
        this.children.forEach(child => {
            child.draw_append(items, level+1, deep);
        })
    }
}

class Segment {
    constructor(data, parent, name) {
        this.parent = parent;
        this.data = data || {id: shortid.generate(), name: name||'', kind: 'segment'};
    }
    save_append(items) {
        items.push(this.data);
    }
    draw_append(items, level, deep) {
        this.level = level;
        this.deep = deep;
        items.push(this);
    }
    insert(seg) {

    }
}

class Frame {
    constructor(children) {
        this.children = children;
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

function load(items) {
    if(!items || items.length === 0) {
        return [];
    }
    let objs = [];
    let frm = new Frame(objs);
    items.forEach(it => {
        if(it.kind === 'segment') {
            objs.push(new Segment(it, frm));
        } else if(it.kind === 'segments') {
            objs.push(new Segments(it, frm));
        } else if(it.kind === 'oneof') {
            objs.push(new Oneof(it, frm));
        }
    });
    return frm;
}

function insert_before(seg, kind, name, count) {
    count = count || 1;
    if(count<1) {
        count = 1;
    } else {
        if(count>20) {
            count = 20;
        }
    }
    let segs = [];
    for(let i=0; i<count; i++) {
        let n = name || '';
        if(count>1) {
            n = (name||'') + (i+1);
        }
        if(kind === 'segment') {
            segs.push(new Segment(null, seg.parent, n));
        }        
    }

}

export default { load,  }
