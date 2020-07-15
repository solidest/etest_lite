
import helper from '../../helper/helper';

class CaseLua {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.name;
    }

    make_out() {
        return {
            id: this.id,
            name: this.name,
            script: this.data.content ? (this.data.content.script||'') : '',
        }
    }

}

export default CaseLua;