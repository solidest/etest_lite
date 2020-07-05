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
            value: 'e-button'
        },
        {
            text: '文字显示',
            value: 'e-label'
        },
        {
            text: '状态指示',
            value: 'e-lamp'
        },
        {
            text: '文字输入',
            value: 'e-text'
        },
        {
            text: '多行文本输入',
            value: 'e-textarea'
        },
        {
            text: '数字输入',
            value: 'e-number'
        },
        {
            text: '开关按钮',
            value: 'e-switch'
        },
        {
            text: '复选框',
            value: 'e-checkbox'
        },
        {
            text: '单选框',
            value: 'e-radio'
        },
        {
            text: '下拉选择',
            value: 'e-select'
        },
        {
            text: '复合选择',
            value: 'e-combobox'
        },
        {
            text: '滑块',
            value: 'e-slider'
        }
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
            
        },'e-slider': {
            command_key: '',
            record_key: '',
            label: '滑块',
            max: 100,
            min: 0,
            cols: 12
        }
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
    }
}
export default cfg