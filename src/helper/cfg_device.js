let new_widgets = [{
        name: 'type',
        type: 'select',
        cols: 8,
        items: [
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
        label: '接口类型',
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
];

let serial_widgets = [{
    name: 'baudrate',
    type: 'combobox',
    cols: 4,
    items: [ 2400, 4800, 7200, 9600, 14400, 19200, 28800, 57600, 76800, 38400, 115200 ],
    label: '波特率'
}, {
    name: 'bytesize',
    type: 'select',
    cols: 2,
    items: [5, 6, 7, 8],
    label: '数据位'
}, {
    name: 'stopbits',
    type: 'select',
    cols: 2,
    items: [1, 2, 1.5],
    label: '停止位'
}, {
    name: 'parity',
    type: 'select',
    cols: 2,
    items: ['none', 'odd', 'event', 'mark', 'space'],
    label: '校验方式'
}, {
    name: 'flowcontrol',
    type: 'select',
    cols: 2,
    items: ['none', 'software', 'hardware'],
    label: '流控方式'
}];

let ad_da_widgets = [{
    name: 'ratio',
    type: 'select',
    cols: 12,
    items: [8, 16, 32, 64],
    label: '分辨率',
}];

let di_do_widgets = [{
    name: 'maxu',
    type: 'number',
    cols: 12,
    label: '最大工作电压'
}];

let udp_widgets = [
    {name: 'ip', type: 'text', cols: 4, label: '地址'},
    {name: 'port', type: 'number', cols: 2, label: '端口'},
    {name: 'ttl', type: 'number', cols: 2, label: '存活周期'},
    {name: 'reuseaddr', type: 'checkbox', cols: 4, label: '复用地址端口'},
];

let tcp_client_widgets = [
    {name: 'ip', type: 'text', cols: 8, label: '地址'},
    {name: 'port', type: 'number', cols: 4, label: '端口'},
    {name: 'keepalive', type: 'checkbox', cols: 4, label: '长连接'},
    {name: 'nodelay', type: 'checkbox', cols: 4, label: '禁用Nagle'},
    {name: 'autoconnect', type: 'checkbox', cols: 4, label: '自动连接'},
];

let tcp_server_widgets = [
    {name: 'ip', type: 'text', cols: 8, label: '地址'},
    {name: 'port', type: 'number', cols: 4, label: '端口'},
    {name: 'keepalive', type: 'checkbox', cols: 4, label: '长连接'},
    {name: 'nodelay', type: 'checkbox', cols: 4, label: '禁用Nagle'},
    {name: 'acceptany', type: 'checkbox', cols: 4, label: '接收所有请求'},
];

const cfg = {
    kind: 'device',
    bar_items: [{
            text: '向后添加接口',
            value: 'new_item_after',
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
    icon: 'mdi-dev-to',
    headers: [{}, {
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
        di: {
            maxu: 5
        },
        do: {
            maxu: 5
        },
        ad: {
            ratio: 16
        },
        da: {
            ratio: 16
        },
        udp: {
            ip: '0.0.0.0',
            port: 0,
            ttl: 0,
            reuseaddr: true
        },
        tcp_client: {
            ip: '0.0.0.0',
            port: 0,
            keepalive: true,
            nodelay: true,
            autoconnect: true
        },
        tcp_server: {
            ip: '0.0.0.0',
            port: 8080,
            keepalive: true,
            nodelay: true,
            acceptany: false
        },
        serial_232: {
            baudrate: 115200,
            bytesize: 8,
            parity: 'none',
            stopbits: 1,
            flowcontrol: 'none'
        },
        serial_422: {
            baudrate: 115200,
            bytesize: 8,
            parity: 'none',
            stopbits: 1,
            flowcontrol: 'none'
        },
        serial_485: {
            baudrate: 115200,
            bytesize: 8,
            parity: 'none',
            stopbits: 1,
            flowcontrol: 'none'
        },
        serial_ttl: {
            baudrate: 115200,
            bytesize: 8,
            parity: 'none',
            stopbits: 1,
            flowcontrol: 'none'
        },
    },
    intf_widgets: {
        di: di_do_widgets,
        do: di_do_widgets,
        ad: ad_da_widgets,
        da: ad_da_widgets,
        udp: udp_widgets,
        tcp_client: tcp_client_widgets,
        tcp_server: tcp_server_widgets,
        serial_232: serial_widgets,
        serial_422: serial_widgets,
        serial_485: serial_widgets,
        serial_ttl: serial_widgets,
    },
    new_widgets: new_widgets,
    name_widgets: [
        {name: 'name', type: 'text', cols: 4, label: '名称'},
        {name: 'memo', type: 'text', cols: 8, label: '说明'},
    ]
}
export default cfg