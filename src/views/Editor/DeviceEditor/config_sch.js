const serial_schema = [{
    name: 'name',
    type: 'text',
    label: '接口名称'
}, {
    name: 'memo',
    type: 'text',
    label: '备注'
}, {
    name: 'baudrate',
    type: 'combobox',
    items: [2400, 4800, 7200, 9600, 14400, 19200, 28800, 57600, 76800, 38400, 115200],
    label: '波特率'
}, {
    name: 'bytesize',
    type: 'select',
    items: [5, 6, 7, 8],
    label: '数据位'
}, {
    name: 'stopbits',
    type: 'select',
    items: [1, 2, 1.5],
    label: '停止位'
}, {
    name: 'parity',
    type: 'select',
    items: ['none', 'odd', 'event', 'mark', 'space'],
    label: '校验方式'
}, {
    name: 'flowcontrol',
    type: 'select',
    items: ['none', 'software', 'hardware'],
    label: '流控方式'
}];

const ad_da_schema = [{
    name: 'name',
    type: 'text',
    label: '接口名称'
}, {
    name: 'memo',
    type: 'text',
    label: '备注'
}, {
    name: 'ratio',
    type: 'combobox',
    cols: 12,
    items: [8, 16, 32, 64],
    label: '分辨率',
}];

const di_do_schema = [{
    name: 'name',
    type: 'text',
    label: '接口名称'
}, {
    name: 'memo',
    type: 'text',
    label: '备注'
}, {
    name: 'maxu',
    type: 'number',
    label: '最大工作电压'
}];

const udp_schema = [{
        name: 'name',
        type: 'text',
        label: '接口名称'
    }, {
        name: 'memo',
        type: 'text',
        label: '备注'
    }, {
        name: 'ip',
        type: 'text',
        label: '地址'
    },
    {
        name: 'port',
        type: 'number',
        label: '端口'
    },
    {
        name: 'ttl',
        type: 'number',
        label: '存活周期'
    },
    {
        name: 'reuseaddr',
        type: 'checkbox',
        label: '复用地址端口'
    },
];

const tcp_client_schema = [{
        name: 'name',
        type: 'text',
        label: '接口名称'
    }, {
        name: 'memo',
        type: 'text',
        label: '备注'
    }, {
        name: 'ip',
        type: 'text',
        label: '地址'
    },
    {
        name: 'port',
        type: 'number',
        label: '端口'
    },
    {
        name: 'keepalive',
        type: 'checkbox',
        label: '长连接'
    },
    {
        name: 'nodelay',
        type: 'checkbox',
        label: '禁用Nagle'
    },
    {
        name: 'autoconnect',
        type: 'checkbox',
        label: '自动连接'
    },
];

const tcp_server_schema = [{
        name: 'name',
        type: 'text',
        label: '接口名称'
    }, {
        name: 'memo',
        type: 'text',
        label: '备注'
    }, {
        name: 'ip',
        type: 'text',
        label: '地址'
    },
    {
        name: 'port',
        type: 'number',
        label: '端口'
    },
    {
        name: 'keepalive',
        type: 'checkbox',
        label: '长连接'
    },
    {
        name: 'nodelay',
        type: 'checkbox',
        label: '禁用Nagle'
    },
    {
        name: 'acceptany',
        type: 'checkbox',
        label: '接收所有请求'
    },
];

const can_schema = [
    {
        name: 'name',
        type: 'text',
        label: '接口名称'
    }, {
        name: 'memo',
        type: 'text',
        label: '备注'
    }, {
        name: 'baudrate',
        type: 'combobox',
        items: [2400, 4800, 7200, 9600, 14400, 19200, 28800, 57600, 76800, 38400, 115200],
        label: '波特率'
    }, {
        name: 'accept_mask',
        type: 'text',
        label: '过滤验收码'
    }, {
        name: 'shield_mask',
        type: 'text',
        label: '过滤屏蔽码'
    }
];

export default {
    di: di_do_schema,
    do: di_do_schema,
    ai: ad_da_schema,
    ao: ad_da_schema,
    udp: udp_schema,
    tcp_client: tcp_client_schema,
    tcp_server: tcp_server_schema,
    serial_232: serial_schema,
    serial_422: serial_schema,
    serial_485: serial_schema,
    serial_ttl: serial_schema,
    can: can_schema,
}