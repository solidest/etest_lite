
let left_tools = [{
        text: '向后添加接口',
        value: 'new_item_after',
        icon: 'mdi-table-row-plus-after'
    }, {
        text: '向前添加接口',
        value: 'new_item_before',
        icon: 'mdi-table-row-plus-before'
    }, {
        text: '上移',
        value: 'move_up',
        icon: 'mdi-arrow-up'
    }, {
        text: '下移',
        value: 'move_down',
        icon: 'mdi-arrow-down'
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
        text: '批量粘贴',
        value: 'paste_batch',
        icon: 'mdi-view-grid-plus'
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
        value: 'remove',
        icon: 'mdi-delete-outline'
    },{
        text: '单选/多选',
        value: 'toggle_select',
        icon: 'mdi-check-all'
    },  ];

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