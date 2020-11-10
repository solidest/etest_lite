
import Blockly from '../../../Components/blockly/blockly_compressed';

Blockly.Blocks['protocol'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("协议")
        .appendField(new Blockly.FieldLabelSerializable("prot_xxx"), "prot_name")
        .appendField(": 从")
        .appendField(new Blockly.FieldDropdown([["高比特位","lr"], ["低比特位","rl"]]), "align")
        .appendField("开始");
    this.appendStatementInput("segs")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("解析");
    this.setColour(15);
 this.setTooltip("通信协议定义");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['seg_integer'] = {
  init: function() {
    this.appendValueInput("auto_value")
        .setCheck("Number")
        .appendField("整数")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField(":")
        .appendField(new Blockly.FieldDropdown([["无符号","false"], ["有符号","true"]]), "signed")
        .appendField(new Blockly.FieldNumber(8, 1, 64), "bits")
        .appendField("位,")
        .appendField(new Blockly.FieldDropdown([["小端序","false"], ["大端序","true"]]), "big_order")
        .appendField(",")
        .appendField(new Blockly.FieldDropdown([["补码","complement"], ["反码","inverse"], ["原码","primitive"]]), "encode")
        .appendField(", 自动值为");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("1~64比特位宽的整数");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['seg_real'] = {
  init: function() {
    this.appendValueInput("auto_value")
        .setCheck("Number")
        .appendField("浮点数")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField(":")
        .appendField(new Blockly.FieldDropdown([["单精度","false"], ["双精度","true"]]), "double")
        .appendField(",")
        .appendField(new Blockly.FieldDropdown([["小端序","false"], ["大端序","true"]]), "big_order")
        .appendField(", 自动值为");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("单精度或双精度浮点数");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['seg_string'] = {
  init: function() {
    this.appendValueInput("repeated")
        .setCheck(null)
        .appendField("字节流")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField(":")
        .appendField(new Blockly.FieldDropdown([["字节长度为","length"], ["结束符为","endwith"]]), "len_type");
    this.appendDummyInput()
        .appendField(", 自动值为")
        .appendField(new Blockly.FieldTextInput("''"), "auto_value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("任意字节的数据");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['segments'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("分组")
        .appendField(new Blockly.FieldTextInput("group_xxx"), "seg_name")
        .appendField(":");
    this.appendStatementInput("segs")
        .setCheck(null)
        .appendField("解析");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("多个协议段构成的分组");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['arr_integer'] = {
  init: function() {
    this.appendValueInput("repeated")
        .setCheck("Number")
        .appendField("整数数组")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]:")
        .appendField(new Blockly.FieldDropdown([["无符号","false"], ["有符号","true"]]), "signed")
        .appendField(new Blockly.FieldNumber(1, 1, 64), "bits")
        .appendField("位,")
        .appendField(new Blockly.FieldDropdown([["小端序","false"], ["大端序","true"]]), "bigorder")
        .appendField(",")
        .appendField(new Blockly.FieldDropdown([["补码","complement"], ["反码","inverse"], ["原码","primitive"]]), "encode")
        .appendField(", 自动值为")
        .appendField(new Blockly.FieldTextInput("[ ]"), "autovalue");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("整数数组");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['arr_real'] = {
  init: function() {
    this.appendValueInput("repeated")
        .setCheck(null)
        .appendField("浮点数组")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]:")
        .appendField(new Blockly.FieldDropdown([["单精度","false"], ["双精度","true"]]), "double")
        .appendField(",")
        .appendField(new Blockly.FieldDropdown([["小端序","false"], ["大端序","true"]]), "bigorder")
        .appendField(", 自动值为")
        .appendField(new Blockly.FieldTextInput("[ ]"), "autovalue");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("浮点数数组");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['arr_string'] = {
  init: function() {
    this.appendValueInput("repeated")
        .setCheck(null)
        .appendField("字节流数组")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_name")
        .appendField("[");
    this.appendValueInput("length")
        .setCheck(null)
        .appendField("]:")
        .appendField(new Blockly.FieldDropdown([["字节长度为","length"], ["结尾符为","endwith"]]), "len_type");
    this.appendDummyInput()
        .appendField(", 自动值为")
        .appendField(new Blockly.FieldTextInput("[ ]"), "autovalue");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("任意字节数组");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['arr_segments'] = {
  init: function() {
    this.appendValueInput("repeated")
        .setCheck(null)
        .appendField("分组数组")
        .appendField(new Blockly.FieldTextInput("group_xxx"), "seg_name")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]:");
    this.appendStatementInput("segs")
        .setCheck(null)
        .appendField("解析");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
 this.setTooltip("协议段分组数组");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['seg_custom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("自定义")
        .appendField(new Blockly.FieldTextInput("seg_xxx"), "seg_nage")
        .appendField(": 使用")
        .appendField(new Blockly.FieldDropdown([["unpack_fn1","fn1"], ["unpack_fn2","fn2"], ["unpack_fn3","fn3"]]), "unpack_fn")
        .appendField("解包, 使用")
        .appendField(new Blockly.FieldDropdown([["pack_fn1","fn1"], ["pack_fn2","fn2"], ["pack_fn3","fn3"]]), "pack_fn")
        .appendField("打包");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(135);
 this.setTooltip("自定义解析");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['bytesize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("取")
        .appendField(new Blockly.FieldDropdown([["this","this"], ["this.seg_x1","this.seg_x1"], ["this.seg_x2","this.seg_x2"]]), "sizeof_seg")
        .appendField("的字节长度");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("取字节长度");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['checkcode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("用")
        .appendField(new Blockly.FieldDropdown([["CRC8","crc8"], ["CRC16","crc16"], ["CRC32","crc32"]]), "check_type")
        .appendField("计算从")
        .appendField(new Blockly.FieldDropdown([["this.seg1","this.seg1"], ["this.seg2","this.seg2"], ["this.seg3","this.seg3"]]), "seg_from")
        .appendField("至")
        .appendField(new Blockly.FieldDropdown([["this.seg1","this.seg1"], ["this.seg2","this.seg2"], ["this.seg3","this.seg3"]]), "seg_to")
        .appendField("的校验码");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_compare'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(null);
    this.appendValueInput("B")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["==","EQ"], ["~=","NEQ"], ["<","LT"], ["<=","LTE"], [">","GT"], [">=","GTE"]]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_andor'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck(null);
    this.appendValueInput("B")
        .setCheck("Boolean")
        .appendField(new Blockly.FieldDropdown([["或","or"], ["并且","and"]]), "andor");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_not'] = {
  init: function() {
    this.appendValueInput("not")
        .setCheck(null)
        .appendField("非");
    this.setOutput(true, "Boolean");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_true_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["真","true"], ["假","false"]]), "tf");
    this.setOutput(true, "Boolean");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "NUM");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_arithmetic'] = {
  init: function() {
    this.appendValueInput("A")
        .setCheck("Number");
    this.appendValueInput("B")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([["+","ADD"], ["-","MINUS"], ["*","MULTIPLY"], ["/","DIVIDE"]]), "OP");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_refseg'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["this","this"], ["this.seg1","this.seg1"], ["this.seg2","this.seg2"]]), "refseg");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['prot_oneof'] = {
  init: function() {
    this.appendValueInput("IF0")
        .setCheck("Boolean")
        .appendField("如果");
    this.appendStatementInput("BRANCH0")
        .setCheck(null)
        .appendField("解析");
    this.appendValueInput("ELIF0")
        .setCheck("Boolean")
        .appendField("否则, 如果");
    this.appendStatementInput("BRANCH1")
        .setCheck(null)
        .appendField("解析");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

export default Blockly;