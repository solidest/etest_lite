let left_tools = [{
        text: '选择设备',
        value: 'select_dev',
        icon: 'mdi-help-network-outline'
    }, {
        text: '添加网络/总线',
        value: 'new_bus',
        icon: 'mdi-card-plus-outline'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, {
        text: '运行时绑定',
        icon: 'mdi-cog-clockwise',
        value: 'binding',
    }, {
        text: '锁定/编辑',
        value: 'lock_edit',
        icon: 'mdi-pencil-lock-outline'
    }];

let right_tools = [{
    text: 'ETL代码编辑',
    value: 'etl_code',
    icon: 'mdi-code-json'
}];

let cfg = {
    kind: 'topology',
    left_tools,
    right_tools,
}

export default cfg;