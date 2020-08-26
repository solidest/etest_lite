const cfg = {
    proj_modules: [{
        icon: 'mdi-animation-play-outline',
        title: '资源管理',
        catalog: 'program',
        subbar: true,
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        catalog: 'tools',
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
    }, ]
}
export default cfg