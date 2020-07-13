const default_guage = {

    series: [{
        min: 0,
        max: 220,
        splitNumber: 11,
        radius: '80%',
        axisLine: {
            lineStyle: {
                color: [
                    [0.09, 'lime'],
                    [0.82, '#1e90ff'],
                    [1, '#ff4500']
                ],
                width: 3,
                shadowColor: '#fff',
                shadowBlur: 10
            }
        },
        axisLabel: {
            fontWeight: 'bolder',
            color: '#fff',
            shadowColor: '#fff',
            shadowBlur: 10
        },
        axisTick: {
            length: 15,
            lineStyle: {
                color: 'auto',
                shadowColor: '#fff',
                shadowBlur: 10
            }
        },
        splitLine: {
            length: 25,
            lineStyle: {
                width: 3,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
            }
        },
        pointer: {
            shadowColor: '#fff',
            shadowBlur: 5
        },
        title: {
            textStyle: {
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
            }
        },
        detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff',
            shadowBlur: 5,
            offsetCenter: [0, '50%'],
            textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
            }
        },
        // data: [{
        //     value: 40,
        //     name: 'km/h'
        // }]
    }]
};

const default_line = {
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },
    series: [{
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        // data: data
    }]
};

const default_scatter =  {
    xAxis: {
        scale: true
    },
    yAxis: {
        scale: true
    },
    series: [{
        type: 'effectScatter',
        symbolSize: 8,
        data: [
            [172.7, 105.2],
            [153.4, 42]
        ]
    }]
};

