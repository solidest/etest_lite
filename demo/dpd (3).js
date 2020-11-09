Blockly.JavaScript['seg_integer'] = function(block) {
  var text_seg_name = block.getFieldValue('seg_name');
  var dropdown_signed = block.getFieldValue('signed');
  var number_bits = block.getFieldValue('bits');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['protocol'] = function(block) {
  var dropdown_bitalign = block.getFieldValue('bitalign');
  var statements_body = Blockly.JavaScript.statementToCode(block, 'body');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};