let left_tools = [{
        text: '选择设备',
        value: 'select_dev',
        icon: 'mdi-help-network-outline'
    },  {
        text: '添加网络/总线',
        value: 'new_bus',
        icon: 'mdi-shape-circle-plus'
    }, {
        text: '切换连线样式',
        value: 'link_type',
        icon: 'mdi-vector-line'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    },  {
        text: '自适应大小',
        value: 'zoom_fit',
        icon: 'mdi-magnify-scan'
    },  {
        text: '放大',
        value: 'zoom_big',
        icon: 'mdi-magnify-plus'
    }, {
        text: '缩小',
        value: 'zoom_small',
        icon: 'mdi-magnify-minus',
    }, {
        text: '运行时绑定',
        icon: 'mdi-cog-clockwise',
        value: 'binding',
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