

function get_script_pack() {
    const res = [
        'function entry(vars, option)',
        'local buff = pack(protocol[vars.prot], vars.msg)',
        'if buff==nil then error("打包失败") end',
        'record.pack_result = string.buff2hex(buff)',
        'exit()',
        'end',
    ]
    return res.join('\n');
}

const cfg = {
    kind: 'protocol',
    icon: 'mdi-message-outline',
    script: {
        pack: get_script_pack(),
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
    headers: [{
        width: 48
    }, {
        width: 48
    }, {
        text: '名称',
        value: 'name',
        width: '20%',
    }, {
        text: '解析',
        align: 'start',
        value: 'kind',
    }, {
        text: '设置',
        value: 'config'
    }],
    bitaligns: [{
        text: "高位在前",
        value: "rl",
    }, {
        text: "低位在前",
        value: "lr",
    }],
    new_widgets: [{
            name: 'type',
            type: 'select',
            cols: 8,
            items: [{
                    text: '协议段',
                    value: 'segment'
                },
                {
                    text: '协议段分组',
                    value: 'segments'
                }, {
                    text: '动态分支',
                    value: 'oneof'
                }
            ],
            label: '类型',
        },
        {
            name: 'count',
            type: 'number',
            cols: 4,
            label: '数量'
        },
        {
            name: 'name',
            type: 'text',
            cols: 12,
            label: '名称',
            visual: function (data) {
                return data.type !== 'oneof';
            },
        },
        {
            name: 'arrlen',
            type: 'text',
            cols: 12,
            label: '数组长度',
            visual: function (data) {
                return data.type !== 'oneof';
            },
        },
        {
            name: 'parser',
            type: 'text',
            cols: 12,
            label: '解析方式',
            visual: function (data) {
                return data.type === 'segment';
            },
        }
    ],
    name_widgets: [{
            name: 'name',
            type: 'text',
            cols: 4,
            label: '名称'
        },
        {
            name: 'memo',
            type: 'text',
            cols: 8,
            label: '说明'
        },
        {
            name: 'arrlen',
            type: 'text',
            cols: 12,
            label: '数组长度',
        },
    ],
    autovalue_widgets: [{
        name: 'autovalue',
        type: 'text',
        cols: 12,
        label: '自动赋值'
    }, ],
    config_widgets: [{
            name: 'parser',
            type: 'text',
            cols: 6,
            label: '解析方式'
        },
        {
            name: 'autovalue',
            type: 'text',
            cols: 6,
            label: '自动赋值'
        },
        {
            name: 'length',
            type: 'text',
            cols: 6,
            label: '字节长度',
            visual: function (data) {
                return data.parser && data.parser.indexOf('string') >= 0;
            },
        },
        {
            name: 'endwith',
            type: 'text',
            cols: 6,
            label: '结尾符',
            visual: function (data) {
                return data.parser && data.parser.indexOf('string') >= 0;
            },
        },
    ]
}
export default cfg