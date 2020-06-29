

class OneofItem {
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {kind: 'OneofItem', condition: '', items: []};
        this.children = load_objs(this.data.items, this);
    }
    save_append(items) {
        this.data.items = save_objs(this.children);
        items.push(this.data);
    }
}

class Oneof{
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {kind: 'oneof', items: []};
        let self = this;
        let branchs = [];
        if(this.data.items) {
            this.data.items.forEach(it => {
                branchs.push(new OneofItem(it, self));
            });
        }
        this.children = branchs;
    }

    save_append(items) {
        let its = [];
        this.children.forEach(ch => ch.save_append(its));
        this.data.items = its;
        items.push(this.data);
    }
}

class Segments {
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {name: '', kind: 'segments', items: []};
        this.children = load_objs(this.data.items, this);
    }
    save_append(items) {
        this.data.items = save_objs(this.children);
        items.push(this.data);
    }
}

class Segment {
    constructor(data, parent) {
        this.parent = parent;
        this.data = data || {name: '', kind: 'segment'};
    }
    save_append(items) {
        items.push(this.data);
    }
}

function load_objs(items, parent) {
    if(!items || items.length === 0) {
        return [];
    }
    let objs = [];
    items.forEach(it => {
        if(it.kind === 'segment') {
            objs.push(new Segment(it, parent));
        } else if(it.kind === 'segments') {
            objs.push(new Segments(it, parent));
        } else if(it.kind === 'oneof') {
            objs.push(new Oneof(it, parent));
        }
    });
    return objs;
}

function save_objs(objs) {
    let items = [];
    objs.forEach(it => {
        it.save_append(items);
    });
    return items;
}

function draw_objs(objs) {
    let items = [];
    objs.forEach(it => {
        it.draw_append(items);
    });
    return items;
}
