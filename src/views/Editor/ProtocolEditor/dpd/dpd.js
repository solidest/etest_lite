Blockly.JavaScript['protocol'] = function(block) {
  var dropdown_align = block.getFieldValue('align');
  var statements_segs = Blockly.JavaScript.statementToCode(block, 'segs');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['seg_integer'] = function(block) {
  var text_seg_name = block.getFieldValue('seg_name');
  var dropdown_signed = block.getFieldValue('signed');
  var number_bits = block.getFieldValue('bits');
  var dropdown_big_order = block.getFieldValue('big_order');
  var dropdown_encode = block.getFieldValue('encode');
  var value_auto_value = Blockly.JavaScript.valueToCode(block, 'auto_value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['seg_real'] = function(block) {
  var text_seg_name = block.getFieldValue('seg_name');
  var dropdown_double = block.getFieldValue('double');
  var dropdown_big_order = block.getFieldValue('big_order');
  var value_auto_value = Blockly.JavaScript.valueToCode(block, 'auto_value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['seg_string'] = function(block) {
  var text_seg_name = block.getFieldValue('seg_name');
  var value_repeated = Blockly.JavaScript.valueToCode(block, 'repeated', Blockly.JavaScript.ORDER_ATOMIC);
  var value_auto_value = Blockly.JavaScript.valueToCode(block, 'auto_value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['segments'] = function(block) {
  var text_seg_name = block.getFieldValue('seg_name');
  var statements_segs = Blockly.JavaScript.statementToCode(block, 'segs');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['arr_integer'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var text_seg_name = block.getFieldValue('seg_name');
  var dropdown_signed = block.getFieldValue('signed');
  var number_bits = block.getFieldValue('bits');
  var dropdown_bigorder = block.getFieldValue('bigorder');
  var dropdown_encode = block.getFieldValue('encode');
  var text_autovalue = block.getFieldValue('autovalue');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['arr_real'] = function(block) {
  var value_repeated = Blockly.JavaScript.valueToCode(block, 'repeated', Blockly.JavaScript.ORDER_ATOMIC);
  var text_seg_name = block.getFieldValue('seg_name');
  var dropdown_double = block.getFieldValue('double');
  var dropdown_bigorder = block.getFieldValue('bigorder');
  var text_autovalue = block.getFieldValue('autovalue');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['arr_string'] = function(block) {
  var value_repeated = Blockly.JavaScript.valueToCode(block, 'repeated', Blockly.JavaScript.ORDER_ATOMIC);
  var text_seg_name = block.getFieldValue('seg_name');
  var value_length = Blockly.JavaScript.valueToCode(block, 'length', Blockly.JavaScript.ORDER_ATOMIC);
  var text_autovalue = block.getFieldValue('autovalue');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['arr_segments'] = function(block) {
  var value_repeated = Blockly.JavaScript.valueToCode(block, 'repeated', Blockly.JavaScript.ORDER_ATOMIC);
  var text_seg_name = block.getFieldValue('seg_name');
  var statements_segs = Blockly.JavaScript.statementToCode(block, 'segs');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['oneof'] = function(block) {
  var value_if_cond = Blockly.JavaScript.valueToCode(block, 'if_cond', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_if_segs = Blockly.JavaScript.statementToCode(block, 'if_segs');
  var value_elif_cond = Blockly.JavaScript.valueToCode(block, 'elif_cond', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_elif_segs = Blockly.JavaScript.statementToCode(block, 'elif_segs');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['seg_custom'] = function(block) {
  var text_seg_nage = block.getFieldValue('seg_nage');
  var dropdown_unpack_fn = block.getFieldValue('unpack_fn');
  var dropdown_pack_fn = block.getFieldValue('pack_fn');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};