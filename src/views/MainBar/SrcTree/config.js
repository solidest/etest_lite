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