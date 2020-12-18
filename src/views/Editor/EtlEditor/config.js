let left_tools = [{
    id: 'etl_1',
    text: '查找',
    value: 'find',
    icon: 'mdi-text-box-search-outline'
}, {
    id: 'etl_2',
    text: '打开/关闭注释',
    value: 'comment',
    icon: 'mdi-slash-forward'
}, {
    id: 'etl_3',
    text: '剪切',
    value: 'cut',
    icon: 'mdi-content-cut'
}, {
    id: 'etl_4',
    text: '复制',
    value: 'copy',
    icon: 'mdi-content-copy'
}, {
    id: 'etl_5',
    text: '粘贴',
    value: 'paste',
    icon: 'mdi-content-paste'
}, {
    id: 'etl_6',
    text: '撤销',
    value: 'undo',
    icon: 'mdi-undo'
}, {
    id: 'etl_7',
    text: '恢复',
    value: 'redo',
    icon: 'mdi-redo',
}, {
    id: 'etl_8',
    text: '定位行',
    value: 'goto_line',
    icon: 'mdi-console-line'
}, ];

let right_tools = {
    device: [{
        id: 'etl_9',
        text: '可视化编辑',
        value: 'visual_edit',
        icon: 'mdi-table-edit'
    }],
    topology: [{
        id: 'etl_10',
        text: '可视化编辑',
        value: 'visual_edit',
        icon: 'mdi-table-edit'
    }],
    protocol: [{
        id: 'etl_11',
        text: '打包/解包 测试',
        value: 'prot_test',
        icon: 'mdi-package-variant-closed'
    }, {
        id: 'etl_12',
        text: '可视化编辑',
        value: 'visual_edit',
        icon: 'mdi-puzzle'
    }, ],
};


let cfg = {
    left_tools,
    right_tools,
}

export default cfg;