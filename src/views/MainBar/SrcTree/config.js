const cfg = {

    dict: {
        protocol: '通信协议',
        topology: '连接拓扑',
        device: '设备接口',
        libs: '脚本库',
        simu: '仿真模型',
        run: '执行用例',
        dir: '目录'
    },

    file_icons: {
        PG: 'mdi-play',
        SM: 'mdi-shape',
        LB: 'mdi-script-text',
        EN: 'mdi-folder-cog',
        PT: 'mdi-comment-processing',
        TP: 'mdi-lan',
        DV: 'mdi-network',
        run: 'mdi-play-outline',
        protocol: 'mdi-comment-processing-outline',
        topology: 'mdi-lan-connect',
        device: 'mdi-network-outline',
        libs: 'mdi-script-text-outline',
        xtra: 'mdi-cogs',
        simu: 'mdi-shape-outline',
    },

    ctx_menus: [{
            icon: 'mdi-file',
            text: '新建项',
            action: 'new_item',
        }, {
            icon: 'mdi-folder-outline',
            text: '新建目录',
            action: 'new_dir',
        }, {
            text: '修改',
            action: 'rename',
        }, {
            icon: 'mdi-trash-can-outline',
            text: '删除',
            action: 'remove',
        }, {
            text: '添加至复用库',
            action: 'reused',
        },

    ],
    default_tree: [{
        id: 'PG',
        name: '执行用例',
        kind: 'dir',
        fixed: true,
        default_action: 'new_item',
        actions: ['new_item', 'new_dir'],
        catalog: 'run',
        children: []
    }, {
        id: 'SM',
        name: '仿真模型',
        kind: 'dir',
        fixed: true,
        default_action: 'new_item',
        actions: ['new_item'],
        catalog: 'simu',
        children: []
    }, {
        id: 'LB',
        name: '脚本库',
        kind: 'dir',
        fixed: true,
        default_action: 'new_item',
        actions: ['new_item', 'new_dir'],
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
            default_action: 'new_item',
            actions: ['new_item'],
            catalog: 'protocol',
            children: []
        }, {
            id: 'TP',
            name: '连接拓扑',
            kind: 'dir',
            fixed: true,
            default_action: 'new_item',
            actions: ['new_item'],
            catalog: 'topology',
            children: []
        }, {
            id: 'DV',
            name: '设备接口',
            kind: 'dir',
            fixed: true,
            default_action: 'new_item',
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

}
export default cfg