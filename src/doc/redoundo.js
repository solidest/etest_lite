
class RedoUndo {
    constructor(id) {
        this.id = id;
        this.undo = [];
        this.redo = [];
        this.current = null;
    }
    get undoCount() {
        return this.undo.length;
    }
    get redoCount() {
        return this.redo.length;
    }
    get isEmpty() {
        return this.current === null;
    }
    reset(item, tag) {
        this.undo.length = 0;
        this.redo.length = 0;
        if(item) {
            this.current = {doc: JSON.stringify(item), tag};
        } else {
            this.current = null;
        }
    }
    pushChange(doc, tag) {
        let sit = JSON.stringify(doc);
        if(!this.current) {
            this.current = {doc: sit, tag};
            return;
        }
        this.undo.push(this.current);
        this.current = {doc: sit, tag};
        if(this.undo.length>30) {
            this.undo.shift();
        }
        this.redo.length = 0;
    }
    popUndo() {
        if(this.undo.length === 0) {
            return null;
        }
        this.redo.push(this.current);
        this.current = this.undo.pop();
        return {doc: JSON.parse(this.current.doc), tag: this.current.tag}
    }
    popRedo() {
        if(this.redo.length === 0) {
            return null;
        }
        this.undo.push(this.current);
        this.current = this.redo.pop();
        return {doc: JSON.parse(this.current.doc), tag: this.current.tag}
    }
    updateTag(tag) {
        if(this.current) {
            this.current.tag = tag;
        }
    }
}
let __rus = [];

function put_ru(id) {
    let ru = __rus.find(it => it.id === id);
    if(ru) {
        ru.reset(null);
    } else {
        ru = new RedoUndo(id);
        __rus.push(ru);
    }
    return ru;
}

function get_ru(id) {
    return __rus.find(it => it.id === id);
}

function del_ru(id) {
    let idx = __rus.findIndex(it => it.id === id);
    if(idx>=0) {
        __rus.splice(idx, 1);
    }
}
 
export default {
    put_ru,
    get_ru,
    del_ru,
}
