
import ipc from '../../feature/r_ipc';
import Project from './Project';
import Device from './Device';
import Topology from './Topology';
import Protocol from './Protocol';
import Lua from './Lua';
import XtraLua from './XtraLua';
import t_man from '../../helper/tree_man';

const kinds = [ {
        kind: 'device',
        cls: Device,
    }, {
        kind: 'topology',
        cls: Topology,
    }, {
        kind: 'protocol',
        cls: Protocol,
    }
];

//['program', 'panel', 'protocol', 'device', 'topology', 'simu', 'doc']

async function load_program(proj, stopper) {
    let pg_doc = await ipc.load({
        id: proj.id,
        kind: 'program'
    });
    if(!pg_doc) {
        return;
    }
    let items = pg_doc.items || [];
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
            console.log(proj)
            proj.addKind('lua', new Lua(doc, proj));
        }
    }
}

function load_xtra(proj, proj_data) {
    if(!proj_data.xtra) {
        return;
    }
    proj.addKind('project', new XtraLua('pack', proj_data.xtra.pack, proj));
    proj.addKind('project', new XtraLua('unpack', proj_data.xtra.unpack, proj));
    proj.addKind('project', new XtraLua('recvfilter', proj_data.xtra.recvfilter, proj));
    proj.addKind('project', new XtraLua('check', proj_data.xtra.check, proj));
}

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

    await load_program(proj, stopper);
    await load_xtra(proj, proj_data);
    
    return proj;
}

export default load_proj;