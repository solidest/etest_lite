
import checker from '../helper/checker';

const KIND = 'device';

class Device {
    constructor(data, proj) {
        this.data = data;
        this.proj = proj;
    }

    get id() {
        return this.data.id;
    }

    _check_names() {
        let names = [];
        for(let it of this.data.content) {
            let msg = checker.valid_name(names, it.name);
            if(msg === 'ok') {
                it.name = it.name.trim();
                names.push(it.name);
            } else {
                this.proj.pushError(msg, KIND, this.id, it.id);                
            }
        }
    }

    check() {
        if(!this.data.content || this.data.content.length===0) {
            return;
        }
        this._check_names();
    }
}

export default Device;