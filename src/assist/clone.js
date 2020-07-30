import db from '../feature/m_db';
import helper from '../helper/helper';
import tree from '../helper/tree_man';
import shortid from 'shortid';

//['program', 'panel', 'protocol', 'device', 'topology', 'simu', 'doc']

function _get_clone_name(items, old_name) {
    let base_name = old_name + '_copy';
    let name = base_name;
    let idx = 1;
    while(items.find(it => it.name===name)) {
        name = base_name + idx++;
    }
    return name;
}
// 克隆监控面板
function _update_panel(doc) {
    if(!doc || !doc.content || !doc.content.layout){
        return;
    }
    
    doc.content.layout.forEach(it => {
        it.id = shortid.generate()
    })
}
// 克隆设备
function _update_device(doc) {
    if(!doc || !doc.content || !doc.content.items) {
        return;
    }
    doc.content.items.forEach(it => {
        it.id = shortid.generate();
    });
}
// 克隆拓扑结构
function _update_topology(doc) {
    if(!doc || !doc.content || !doc.content.mapping) {
        return;
    }

    doc.content.linking.forEach(it => {
        let id = it.id
        it.id = shortid.generate();
        if (it.conns.length > 2) {
            doc.content.draw_data.nodes.forEach(data => {
                if (id == data.id) {
                    data.id = it.id
                } 
            });
            doc.content.draw_data.edges.forEach(dege => {
                if (id == dege.target) {
                    dege.target = it.id
                }
            });
        }
    });
  
}
// 修改协议的id号
function _update_protocol_id(items) {
    items.forEach(it =>{
        it.id = shortid.generate();
        if(it.items) {
            _update_protocol_id(it.items)
        }
    });
}
// 克隆协议
function _update_protocol(doc) {
    if(!doc || !doc.content || !doc.content.items) {
        return;
    }
    _update_protocol_id(doc.content.items);
}
// 克隆sium
function _update_simu(doc) {
    if (!doc || !doc.content || !doc.content.items) {
        return;
    }
    doc.content.items.forEach(it => {
        it.id = shortid.generate();
    });
    
}
// 克隆测试用例
function _update_program(proj_id, id) {
    let items = db.list('program', proj_id);
    let select = tree.findItem(items[0].items, id)
    let clone_el = helper.deep_copy(select);
    let select_parent = tree.findParentChildren(items[0].items, id)
    if (id === clone_el.id && clone_el.kind === 'lua'){
        let lua = helper.deep_copy(db.load('doc', clone_el.id));
        lua.id = shortid.generate();
        clone_el.id = lua.id
        clone_el.name =  _get_clone_name(select_parent, clone_el.name)
        delete lua.meta;
        delete lua.$loki;
        db.insert('doc', lua)
        tree.insert(select_parent,clone_el)
        return clone_el
    }
    // 获取当前节点的父级数组
    // let res = JSON.parse(JSON.stringify(select_parent))

    if (clone_el.kind == 'dir') {
        // 跟新所有子节点的id与name
        _update_pro(clone_el.children)
    }
    let clone = helper.deep_copy(db.load('doc', clone_el.id));
    let clone_id = shortid.generate();
    if (clone){
        clone.id = clone_id;
    }
    clone_el.id = clone_id;
    clone_el.name = _get_clone_name(select_parent, clone_el.name)
    tree.insert(select_parent, clone_el)
    return clone_el
}

function clone_element(kind, proj_id, id) {
    if (kind == 'program'){
        return _update_program(proj_id, id)
    }else{
        let clone_el = helper.deep_copy(db.load(kind, id))
        let clone_doc =  helper.deep_copy(db.load('doc', id))
        let items = db.list(kind, proj_id)
        delete clone_el.meta
        delete clone_el.$loki
        clone_el.id = shortid.generate()
        clone_el.name = _get_clone_name(items, clone_el.name);
        
        if(clone_doc) {
            delete clone_doc.meta;
            delete clone_doc.$loki;
            clone_doc.id = clone_el.id;

            switch (kind) {
                case 'device':
                    _update_device(clone_doc);
                    break;
                case 'topology':
                    _update_topology(clone_doc)
                    break;
                case 'panel':
                    _update_panel(clone_doc)
                    break
                case 'protocol':
                    _update_protocol(clone_doc)
                    break
                case 'simu':
                    _update_simu(clone_doc)
                default:
                    console.error('TODO clone', kind);
                    break;
            }        
        }
        db.insert(kind, clone_el);
        if(clone_doc) {
            db.insert('doc', clone_doc);
        }
        return clone_el;
        }
        
}

// 克隆测试用例
function _update_pro(items){
    if (items.length === 0){
        return;
    }
    items.forEach(it =>{
        // let select_parent = tree.findParentChildren(items, it.id)
        // it.name = _get_clone_name(select_parent, it.name)
        let clone_el = helper.deep_copy(db.load('doc', it.id));
        let clone_id = shortid.generate();
        if (clone_el){
            clone_el.id = clone_id
            delete clone_el.meta;
            delete clone_el.$loki;
            db.insert('doc', clone_el)
        }
        it.id = clone_id
        if (it.kind === 'dir'){
            _update_pro(it.children)
        }
    });

}


export default {
    clone_element,
}