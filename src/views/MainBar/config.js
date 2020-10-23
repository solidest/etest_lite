const cfg = {
    proj_modules: [{
        icon: 'mdi-file-tree-outline',
        title: '资源管理器',
        catalog: 'program',
        subbar: true,
        route: 'SrcTree'
    }, {
        icon: 'mdi-monitor-edit',
        title: '面板设计器',
        catalog: 'panel',
        subbar: true,
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
        title: '复用库管理',
        catalog: 'reused',
        route: 'ListPublic',
    }, {
        icon: 'mdi-tools',
        title: '辅助工具',
        catalog: 'tools',
        subbar: true,
    }, ]
}
export default cfg