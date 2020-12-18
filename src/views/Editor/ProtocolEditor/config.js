let left_tools = [{
  id: 'prot_1',
  text: '复制并粘贴',
  value: 'duplicate',
  icon: 'mdi-content-duplicate'
}, {
  id: 'prot_2',
  text: '撤销',
  value: 'undo',
  icon: 'mdi-undo'
}, {
  id: 'prot_3',
  text: '恢复',
  value: 'redo',
  icon: 'mdi-redo',
}, {
  id: 'prot_4',
  text: '显示100%',
  value: 'zoom_fit',
  icon: 'mdi-magnify-scan'
}, {
  id: 'prot_5',
  text: '放大',
  value: 'zoom_big',
  icon: 'mdi-magnify-plus'
}, {
  id: 'prot_6',
  text: '缩小',
  value: 'zoom_small',
  icon: 'mdi-magnify-minus',
}, ];

let right_tools = [{
  id: 'prot_7',
  text: '协议打包/解包测试',
  value: 'prot_test',
  icon: 'mdi-package-variant-closed'
}, {
  id: 'prot_8',
  text: 'ETL代码编辑',
  value: 'etl_code',
  icon: 'mdi-code-json'
}];


let cfg = {
  kind: 'protocol',
  left_tools,
  right_tools,
}

export default cfg;