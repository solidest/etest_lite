import helper from '../../helper/helper';

class Project {
    constructor(data) {
        this.data = helper.deep_copy(data);
    }

    get id() {
        return this.data.id;
    }

    get version() {
        return this.data.updated;
    }
    
    addKind(kind, kind_obj) {
        if(!this[kind]) {
            this[kind] = [];
        }
        this[kind].push(kind_obj);
    }
}

export default Project;