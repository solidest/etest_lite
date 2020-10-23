const {
    app
} = require('electron');

const db_path = app.getPath('userData');

const default_src = [{
    id: 'PG',
    name: '执行用例',
    kind: 'dir',
    fixed: true,
    actions: ['new_item', 'new_dir'],
    catalog: 'run',
    children: []
}, {
    id: 'SM',
    name: '仿真模型',
    kind: 'dir',
    fixed: true,
    actions: ['new_item'],
    catalog: 'simu',
    children: []
}, {
    id: 'LB',
    name: '脚本库',
    kind: 'dir',
    fixed: true,
    actions: ['new_item'],
    catalog: 'libs',
    children: []
}, {
    id: 'EN',
    name: '环境配置',
    kind: 'dir',
    fixed: true,
    actions: [],
    catalog: 'env',
    children: [{
        id: 'PT',
        name: '通信协议',
        kind: 'dir',
        fixed: true,
        actions: ['new_item'],
        catalog: 'protocol',
        children: []
    }, {
        id: 'TP',
        name: '连接拓扑',
        kind: 'dir',
        fixed: true,
        actions: ['new_item'],
        catalog: 'topology',
        children: []
    }, {
        id: 'DV',
        name: '设备接口',
        kind: 'dir',
        fixed: true,
        actions: ['new_item'],
        catalog: 'device',
        children: []
    }, {
        id: 'XA',
        name: '高级定制',
        kind: 'xtra',
        fixed: true,
        actions: [],
        catalog: 'xtra',
        children: []
    }]
}, ]

module.exports = {
    db_path,
    default_src,
}