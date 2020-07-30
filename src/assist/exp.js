import db from '../feature/m_db';
import helper from '../helper/helper';
import yaml from 'js-yaml';
import fs  from 'fs';

let a = 0

// 导出监控面板
function _exp_panel(clone_doc, clone_el, filename){
    if(!clone_doc || !clone_doc.content || !clone_doc.content.layout){
        return;
    }
    clone_doc.content.id = clone_el.id
    clone_doc.content.name = clone_el.name
    clone_doc.content.layout.forEach(it =>{
        for (let item of it.items){
            delete item.config.option_code
        }
    })
    try{
        fs.writeFile(filename, yaml.dump(clone_doc.content), 'utf8',function(err){
            return err
        })
    }catch{
        return
    }
}
//  导出设备
function _exp_device(clone_doc, clone_el, filename){
    if (!clone_doc || !clone_el){
        return;
    }
    let list = []
    let name = clone_el.name
    let dict_start = {level: 0, text: `device ${name} {`}
    list.push(dict_start)
    if (clone_doc.content.items){
        clone_doc.content.items.forEach(items => {
            let str =  _exp_device_kind(items.config)
            let it_obj = {level: 4, text: `${items.kind} ${items.name} { ${str}} `}
            list.push(it_obj)
        });
    }
    let dict_end = {level: 0, text: `}`}
    list.push(dict_end)
    _writefile(list, filename)
}
function _exp_device_kind(config){
    let str = ""
    if (config.ip){
        str = str + `ip: '${config.ip}', `
    }
    if (config.port != null){
        str = str + `port: ${config.port}, `
    }
    if (config.ttl){
        str = str + `ttl: ${config.ttl}, `
    }
    if (config.reuseaddr){
        str = str + `reuseaddr: ${config.reuseaddr}, `
    }
    if (config.maxu){
        str = str + `maxu: ${config.maxu}, `
    }
    if (config.ratio){
        str = str + `ratio: ${config.ratio}, `
    }

    if (config.baudrate){
        str = str + `baudrate: ${config.baudrate}, `
    }
    if (config.bytesize){
        str = str + `bytesize: ${config.bytesize}, `
    }
    if (config.stopbits){
        str =  str + `stopbits: ${config.stopbits}, `
    }
    if (config.parity != 'none' && config.parity != undefined){
        str = `parity: ${config.parity}, `
    }
    if (config.flowcontrol != 'none' && config.flowcontrol != undefined){
        str = `flowcontrol: ${config.flowcontrol}, `
    }
    if (config.keepalive){
        str = str + `keepalive: ${config.keepalive}, `
    }
    if (config.nodelay){
        str = str + `nodelay: ${config.nodelay}, `
    }
    if (config.acceptany){
        str = str + `acceptany: ${config.acceptany}, `
    }
    return str
}
// 根据设备id获取设备名称
function _exp_device_name(device_id){
    let clone_el = helper.deep_copy(db.load('device', device_id))
    return clone_el.name
}
// 导出拓扑关系
function _exp_topology(clone_doc, clone_el, filename){
    if (!clone_el || !clone_doc.content){
        return;
    }
    let list = []
    let name = clone_el.name
    let dict_start = {level: 0, text: `topology ${name} {`}
    list.push(dict_start)
    let co = []
    _mapping(list, clone_doc, co)
    _linking(list,clone_doc, co )
    _binding(list, clone_doc, co)
    _writefile(list, filename)
    
    // _writefile(_binding(_linking(_mapping(list, clone_doc, co), clone_doc, co), clone_doc, co),filename)
}

// 写入文件
function _writefile(list, filename){
    let codes = list.map(it =>' '.repeat(it.level) + it.text)
    codes.join('\n')
    let str = ''
    codes.forEach(it=>{
        str = str + it + "\n"
    })
    fs.writeFile(filename, str, function(err){
        if (err){
            return err;
        }
    });
}

