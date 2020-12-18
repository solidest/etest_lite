let left_tools = [{
        id: 'dev_1',
        text: '向后添加接口',
        value: 'new_item_after',
        icon: 'mdi-table-row-plus-after'
    }, {
        id: 'dev_2',
        text: '向前添加接口',
        value: 'new_item_before',
        icon: 'mdi-table-row-plus-before'
    }, {
        id: 'dev_3',
        text: '上移',
        value: 'move_up',
        icon: 'mdi-arrow-up'
    }, {
        id: 'dev_4',
        text: '下移',
        value: 'move_down',
        icon: 'mdi-arrow-down'
    }, {
        id: 'dev_5',
        text: '剪切',
        value: 'cut',
        icon: 'mdi-content-cut'
    }, {
        id: 'dev_6',
        text: '复制',
        value: 'copy',
        icon: 'mdi-content-copy'
    }, {
        id: 'dev_7',
        text: '粘贴',
        value: 'paste',
        icon: 'mdi-content-paste'
    }, {
        id: 'dev_8',
        text: '批量粘贴',
        value: 'paste_batch',
        icon: 'mdi-view-grid-plus'
    }, {
        id: 'dev_9',
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        id: 'dev_10',
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, {
        id: 'dev_11',
        text: '删除',
        value: 'remove',
        icon: 'mdi-delete-outline'
    },{
        id: 'dev_12',
        text: '单选/多选',
        value: 'toggle_select',
        icon: 'mdi-check-all'
    },  ];

let right_tools = [{
    id: 'dev_13',
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

import mcfg from '../../config';
const intf_alias = mcfg.intf_alias;

let cfg = {
    kind: 'device',
    left_tools,
    right_tools,
    headers,
    intf_types,
    intf_alias,
}

export default cfg;