const cfg = {

    dict: {
        protocol: '通信协议',
        topology: '连接拓扑',
        device: '设备接口',
        libs: '共享程序',

    },

    file_icons: {
        run: 'mdi-clipboard-play-outline',
        protocol: 'mdi-comment-processing-outline',
        topology: 'mdi-link-variant',
        device: 'mdi-developer-board',
        libs: 'mdi-map-outline',
        xtra: 'mdi-card-bulleted-settings-outline',
    },

    ctx_menus:[{
            icon: 'mdi-file',
            text: '新建项',
            action: 'new_item',
        }, {
            icon: 'mdi-folder-outline',
            text: '新建目录',
            action: 'new_dir',
        }, {
            text: '重命名',
            action: 'rename',
        }, {
            icon: 'mdi-trash-can-outline',
            text: '删除',
            action: 'remove',
        }, {
            text: '加入复用库',
            action: 'resued',
        }, 
        
    ],

    default_src: [{
        id: 'PG',
        name: '执行用例',
        kind: 'dir',
        fixed: true,
        actions: ['new_item', 'new_dir'],
        catalog: 'run',
        children: []
    }, {
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
        id: 'LB',
        name: '共享程序',
        kind: 'dir',
        fixed: true,
        actions: ['new_item'],
        catalog: 'libs',
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
}
export default cfg