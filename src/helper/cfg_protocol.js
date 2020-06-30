const cfg = {
    kind: 'protocol',
    icon: 'mdi-message-outline',
    bar_items: [{
        text: '添加子级',
        value: 'new_item_sub',
        icon: 'mdi-table-row',
    }, {
        text: '向后添加',
        value: 'new_item_after',
        icon: 'mdi-table-row-plus-after'
    }, {
        text: '向前添加',
        value: 'new_item_before',
        icon: 'mdi-table-row-plus-before'
    }, {
        text: '上移',
        value: 'move_up',
        icon: 'mdi-arrow-up'
    }, {
        text: '下移',
        value: 'move_down',
        icon: 'mdi-arrow-down'
    }, {
        text: '复制',
        value: 'copy',
        icon: 'mdi-content-copy'
    }, {
        text: '粘贴',
        value: 'paste',
        icon: 'mdi-content-paste'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, {
        text: '删除',
        value: 'del_item',
        icon: 'mdi-delete-outline'
    }, ],
    headers: [{}, {
            text: 'name',
            value: 'name'
        }, {
            text: 'kind',
            align: 'start',
            value: 'kind',
        }, {
            text: 'config',
            value: 'config'
        }, {
            text: 'level',
            value: 'level',
        }, {
            text: 'deep',
            value: 'deep'
        }
    ],
    bitaligns: [{
        text: "高位在前",
        value: "bitrl",
    }, {
        text: "低位在前",
        value: "bitlr",
    }],
    new_widgets: [{
            name: 'type',
            type: 'select',
            cols: 8,
            items: [{
                    text: 'segment (协议段)',
                    value: 'segment'
                },
                {
                    text: 'segments (协议段分组)',
                    value: 'segments'
                }, {
                    text: 'oneof (动态分支)',
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
            disabled: function (el_name, data) {
                if (el_name === 'name') {
                    return data.type === 'oneof';
                }
                return false;
            },
        }
    ],
    name_widgets: [
        {name: 'name', type: 'text', cols: 4, label: '名称'},
        {name: 'memo', type: 'text', cols: 8, label: '说明'},
    ]
}
export default cfg