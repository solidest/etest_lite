let left_tools = [ {
  text: '拷贝',
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
  text: 'ETL代码编辑',
  value: 'etl_code',
  icon: 'mdi-code-json'
}];

let theme = {
  'blockStyles': {
    "logic_blocks": {
      "colourPrimary": "rgb(91, 128, 165)",
    },
    "loop_blocks": {
      "colourPrimary": "rgb(91, 165, 91)",
    },
    "math_blocks": {
      "colourPrimary": "rgb(91, 103, 165)"
    },
    "text_blocks": {
      "colourPrimary": "rgb(73, 132, 112)"
    },
    "list_blocks": {
      "colourPrimary": "rgb(116, 91, 165)"
    },
    "variable_blocks": {
      "colourPrimary": "rgb(165, 91, 128)"
    },
    "procedure_blocks": {
      "colourPrimary": "rgb(153, 91, 165)"
    }
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#424242',
    'toolboxBackgroundColour': '#212121'
  }
};


let toolbox = `<xml id="toolbox" style="display: none">
  <category name="数据" colour="#FFAB40">
  </category>
  <category name="数组" colour="#78909C">
  </category>
  <category name="逻辑" colour="#BF360C">
  </category>
  <category name="计算" colour="#29B6F6">
  </category>
</xml>`

let cfg = {
  kind: 'script',
  left_tools,
  right_tools,
  theme,
  toolbox
}

export default cfg;