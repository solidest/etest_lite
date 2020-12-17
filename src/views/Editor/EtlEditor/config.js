let left_tools = [{
    text: '查找',
    value: 'find',
    icon: 'mdi-text-box-search-outline'
}, {
    text: '打开/关闭注释',
    value: 'comment',
    icon: 'mdi-slash-forward'
}, {
    text: '剪切',
    value: 'cut',
    icon: 'mdi-content-cut'
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
    text: '定位行',
    value: 'goto_line',
    icon: 'mdi-console-line'
}, ];

let right_tools = [{
    text: '可视化编辑',
    value: 'visual_edit',
    icon: 'mdi-table-edit'
}];


let cfg = {
    left_tools,
    right_tools,
}

export default cfg;