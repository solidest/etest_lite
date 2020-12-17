const cfg = {
    proj_modules: [{
        icon: 'mdi-file-tree-outline',
        title: '资源管理器',
        catalog: 'program',
        subbar: true,
        route: 'SrcTree'
    }, {
        icon: 'mdi-monitor-edit',
        title: '应用设计器',
        catalog: 'panel',
        route: 'PanelDesigner'
    }, {
        icon: 'mdi-cog-outline',
        title: '运行时设置',
        catalog: 'setting',
    }],

    pub_modules: [{
        icon: 'mdi-view-sequential',
        title: '项目管理',
        catalog: 'projlist',
        route: 'ListProj',
    }, {
        icon: 'mdi-view-dashboard-outline',
        title: '复用资源管理',
        catalog: 'reused',
        route: 'ListReused',
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        catalog: 'tools',
        route: 'ToolsBox',
    }, ]
}
export default cfg