// 写入binding
function _binding(list, clone_doc, co){
    if (clone_doc.content.binding){
        let binding_start = {level: 4, text: `binding: {`}
        list.push(binding_start)
        clone_doc.content.binding.forEach(obj =>{
            let obj_id = obj.conn_id
            let li = []
            co.forEach(it =>{
                it.conn_list.forEach(item =>{
                    if (obj_id == item.conn_id){
                        li.push( it.name + '.' + item.coon_name )
                    }
                })
            })
            console.log(obj)
            if (obj.uri){
                list.push({level: 8, text: `${li.join(', ')}: '${obj.uri}',`})
            }
            
        })
        list.push({level: 4, text: `}`})
    }
    list.push({level:0,text:'}'})
    return list
}
// 写入mapping
function _mapping(list, clone_doc, co){
    let mapping_start = {level: 4, text: `mapping: {`}
    list.push(mapping_start)
    if (clone_doc.content.mapping){
        let list_etest = []
        let list_uut = []
        clone_doc.content.mapping.forEach(it =>{
            let device_name = _exp_device_name(it.dev_id)
            let conn_doc =  helper.deep_copy(db.load('doc', it.dev_id));
            let connlist = []
            conn_doc.content.items.forEach(it =>{
                let connkey = {'coon_name': it.name, 'conn_id': it.id}
                connlist.push(connkey)
            })
            let dev_list = {'conn_list': connlist, 'name':device_name}
            co.push(dev_list)
            if (it.used == 'etest'){
                list_etest.push(device_name)
            }else{
                list_uut.push(device_name)
            }
        })
        // if (list_etest.length > 0){
        //     list.push({level: 8, text: `etest: [${list_etest.join(', ')}],`})
        // }
        // if (list_uut.length > 0){
        //     list.push({level: 8, text: `uut: [${list_uut.join(', ')}],`})
        // }
        list.push({level: 8, text: `uut: [${list_uut.join(', ')}],`})
        list.push({level: 8, text: `etest: [${list_etest.join(', ')}],`})

    }
    let map = {level: 4, text: `}`}
    list.push(map)
    return list
}
// 写入lingking
function _linking(list, clone_doc, co){
    if (clone_doc.content.linking){
        let mapping_start = {level: 4, text: `linking: {`}
        list.push(mapping_start)
        let idx = 0
        clone_doc.content.linking.forEach(it =>{
            if(it.conns.length > 0){
                let name = ("link_" + idx++).toString()
                let li = []
                it.conns.forEach(id =>{
                    co.forEach(it =>{
                        // let finditem = it.conn_list.find(item => item.conn_id == id);
                        // li.push(' ' + it.name + '.' + finditem.coon_name)
                        it.conn_list.forEach(item =>{
                            if (id == item.conn_id){
                                li.push(' ' + it.name + '.' + item.coon_name )
                            }
                        })
                    })
                })
                list.push({level: 8, text: `${name}: [${li}],`})
            }
            
        })
        let map = {level: 4, text: `}`}
        list.push(map)
    }
    return list
}
// 导出协议oneof
function _exp_oneof(items, num, list){
    num = num + 4
    let is_oneof = false
    items.forEach(item =>{
        if (item.kind == 'oneof'){
            if(is_oneof){
                list.push({level: num,text: `segment _seg${a} { }`})
                a = a + 1
            }else{
                is_oneof = true
            }
            item.items.forEach(it =>{
                if (it.kind == 'oneofitem'){
                    list.push({level: num, text: `${item.kind} (${it.condition}) {`}) 
                    _exp_oneof(it.items, num, list)
                    list.push({level: num, text:`}`})
                }
            }) 
            
        }else{
            is_oneof = false
        }
        if (item.kind == 'segment'){
            _exp_protocol_segment(item, list, num)
        }
        if (item.kind == 'segments'){
            _exp_protocol_array(item, list, num)
            _exp_oneof(item.items, num, list)
            list.push({level: num, text:`}`})
        }
    })
    

}

//判断协议的数组长度
function _exp_protocol_array(item, list, num){
    if (item.arrlen){
        list.push({level: num, text: `${item.kind} ${item.name} [${item.arrlen}] {`})
    }
    else{
        list.push({level: num, text: `${item.kind} ${item.name} {`})
    }
}

// 判断协议段是否为字符串
function _exp_protocol_string1(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && !(item.endwith)){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(!(item.length) && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', autovalue: ${item.autovalue}}`})
    }
}

function _exp_protocol_string2(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && !(item.endwith)){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', length: ${item.length}}`}) 
    }else if(!(item.length) && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}', endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} [${item.arrlen}] {parser: '${item.parser}'}`})
    }
}

function _exp_protocol_string3(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name}  {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && !(item.endwith)){
        list.push({level: num, text:`${item.kind} ${item.name}  {parser: '${item.parser}', autovalue: ${item.autovalue}, length: ${item.length}}`}) 
    }else if(!(item.length) && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name}  {parser: '${item.parser}', autovalue: ${item.autovalue}, endwith: ${item.endwith}}`}) 
    }else{
        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}', autovalue: ${item.autovalue}}`})
    }
}

function _exp_protocol_string4(item, list, num){
    if (item.length && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}', length: ${item.length}, endwith: ${item.endwith}}`})
    }else if(item.length && !(item.endwith)){
        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}', length: ${item.length}}`}) 
    }else if(!(item.length) && item.endwith){
        list.push({level: num, text:`${item.kind} ${item.name}  {parser: '${item.parser}', endwith: ${item.endwith}}`}) 
    }else{

        list.push({level: num, text:`${item.kind} ${item.name} {parser: '${item.parser}'}`})
    }
}

function _exp_protocol_segment(item, list, num){
    if (item.autovalue && item.arrlen){
        _exp_protocol_string1(item, list, num)
    }
    else if(!(item.autovalue) && item.arrlen){
        _exp_protocol_string2(item, list, num)
    }
    else if(item.autovalue && !(item.arrlen)){
        _exp_protocol_string3(item, list, num)
    }
    else{
        _exp_protocol_string4(item, list, num)
    }
}
// 导出协议
function _exp_protocol(clone_doc, clone_el, filename){
    if (!clone_doc || !clone_el){
        return;
    }
    let list = []
    list.push({level: 0, text: `${clone_doc.kind} ${clone_el.name} {`})
    _exp_oneof(clone_doc.content.items, 0, list)
    list.push({level: 0, text:'}'})
    _writefile(list, filename)

}
// 导出program
function _exp_program(clone_doc, clone_el, filename){
    
}
function export_element(kind, id, path) {
    let clone_el = helper.deep_copy(db.load(kind, id));
    let clone_doc =  helper.deep_copy(db.load('doc', id));
    if(clone_doc) {
        switch (kind) {
            case 'device':
                _exp_device(clone_doc, clone_el, path);
                break;
            case 'topology':
                _exp_topology(clone_doc, clone_el, path)
                break;
            case 'panel':
                _exp_panel(clone_doc, clone_el, path)
                break
            case 'protocol':
                _exp_protocol(clone_doc, clone_el, path)
                break
            case 'simu':
                _exp_simu(clone_doc)
                break
            case 'program':
                _exp_program(clone_doc)
                break
            default:
                console.error('TODO export', kind);
                break;
        }        
    }

}

export default {
    export_element,
}