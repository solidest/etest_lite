let left_tools = [{
        id: 'topo_1',
        text: '选择设备',
        value: 'select_dev',
        icon: 'mdi-help-network-outline'
    },  {
        id: 'topo_2',
        text: '添加网络/总线',
        value: 'new_bus',
        icon: 'mdi-shape-circle-plus'
    }, {
        id: 'topo_3',
        text: '切换连线样式',
        value: 'link_type',
        icon: 'mdi-vector-line'
    }, {
        id: 'topo_4',
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo'
    }, {
        id: 'topo_5',
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    },  {
        id: 'topo_6',
        text: '显示100%',
        value: 'zoom_fit',
        icon: 'mdi-magnify-scan'
    },  {
        id: 'topo_7',
        text: '放大',
        value: 'zoom_big',
        icon: 'mdi-magnify-plus'
    }, {
        id: 'topo_8',
        text: '缩小',
        value: 'zoom_small',
        icon: 'mdi-magnify-minus',
    }, {
        id: 'topo_9',
        text: '运行时绑定',
        icon: 'mdi-cog-clockwise',
        value: 'binding',
    }];

let right_tools = [{
    id: 'topo_10',
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