
const cfg = {
    pages: [{
        icon: 'mdi-file-multiple-outline',
        title: '测试用例',
        catalog: 'program',
        type: 'tree',
    }, {
        icon: 'mdi-chart-bell-curve-cumulative',
        title: '监控面板',
        catalog: 'panel',
        type: 'list',
        file_icon: 'mdi-chart-line-variant',
    }, {
        icon: 'mdi-comment-processing-outline',
        title: '通信协议',
        catalog: 'protocol',
        type: 'list',
        file_icon: 'mdi-message-outline',
    }, {
        icon: 'mdi-developer-board',
        title: '设备接口',
        catalog: 'device',
        type: 'list',
        file_icon: 'mdi-dev-to'
    }, {
        icon: 'mdi-link-variant',
        title: '连接拓扑',
        catalog: 'topology',
        type: 'list',
        file_icon: 'mdi-link'
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        catalog: 'tools',
        type: 'items'
    }, {
        icon: 'mdi-cog-outline',
        title: '项目设置',
        catalog: 'project',
        type: 'items'
    }],

    list_bars: [{
        text: '新建文件',
        value: 'new_file',
        icon: 'mdi-file-plus-outline'
    }, {
        text: '修改名称',
        value: 're_name',
        icon: 'mdi-pencil'
    }, {
        text: '删除选中项',
        value: 'del_item',
        icon: 'mdi-delete-outline'
    }],

    tree_bars: [{
        text: '新建目录',
        value: 'new_dir',
        disabled: false,
        icon: 'mdi-folder-plus-outline',
    }, {
        text: '新建模型',
        value: 'new_model',
        disabled: false,
        icon: 'mdi-vector-polyline-plus'
    }, {
        text: '新建动作序列',
        value: 'new_actions',
        disabled: false,
        icon: 'mdi-playlist-plus'
    }, {
        text: '新建脚本',
        value: 'new_script',
        disabled: false,
        icon: 'mdi-file-plus-outline'
    }, {
        text: '修改名称',
        value: 're_name',
        disabled: false,
        icon: 'mdi-pencil'
    }, {
        text: '删除选中项',
        value: 'del_item',
        disabled: false,
        icon: 'mdi-delete-outline'
    }],
}
export default cfg
