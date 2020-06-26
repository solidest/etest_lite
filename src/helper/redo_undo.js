
class RedoUndo {
    constructor() {
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
    reset(item) {
        this.undo.length = 0;
        this.redo.length = 0;
        this.current = JSON.stringify(item);
    }
    pushChange(item) {
        let sit = JSON.stringify(item);
        if(!this.current) {
            this.current = sit;
            return;
        }
        this.undo.push(this.current);
        this.current = sit;
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
        return JSON.parse(this.current);
    }
    popRedo() {
        if(this.redo.length === 0) {
            return null;
        }
        this.undo.push(this.current);
        this.current = this.redo.pop();
        return JSON.parse(this.current);
    }
}

export default RedoUndo
