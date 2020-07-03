const cfg = {
    kind: 'panel',
    icon: 'mdi-chart-line-variant',
    col_num: 24,
    row_height: 30,
    margin: [10, 10],
    default_layout: [{
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 10,
        "i": "0",
        kind: "widgets",
        title: "Widgets Panel",
        items: [
            {command_key: 'demo1', record_key: 'demo1', type: 'text', cols: 12, label: 'text'},
            {command_key: 'demo2', record_key: 'demo2', type: 'number', cols: 12, label: 'number'},
            {command_key: 'demo3', record_key: 'demo3', type: 'select', cols: 12, label: 'select', items: ['opt1', 'opt2']},
            {command_key: 'demo4', record_key: 'demo4', type: 'combobox', cols: 12, label: 'combobox', items: ['opt1', 'opt2', 'opt3']},
            {command_key: 'demo6', record_key: 'demo5', type: 'label', label: 'label: ', cols: 6},
            {command_key: 'demo5', record_key: 'demo6', type: 'checkbox', cols: 6, label: 'checkbox'},
        ]
    },
    {
        "x": 12,
        "y": 0,
        "w": 12,
        "h": 10,
        "i": "1",
        kind: "chart",
        title: "Chart Panel"
    }],
    bar_items: [{
        text: '显示/隐藏属性设置',
        value: 'd_show_hide_cfg',
        icon: 'mdi-iframe-array-outline',
    }, {
        text: '添加widgets',
        value: 'new_panel',
        icon: 'mdi-table-large-plus'
    }, {
        text: '添加chart',
        value: 'new_item_before',
        icon: 'mdi-image-plus'
    }, {
        text: '设置初始值',
        value: 'd_set_initdata',
        icon: 'mdi-database-edit'
    }, {
        text: '复制',
        value: 'copy',
        icon: 'mdi-content-copy'
    }, {
        text: '粘贴',
        value: 'paste',
        icon: 'mdi-content-paste'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, {
        text: '删除',
        value: 'del_item',
        icon: 'mdi-delete-outline'
    }, ],
}
export default cfg