const simple_bar = [{
    icon: 'mdi-file-plus-outline',
    tip: '新建',
    action: 'do_new',
}, {
    icon: 'mdi-trash-can-outline',
    tip: '删除',
    action: 'do_del',
}, {
    icon: 'mdi-arrow-up-down',
    tip: '展开/收起',
    action: 'do_packup',
    to_parent: true
}, ];

const ctx_menus = [{
    icon: 'mdi-file-plus-outline',
    text: '新建',
    action: 'do_new',
}, {
    icon: 'mdi-trash-can-outline',
    text: '删除',
    action: 'do_del',
}, {
    icon: 'mdi-arrow-up-down',
    text: '展开/收起',
    action: 'do_packup',
}, ];

const cfg = {
    list_pages: [{
        icon: 'mdi-play-box-multiple-outline',
        title: '执行用例',
        catalog: 'program',
        widget: 'e-subpanel-tree',
        file_icon: 'mdi-map-outline',
        simplebar: [{
            icon: 'mdi-file-plus-outline',
            tip: '新建',
            action: 'do_new',
            children: [{
                icon: 'mdi-file-outline',
                text: '新建用例',
                action: 'do_new_file'
            }, {
                icon: 'mdi-folder-outline',
                text: '新建目录',
                action: 'do_new_dir'
            }]
        }, {
            icon: 'mdi-trash-can-outline',
            tip: '删除',
            action: 'do_del',
        }, {
            icon: 'mdi-arrow-up-down',
            tip: '展开/收起',
            action: 'do_packup',
            to_parent: true
        }, ],
        ctx_menus: ctx_menus,
    }, {
        icon: 'mdi-comment-processing-outline',
        title: '通信协议',
        catalog: 'protocol',
        widget: 'list',
        file_icon: 'mdi-message-outline',
        simplebar: simple_bar,
        ctx_menus: ctx_menus,
    }, {
        icon: 'mdi-link-variant',
        title: '连接拓扑',
        catalog: 'topology',
        widget: 'list',
        file_icon: 'mdi-link-box-variant-outline',
        simplebar: simple_bar,
        ctx_menus: ctx_menus,
    }, {
        icon: 'mdi-developer-board',
        title: '设备接口',
        catalog: 'device',
        widget: 'list',
        file_icon: 'mdi-dev-to',
        simplebar: simple_bar,
        ctx_menus: ctx_menus,
    }, {
        icon: 'mdi-map-outline',
        title: '共享程序',
        catalog: 'libs',
        widget: 'list',
        file_icon: 'mdi-map-outline',
        simplebar: simple_bar,
        ctx_menus: ctx_menus,
    }, {
        icon: 'mdi-card-bulleted-settings-outline',
        title: '高级设置',
        catalog: 'advanced',
        widget: 'list',
        file_icon: 'mdi-dev-to',
    }],
}

export default cfg;