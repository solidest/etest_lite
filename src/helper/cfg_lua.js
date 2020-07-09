const cfg = {
    kind: 'lua',
    default_option: function () {
        return {
            lib: false,
            type: 'normal',
            rt_cycle: 1000,
            topology: '',
            panel: '',
            vars: '',
            vars_obj: {}
        }
    },
    default_script: function () {
        return [
            '',
            '-- entry: ETestDev执行用例入口函数 ',
            '-- @vars: 输入参数, @option: 自定义选项',
            'function entry(vars, option)',
            '\t',
            '\t',
            'end',
        ].join('\n');
    },
    bar_items: [{
        text: '执行',
        value: 'a_play',
        icon: 'mdi-play',
    }, {
        text: '停止',
        value: 'a_stop',
        icon: 'mdi-stop',
    }, {
        text: '执行设置',
        value: 'setting',
        icon: 'mdi-cog-clockwise',
        widgets: [{
                name: 'lib',
                type: 'checkbox',
                cols: 12,
                label: '设为共享库',
            },
            {
                name: 'topology',
                type: 'select',
                cols: 6,
                items: [],
                label: '拓扑连接',
                visual: (data) => !data.lib,
            },
            {
                name: 'panel',
                type: 'select',
                cols: 6,
                items: [],
                label: '监控面板',
                visual: (data) => !data.lib,
            },
            {
                name: 'type',
                type: 'select',
                cols: 6,
                items: [{
                        text: '普通',
                        value: 'normal'
                    },
                    {
                        text: '实时(自动)',
                        value: 'rt_auto'
                    }, {
                        text: '实时(CPU优化)',
                        value: 'rt_cpu'
                    }, {
                        text: '实时(内存优化)',
                        value: 'rt_memory'
                    },
                ],
                label: '执行方式',
                visual: (data) => !data.lib,
            },
            {
                name: 'rt_cycle',
                type: 'select',
                cols: 6,
                label: '实时调度周期(us)',
                items: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
                visual: (data) => (!data.lib && (['rt_auto', 'rt_cpu', 'rt_memory'].includes(data.type)))
            },
            {
                name: 'vars',
                type: 'editor',
                cols: 12,
                label: '输入参数:',
                visual: (data) => !data.lib,
            }
        ],
    }, {}, {
        text: '查找',
        value: 'find',
        icon: 'mdi-text-box-search-outline'
    }, {
        text: '打开/关闭注释',
        value: 'comment',
        icon: 'mdi-alphabetical-variant-off'
    }, {
        text: '剪切',
        value: 'cut',
        icon: 'mdi-content-cut',
    }, {
        text: '复制',
        value: 'copy',
        icon: 'mdi-content-copy',
    }, {
        text: '粘贴',
        value: 'paste',
        icon: 'mdi-content-paste'
    }, {
        text: '撤销',
        value: 'undo',
        icon: 'mdi-undo',
    }, {
        text: '恢复',
        value: 'redo',
        icon: 'mdi-redo',
    }, ],
    icon: 'mdi-script-text-outline',
}
export default cfg