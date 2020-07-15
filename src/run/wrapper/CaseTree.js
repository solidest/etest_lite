
import helper from '../../helper/helper';

class CaseTree {
    constructor(items, proj) {
        this.items = helper.deep_copy(items);
        this.proj = proj;

        let leafs = [];
        items.forEach(it => {
            t_man.getLeafs(it, leafs);
        });
    
        let luas = leafs.filter(l => l.kind === 'lua');
        for(let lua of luas) {
            let doc = await ipc.load({
                kind: 'doc',
                id: lua.id,
            });
            if(stopper && stopper(proj.id, proj.version)) {
                return null;
            }
            if(doc) {
                // console.log(proj)
                proj.addKind('lua', new Lua(doc, proj));
            }
        }
    }

}

export default CaseTree;