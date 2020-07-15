
import db from '../../feature/m_db';
import helper from '../../helper/helper';
import CaseLua from './CaseLua';
import t_man from '../../helper/tree_man';

class CaseTree {
    constructor(items, proj) {
        this.items = helper.deep_copy(items);
        this.proj = proj;

        let leafs = [];
        items.forEach(it => {
            t_man.getLeafs(it, leafs);
        });

        this.luas = [];
        this.libs = [];
        leafs.forEach(it => {
            if(it.kind === 'lua') {
                let doc = db.load('doc', it.id);
                let cl = new CaseLua(doc, proj, it.name);
                if(doc.conent && doc.conent.option && doc.conent.option.lib) {
                    this.libs.push(cl);
                } else {
                    this.luas.push(cl);
                }
            }
        });
    }

    _make_out_items(items) {
        let res = [];
        if(!items) {
            return res;
        }
        return res;
    }

    make_out_tree() {
        return this._make_out_items(this.items);
    }

    make_out_luas() {
        return this.luas.map(it => it.make_out());
    }

    make_out_libs() {
        return this.libs.map(it => it.make_out());
    }
}

export default CaseTree;