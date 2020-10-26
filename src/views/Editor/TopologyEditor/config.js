let left_tools = [{
        text: '选择设备',
        value: 'select_dev',
        icon: 'mdi-help-network-outline'
    }, {
        text: '添加网络/总线',
        value: 'new_bus',
        icon: 'mdi-card-plus-outline'
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
        value: 'remove',
        icon: 'mdi-delete-outline'
    }, {
        text: '锁定/编辑',
        value: 'lock_edit',
        icon: 'mdi-pencil-lock-outline'
    }, {
        text: '运行时绑定',
        icon: 'mdi-cog-clockwise',
        value: 'binding',
    }];

let right_tools = [{
    text: 'ETL代码编辑',
    value: 'etl_code',
    icon: 'mdi-code-json'
}];

let intf_types = [
    {value: 'di', text: '数字输入'},
    {value: 'do', text: '数字输出'},
    {value: 'ai', text: '模拟输入'},
    {value: 'ao', text: '模拟输出'},
    {value: 'serial_232', text: '232串口'},
    {value: 'serial_422', text: '422串口'},
    {value: 'serial_485', text: '485串口'},
    {value: 'serial_ttl', text: 'UART'},
    {value: 'can', text: 'can总线接口'},
    {value: 'udp', text: 'UDP协议'},
    {value: 'tcp_client', text: 'TCP客户端'},
    {value: 'tcp_server', text: 'TCP服务器'},
];

let headers = [{width: 48}, {
        text: '接口类型',
        align: 'start',
        value: 'kind',
    }, {
        text: '接口名称',
        value: 'name'
    }, {
        text: '设置',
        value: 'config'
    }
];

let intf_alias = {
    di: 'DI',
    do: 'DO',
    ai: 'AI',
    ao: 'AO',
    serial_232: '232',
    serial_422: '422',
    serial_485: '485',
    serial_ttl: 'UART',
    can: 'CAN',
    udp: 'UDP',
    tcp_client: 'TCPC',
    tcp_server: 'TCPS',
}

let cfg = {
    kind: 'topology',
    left_tools,
    right_tools,
    headers,
    intf_types,
    intf_alias,
}

export default cfg;