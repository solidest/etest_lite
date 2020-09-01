const cfg = {

    dict: {
        protocol: '通信协议',
        topology: '连接拓扑',
        device: '设备接口',
        libs: '共享程序',
        simu: '仿真模型',
        run: '执行用例',
        dir: '目录'
    },

    file_icons: {
        run: 'mdi-play',
        protocol: 'mdi-comment-processing-outline',
        topology: 'mdi-link-variant',
        device: 'mdi-developer-board',
        libs: 'mdi-map-outline',
        xtra: 'mdi-card-bulleted-settings-outline',
        simu: 'mdi-puzzle',
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

}
export default cfg