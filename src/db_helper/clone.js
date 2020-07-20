

import db from '../feature/m_db';

//获取克隆后的新名称
function get_clone_name(kind, proj_id, doc_id) {
    let items = db.list(kind, proj_id);
    let item = db.load(kind, doc_id);
    let doc = db.load('doc', doc_id);
    console.log('items', items)
    console.log('item', item)
    console.log('doc', doc)
}

export default {
    get_clone_name
}

