const cfg = {
    kind: 'lua',
    default_check: function () {
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
    default_pack: function () {
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
    default_unpack: function () {
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
    default_recvfilter: function () {
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
    bar_items: [ {}, {
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