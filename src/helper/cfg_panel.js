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
        text: '添加图标子面板',
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
            text: '文本框',
            value: 'e-text'
        },
        {
            text: '数字框',
            value: 'e-number'
        },
    ],
    default_layout: [{
            "x": 0,
            "y": 0,
            "w": 8,
            "h": 15,
            "i": "0",
            kind: "widgets",
            title: "Widgets Sub Panel1",
            items: [{
                type: 'e-button',
                config: {
                    command: 'cmd_name',
                    label: 'button',
                    cols: 12
                }
            }, {
                type: 'e-lamp',
                config: {
                    command_key: 'seg_lamp',
                    record_key: 'seg_lamp',
                    label: 'lamp',
                    cols: 12,
                    items: [{
                            value: null,
                            foreground: 'white',
                            background: 'grey',
                            icon: 'mdi-lock'
                        },
                        {
                            value: 1,
                            foreground: 'white',
                            background: 'red',
                            icon: 'mdi-lock-open-variant'
                        }
                    ]
                }
            }, {
                type: 'e-label',
                config: {
                    command_key: 'seg_label',
                    record_key: 'seg_label',
                    label: 'label: ',
                    cols: 12
                }
            }, {
                type: 'e-slider',
                config: {
                    command_key: 'seg_slider.x',
                    record_key: 'seg_slider.x',
                    label: 'slider: ',
                    max: 120,
                    min: 20,
                    cols: 12
                }
            }, {
                type: 'e-checkbox',
                config: {
                    command_key: 'seg_checkbox',
                    record_key: 'seg_checkbox',
                    label: 'checkbox',
                    cols: 12
                }
            }, {
                type: 'e-switch',
                config: {
                    command_key: 'seg_switch',
                    record_key: 'seg_switch',
                    label: 'switch',
                    cols: 12
                }
            }, {
                type: 'e-radio',
                config: {
                    command_key: 'seg_radio',
                    record_key: 'seg_radio',
                    cols: 12,
                    label: 'radio',
                    items: [{
                        text: '选项1',
                        value: 1
                    }, {
                        text: '选项2',
                        value: 2
                    }]
                }
            }]
        },
        {
            "x": 8,
            "y": 0,
            "w": 16,
            "h": 15,
            "i": "1",
            kind: "widgets",
            title: "Widgets Sub Panel2",
            items: [{
                    type: 'e-text',
                    config: {
                        command_key: 'seg_text',
                        record_key: 'seg_text',
                        placeholder: '请输入信息',
                        label: 'text: ',
                        cols: 12
                    }
                },
                {
                    type: 'e-textarea',
                    config: {
                        command_key: 'seg_textarea',
                        record_key: 'seg_textarea',
                        placeholder: '请输入信息',
                        label: 'textarea: ',
                        cols: 12,
                        rows: 6,
                    }
                },
                {
                    type: 'e-number',
                    config: {
                        command_key: 'seg_number',
                        record_key: 'seg_number',
                        placeholder: '请输入数字',
                        label: 'number: ',
                        cols: 12
                    }
                },
                {
                    type: 'e-select',
                    config: {
                        command_key: 'seg_select',
                        record_key: 'seg_select',
                        cols: 12,
                        label: 'select',
                        items: ['opt1', 'opt2']
                    }
                }, {
                    type: 'e-combobox',
                    config: {
                        command_key: 'seg_combobox',
                        record_key: 'seg_combobox',
                        cols: 12,
                        label: 'combobox',
                        items: ['opt1', 'opt2']
                    }
                }
            ]
        }
    ],
    items_default: {
        'e-lamp': '- value: null\n  foreground: white\n  background: grey\n  icon: mdi-lock',
        'e-radio': '- value: 1\n  text: 选项1\n- value: 2\n  text:选项2',
        'e-select': '- value: 1\n  text: 选项1\n- value: 2\n  text:选项2',
        'e-combobox': '- value: 1\n  text: 选项1\n- value: 2\n  text:选项2',
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
                name: 'cmd_name',
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