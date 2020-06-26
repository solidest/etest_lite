const cfg = {
    items1: [{
            text: '向后添加',
            value: 'new_item_end',
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
        },

    ],
    device: {
        bar_items: 'items1',
        new_items: [
            'di',
            'do',
            'ad',
            'da',
            'serial_232',
            'serial_422',
            'serial_485',
            'udp',
            'tcp_client',
            'tcp_server',
        ],
        new_multi: true,
        icon: 'mdi-dev-to',
        headers: [
            {
                text: '接口类型',
                align: 'start',
                value: 'kind',
            },
            {
                text: '接口名称',
                value: 'name'
            },
            {
                text: '接口参数',
                value: 'config'
            }
        ]
    },
}
export default cfg