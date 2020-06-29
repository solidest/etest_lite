const cfg = {
    kind: 'protocol',
    icon: 'mdi-message-outline',
    bar_items: [{
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
            text: '类型',
            align: 'start',
            value: 'kind',
        },
        {
            text: '名称',
            value: 'name'
        },
        {
            text: '解析设置',
            value: 'config'
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
            label: '名称'
        }
    ]
}
export default cfg