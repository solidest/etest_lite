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
        text: '添加 widgets',
        value: 'd_new_widgets',
        icon: 'mdi-table-large-plus'
    }, {
        text: '添加 chart',
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
    default_layout: [{
            "x": 0,
            "y": 0,
            "w": 8,
            "h": 22,
            "i": "0",
            kind: "widgets",
            title: "Widgets Sub Panel",
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
                                foreground: 'red',
                                background: 'white'
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
                        command_key: 'seg_slider',
                        record_key: 'seg_slider',
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
                },
                {
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
                }, {
                    type: 'e-radio',
                    config: {
                        command_key: 'seg_combobox',
                        record_key: 'seg_combobox',
                        cols: 12,
                        label: 'combobox',
                        items: [{
                            text: '选项1',
                            value: 1
                        }, {
                            text: '选项2',
                            value: 2
                        }]
                    }
                }


            ]
        },
        {
            "x": 8,
            "y": 0,
            "w": 16,
            "h": 22,
            "i": "1",
            kind: "chart",
            title: "Chart Panel"
        }
    ],
}
export default cfg