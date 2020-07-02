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
    headers: [{width: 48}, {width:48}, {
        text: '名称',
        value: 'name'
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
            return data.parser && data.parser.indexOf('string')>=0;
        },
    },
    {
        name: 'endwith',
        type: 'text',
        cols: 6,
        label: '结尾符',
        visual: function (data) {
            return data.parser && data.parser.indexOf('string')>=0;
        },
    },
]
}
export default cfg