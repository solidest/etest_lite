let left_tools = [ {
  text: '复制并粘贴',
  value: 'duplicate',
  icon: 'mdi-content-duplicate'
}, {
  text: '撤销',
  value: 'undo',
  icon: 'mdi-undo'
}, {
  text: '恢复',
  value: 'redo',
  icon: 'mdi-redo',
}, {
  text: '显示100%',
  value: 'zoom_fit',
  icon: 'mdi-magnify-scan'
}, {
  text: '放大',
  value: 'zoom_big',
  icon: 'mdi-magnify-plus'
}, {
  text: '缩小',
  value: 'zoom_small',
  icon: 'mdi-magnify-minus',
}, ];

let right_tools = [{
  text: '协议打包/解包测试',
  value: 'prot_test',
  icon: 'mdi-package-variant-closed'
},{
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