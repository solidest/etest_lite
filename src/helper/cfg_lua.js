

const cfg = {
    kind: 'lua',
    bar_items: [{
            text: '注释',
            value: 'd_comment',
            icon: 'mdi-alphabetical-variant-off'
        }, {
            text: '取消注释',
            value: 'd_uncomment',
            icon: 'mdi-alphabetical-variant'
        }, {
            text: '剪切',
            value: 'd_cut',
            icon: 'mdi-content-cut',
        }, {
            text: '复制',
            value: 'd_copy',
            icon: 'mdi-content-copy',
        }, {
            text: '粘贴',
            value: 'd_paste',
            icon: 'mdi-content-paste'
        }, {
            text: '撤销',
            value: 'undo',
            icon: 'mdi-undo',
        }, {
            text: '恢复',
            value: 'redo',
            icon: 'mdi-redo',
        }, {
            text: '执行',
            value: 'a_play',
            icon: 'mdi-play',
        }, {
            text: '停止',
            value: 'a_stop',
            icon: 'mdi-stop',
        }
    ],
    icon: 'mdi-script-outline',
}
export default cfg