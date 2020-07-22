

function get_script_pack() {
    const res = [
        'function entry(vars, option)',
        'local buff, detail = etl.pack(protocol[vars.prot], vars.msg)',
        'if buff == nil then',
        'record.result = "error"',
        'record.value = "打包失败"',
        'else',
        'record.result = "pack"',
        'record.value = string.buff2hex(buff)',
        'record.detail = detail',
        'record.auto_value = unpack(protocol[vars.prot], buff)',
        'exit()',
        'end',
        'end',
    ]
    return res.join('\n');
}

function get_script_unpack() {
    const res = [
        'function entry(vars, option)',
        'local msg, len, detail = etl.unpack(protocol[vars.prot], string.hex2buff(vars.buff))',
        'if msg == nil then',
        'record.result = "error"',
        'record.value = "解包失败"',
        'else',
        'record.result = "unpack"',
        'record.value = msg',
        'record.detail = detail',
        'exit()',
        'end',
        'end',
    ]
    return res.join('\n');
}

const cfg = {
    kind: 'protocol',
    icon: 'mdi-message-outline',
    script: {
        pack: get_script_pack(),
        unpack: get_script_unpack(),
    },
    bar_items: [{
        text: '协议测试',
        value: 'd_play',
        icon: 'mdi-play',
        is_disabled: true,
    },{
        text: '关闭测试',
        value: 'd_stop',
        icon: 'mdi-stop',
        is_disabled: false,
    },{},{
        text: '添加子级',
        value: 'd_new_item_sub',
        icon: 'mdi-table-row',
        is_disabled: true,
    }, {
        text: '向后添加',
        value: 'd_new_item_after',
        icon: 'mdi-table-row-plus-after',
        is_disabled: true,
    }, {
        text: '向前添加',
        value: 'd_new_item_before',
        icon: 'mdi-table-row-plus-before',
        is_disabled: true,
    }, {
        text: '上移',
        value: 'd_move_up',
        icon: 'mdi-arrow-up',
        is_disabled: true,
    }, {
        text: '下移',
        value: 'd_move_down',
        icon: 'mdi-arrow-down',
        is_disabled: true,
    }, {
        text: '剪切',
        value: 'd_cut',
        icon: 'mdi-content-cut',
        is_disabled: true,
    }, {
        text: '复制',
        value: 'd_copy',
        icon: 'mdi-content-copy',
        is_disabled: true,
    }, {
        text: '粘贴',
        value: 'd_paste',
        icon: 'mdi-content-paste',
        is_disabled: true,
    }, {
        text: '撤销',
        value: 'd_undo',
        icon: 'mdi-undo',
        is_disabled: true,
    }, {
        text: '恢复',
        value: 'd_redo',
        icon: 'mdi-redo',
        is_disabled: true,
    }, {
        text: '删除',
        value: 'd_del_item',
        icon: 'mdi-delete-outline',
        is_disabled: true,
    }, ],
    headers: [ {
        text: '名称',
        value: 'name',
        width: '20%',
    }, {
        text: '解析',
        align: 'start',
        value: 'parser',
    }, {
        text: '值',
        value: 'value'
    }, {
        text: '开始位置',
        value: 'begin'
    }, {
        text: '结束位置',
        value: 'end'
    }],

}
export default cfg