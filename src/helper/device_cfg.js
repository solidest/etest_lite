const cfg = {
    bar_items: [{
            text: '向后添加接口',
            value: 'new_item_end',
            icon: 'mdi-table-row-plus-after'
        }, {
            text: '向前添加接口',
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
    types: [
        'di',
        'do',
        'ad',
        'da',
        'serial_232',
        'serial_422',
        'serial_485',
        'serial_ttl',
        'udp',
        'tcp_client',
        'tcp_server',
    ],
    icon: 'mdi-dev-to',
    headers: [{
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
    ],
    intf_default: { 
        ad: {ratio: 16},
        da: {ratio: 16},
        udp: { ip: '0.0.0.0', reuseaddr: true },
        tcp_client: { ip: '0.0.0.0', keepalive: true, nodelay: false, autoconnect: true },
        tcp_server: { ip: '0.0.0.0', port: 8080, keepalive: true, nodelay: true, acceptany: false},
        serial_232: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
        serial_422: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
        serial_485: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
        serial_ttl: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
    }

}
export default cfg