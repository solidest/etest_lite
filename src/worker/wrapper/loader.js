
import ipc from '../../feature/r_ipc';
import Project from './Project';
import Device from './Device';
import Topology from './Topology';


const kinds = [ {
        kind: 'device',
        cls: Device,
    }, {
        kind: 'topology',
        cls: Topology,
    }
]
//['program', 'panel', 'protocol', 'device', 'topology', 'simu', 'doc']

async function load_proj(proj_data, stopper) {

    let proj = new Project(proj_data);

    for(let k of kinds) {
        let k_list = await ipc.list({proj_id: proj.id, kind: k.kind});
        if(stopper && stopper(proj.id, proj.version)) {
            return null;
        }
        if(k_list) {
            for(let kd of k_list) {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: kd.id,
                });
                if(stopper && stopper(proj.id, proj.version)) {
                    return null;
                }
                if(!doc) {
                    continue;
                }
                let k_obj = new k.cls(doc, proj);
                proj.addKind(k.kind, k_obj);
            }
        }
    }
    
    return proj;
}

export default load_proj;