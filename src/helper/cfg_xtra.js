const cfg = {
    kind: 'lua',
    default_check: function () {
        return [
            '',
            '-- 输入参数 prot_buff: 协议包原始字节、pos_begin：校验开始字节位置、pos_end：校验结束字节位置',
            '-- 返回值：返回特定长度字符串',
            'function My_xor8(prot_buff, pos_begin, pos_end)',
            '\tlocal res = 0',
            '\tfor i=pos_begin, pos_end do',
            '\t\tres = res ~ string.byte(prot_buff, i)',
            '\tend',
            '\treturn string.format("%02X", res)',
            'end',
        ].join('\n');
    },
    default_pack: function () {
        return [
            '',
            '-- 输入参数 seg_name: 协议段名称、seg_value: 协议段值',
            '-- 返回值: 返回打包后的string',
            'function PackFloat_D(seg_name, seg_value)',
            '\tlocal str = string.format("%.5f", seg_value)',
            '\tif seg_name=="WD" then  --注：纬度是最后一个字符串，不需要分割符F',
            '\t\treturn string.gsub(str, "%.", "D")',
            '\telse',
            '\t\treturn string.gsub(str, "%.", "D").."F"',
            '\tend',
            'end'
        ].join('\n');
    },
    default_unpack: function () {
        return [
            '',
            '-- 输入参数 seg_name: 协议段名称、prot_buff：报文原始字节、 pos: 当前解析位置',
            '-- 返回值：必须返回2个值，第1个为解析得到的值，第2个为解析使用的字节长度',
            'function UnpackFloat_D(seg_name, prot_buff, pos)',
            '\tlocal pos_end = pos',
            '\tlocal str = ""',
            '\tif seg_name=="WD" then',
            '\t\tpos_end = string.len(prot_buff)',
            '\t\tstr = string.sub(prot_buff, pos, pos_end)',
            '\telse',
            '\t\tpos_end = string.find(prot_buff, "F", pos)',
            '\t\tstr = string.sub(prot_buff, pos, pos_end-1)',
            '\tend',
            '\tstr = string.gsub(str, "D", ".")',
            '\treturn tonumber(str), pos_end-pos+1',
            'end',
        ].join('\n');
    },
    default_recvfilter: function () {
        return [
            '',
            '-- 自定义接收过滤器'
        ].join('\n');
    },
    bar_items: [{}, {
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