const cfg = {
    kind: 'panel',
    icon: 'mdi-chart-line-variant',
    col_num: 24,
    row_height: 30,
    margin: [10, 10],
    bar_items: [{
        text: '显示/隐藏属性设置',
        value: 'd_show_hide_cfg',
        icon: 'mdi-iframe-array-outline',
    }, {
        text: '添加部件子面板',
        value: 'd_new_widgets',
        icon: 'mdi-table-large-plus'
    }, {
        text: '添加图形子面板',
        value: 'd_new_chart',
        icon: 'mdi-image-plus'
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
        text: '删除',
        value: 'del_item',
        icon: 'mdi-delete-outline'
    }, ],
    new_types: [{
            text: '按钮',
            value: 'e-button',
            kind: 'widgets'
        },
        {
            text: '文字显示',
            value: 'e-label',
            kind: 'widgets'
        },
        {
            text: '状态指示',
            value: 'e-lamp',
            kind: 'widgets'
        },
        {
            text: '文字输入',
            value: 'e-text',
            kind: 'widgets'
        },
        {
            text: '多行文本输入',
            value: 'e-textarea',
            kind: 'widgets'
        },
        {
            text: '数字输入',
            value: 'e-number',
            kind: 'widgets'
        },
        {
            text: '开关按钮',
            value: 'e-switch',
            kind: 'widgets'
        },
        {
            text: '复选框',
            value: 'e-checkbox',
            kind: 'widgets'
        },
        {
            text: '单选框',
            value: 'e-radio',
            kind: 'widgets'
        },
        {
            text: '下拉选择',
            value: 'e-select',
            kind: 'widgets'
        },
        {
            text: '复合选择',
            value: 'e-combobox',
            kind: 'widgets'
        },
        {
            text: '滑块',
            value: 'e-slider',
            kind: 'widgets'
        },
        {
            text: '仪表盘',
            value: 'e-gauge',
            kind: 'charts'
        },
        {
            text: '曲线',
            value: 'e-line',
            kind: 'charts'
        },
        {
            text: '散点',
            value: 'e-scatter',
            kind: 'charts'
        },
    ],
    default_item: {
        'e-button': {
            command: 'COMMAND_NAME',
            label: 'button',
            cols: 12
        },
        'e-lamp': {
            command_key: '',
            record_key: '',
            label: '状态指示说明',
            cols: 12,
            option_code: '',
            items: [],
        },
        'e-label': {
            command_key: '',
            record_key: '',
            label: '文字显示标题',
            cols: 12,
        },
        'e-text': {
            command_key: '',
            record_key: '',
            placeholder: '请输入',
            label: '文字输入',
            cols: 12
        },
        'e-textarea': {
            command_key: '',
            record_key: '',
            placeholder: '请输入',
            label: '多行文本',
            cols: 12,
            rows: 6,
        },
        'e-number': {
            command_key: '',
            record_key: '',
            placeholder: '请输入数字',
            label: '数字输入',
            cols: 12
        },
        'e-checkbox': {
            command_key: '',
            record_key: '',
            label: '复选框',
            cols: 12
        },
        'e-switch': {
            command_key: '',
            record_key: '',
            label: '开关',
            cols: 12
        },
        'e-radio': {
            command_key: '',
            record_key: '',
            cols: 12,
            label: '单选按钮',
            option_code: '',
            items: [],
        },
        'e-select': {
            command_key: '',
            record_key: '',
            cols: 12,
            label: '下拉选择',
            option_code: '',
            items: [],

        },
        'e-combobox': {
            command_key: '',
            record_key: '',
            cols: 12,
            label: '复合选择',
            option_code: '',
            items: [],

        },
        'e-slider': {
            command_key: '',
            record_key: '',
            label: '滑块',
            max: 100,
            min: 0,
            cols: 12
        },
        'e-gauge': {
            record_key: '',
            label: '仪表盘标题',
            option_code: '',
        },
        'e-line': {
            x_record_key: '',
            y_record_key: '',
            label: '曲线标题',
            option_code: '',
        },
        'e-scatter': {
            x_record_key: '',
            y_record_key: '',
            label: '散点标题',
            option_code: '',
        },
    },
    items_default: {
        'e-lamp': [{
            value: null,
            foreground: 'white',
            background: 'grey',
            icon: 'mdi-lock'
        }, {
            value: 1,
            foreground: 'red',
            background: 'white',
            icon: 'mdi-lock-open'
        }],
        'e-radio': [{
            value: 1,
            text: '选项1'
        }, {
            value: 2,
            text: '选项2'
        }],
        'e-select': [{
            value: 1,
            text: '选项1'
        }, {
            value: 2,
            text: '选项2'
        }],
        'e-combobox': ['选项1', '选项2'],
        'e-gauge': default_guage,
        'e-line': default_line,
        'e-scatter': default_scatter,
    },
    config_editor: {
        'e-button': [{
                name: 'label',
                type: 'text',
                cols: 8,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 4,
                label: '宽'
            },
            {
                name: 'command',
                type: 'text',
                cols: 12,
                label: '命令'
            },
        ],
        'e-lamp': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-label': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-slider': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
            {
                name: 'max',
                type: 'number',
                cols: 6,
                label: '最大值'
            },
            {
                name: 'min',
                type: 'number',
                cols: 6,
                label: '最小值'
            },
        ],
        'e-checkbox': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-switch': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-radio': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-text': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'placeholder',
                type: 'text',
                cols: 12,
                label: '为空时提示'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-textarea': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 3,
                label: '宽'
            },
            {
                name: 'rows',
                type: 'number',
                cols: 3,
                label: '行数'
            },
            {
                name: 'placeholder',
                type: 'text',
                cols: 12,
                label: '为空时提示'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-number': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-select': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-combobox': [{
                name: 'label',
                type: 'text',
                cols: 6,
                label: '标题'
            },
            {
                name: 'cols',
                type: 'number',
                cols: 6,
                label: '宽'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 6,
                label: '记录key'
            },
            {
                name: 'command_key',
                type: 'text',
                cols: 6,
                label: '命令key'
            },
        ],
        'e-gauge': [{
                name: 'label',
                type: 'text',
                cols: 12,
                label: '标题'
            },
            {
                name: 'record_key',
                type: 'text',
                cols: 12,
                label: '记录key'
            },
        ],
        'e-line': [{
                name: 'label',
                type: 'text',
                cols: 12,
                label: '标题'
            },
            {
                name: 'x_record_key',
                type: 'text',
                cols: 6,
                label: 'X轴记录key'
            },
            {
                name: 'y_record_key',
                type: 'text',
                cols: 6,
                label: 'Y轴命令key'
            },
        ],
        'e-scatter': [{
                name: 'label',
                type: 'text',
                cols: 12,
                label: '标题'
            },
            {
                name: 'x_record_key',
                type: 'text',
                cols: 6,
                label: 'X轴记录key'
            },
            {
                name: 'y_record_key',
                type: 'text',
                cols: 6,
                label: 'Y轴命令key'
            },
        ]
    }
}
export default cfg