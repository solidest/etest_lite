
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

}

export default CaseLua;