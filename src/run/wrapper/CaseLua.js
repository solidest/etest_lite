import helper from '../../helper/helper';
import db from '../../feature/m_db';

class CaseLua {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get option() {
        return this.data.content ? (this.data.content.option || {}) : {};
    }

    make_out() {
        let opt = {
            real_time: this.option.type && (this.option.type !== 'normal'),
            rt_cycle: this.option.rt_cycle,
        };
        if (opt.real_time) {
            opt.rt_policy = this.option.type;
        }

        let panel = null;
        if(this.option.panel) {
            let doc = db.load('doc', this.option.panel);
            panel = doc.content;
        }
        return {
            id: this.id,
            name: this.name,
            script: this.data.content ? (this.data.content.script || '') : '',
            vars: this.option.vars_obj,
            option: opt,
            panel: panel,
        }
    }

}

export default CaseLua;