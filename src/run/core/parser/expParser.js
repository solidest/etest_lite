/**
 * LR parser generated by the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 *   npm install -g syntax-cli
 *
 *   syntax-cli --help
 *
 * To regenerate run:
 *
 *   syntax-cli \
 *     --grammar ~/path-to-grammar-file \
 *     --mode <parsing-mode> \
 *     --output ~/path-to-output-parser-file.js
 */

'use strict';

/**
 * Matched token text.
 */
let yytext;

/**
 * Length of the matched token text.
 */
let yyleng;

/**
 * Storage object.
 */
let yy = {};

/**
 * Result of semantic action.
 */
let __;

/**
 * Result location object.
 */
let __loc;

function yyloc(start, end) {
  if (!yy.options.captureLocations) {
    return null;
  }

  // Epsilon doesn't produce location.
  if (!start || !end) {
    return start || end;
  }

  return {
    startOffset: start.startOffset,
    endOffset: end.endOffset,
    startLine: start.startLine,
    endLine: end.endLine,
    startColumn: start.startColumn,
    endColumn: end.endColumn,
  };
}

const EOF = '$';

/**
 * List of productions (generated by Syntax tool).
 */
const productions = [[-1,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1 }],
[0,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[0,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[0,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = {kind: 'not', exp: _2}; }],
[0,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = {kind: 'uminus', exp: _2}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'not_eq', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'eq_eq', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'gt_eq', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'lt_eq', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'gt', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'lt', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'add', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'subtract', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'multiply', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'divide', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'and', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'or', left: _1, right: _3}; }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[0,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = newKindList('array', null); }],
[0,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[0,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[1,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = { kind: _1 }; }],
[1,4,(_1,_2,_3,_4,_1loc,_2loc,_3loc,_4loc) => { __loc = yyloc(_1loc, _4loc);__ = {kind: _1, params: _3}; }],
[2,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[2,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinList(_1, _3); }],
[2,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[3,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newKindList('array', _1); }],
[3,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinKindList(_1, _3); }],
[3,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'number', value: eval(yytext)}; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'number', value: eval(yytext)}; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'bool', value: true}; }],
[4,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'bool', value: false}; }],
[5,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newKindList('pid', _1); }],
[5,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinKindList(_1, _3); }],
[6,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'string', value: eval(yytext)}; }],
[6,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'string', value: eval(yytext)}; }],
[6,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'strhex',  value: yytext.replace(/%/g, '')}; }],
[7,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = newList(null); }],
[7,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[8,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[8,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinList(_1, _3); }],
[8,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = newProp(_1, _3, _1loc, _3loc); }]];

/**
 * Encoded tokens map.
 */
const tokens = {"NOT":"10","-":"11","NOT_EQ":"12","EQ_EQ":"13","GT_EQ":"14","LT_EQ":"15",">":"16","<":"17","+":"18","*":"19","/":"20","AND":"21","OR":"22","(":"23",")":"24","[":"25","]":"26","ID":"27",",":"28","NUMBER":"29","NUMBER_HEX":"30","TRUE":"31","FALSE":"32","DOT":"33","STRING_TRIPLE":"34","STRING_SINGLE":"35","STRING_HEX":"36","{":"37","}":"38",":":"39","$":"40"};

/**
 * Parsing table (generated by Syntax tool).
 */
const table = [{"0":1,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","40":"acc"},{"11":"r1","12":"r1","13":"r1","14":"r1","15":"r1","16":"r1","17":"r1","18":"r1","19":"r1","20":"r1","21":"r1","22":"r1","24":"r1","26":"r1","28":"r1","38":"r1","40":"r1"},{"11":"r2","12":"r2","13":"r2","14":"r2","15":"r2","16":"r2","17":"r2","18":"r2","19":"r2","20":"r2","21":"r2","22":"r2","24":"r2","26":"r2","28":"r2","38":"r2","40":"r2"},{"0":44,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":45,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":46,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":50,"1":8,"3":49,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","26":"s48","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"r20","12":"r20","13":"r20","14":"r20","15":"r20","16":"r20","17":"r20","18":"r20","19":"r20","20":"r20","21":"r20","22":"r20","24":"r20","26":"r20","28":"r20","38":"r20","40":"r20"},{"11":"r29","12":"r29","13":"r29","14":"r29","15":"r29","16":"r29","17":"r29","18":"r29","19":"r29","20":"r29","21":"r29","22":"r29","24":"r29","26":"r29","28":"r29","38":"r29","40":"r29"},{"11":"r30","12":"r30","13":"r30","14":"r30","15":"r30","16":"r30","17":"r30","18":"r30","19":"r30","20":"r30","21":"r30","22":"r30","24":"r30","26":"r30","28":"r30","38":"r30","40":"r30"},{"11":"r31","12":"r31","13":"r31","14":"r31","15":"r31","16":"r31","17":"r31","18":"r31","19":"r31","20":"r31","21":"r31","22":"r31","24":"r31","26":"r31","28":"r31","38":"r31","40":"r31"},{"11":"r32","12":"r32","13":"r32","14":"r32","15":"r32","16":"r32","17":"r32","18":"r32","19":"r32","20":"r32","21":"r32","22":"r32","24":"r32","26":"r32","28":"r32","33":"s54","38":"r32","40":"r32"},{"11":"r33","12":"r33","13":"r33","14":"r33","15":"r33","16":"r33","17":"r33","18":"r33","19":"r33","20":"r33","21":"r33","22":"r33","24":"r33","26":"r33","28":"r33","38":"r33","40":"r33"},{"11":"r34","12":"r34","13":"r34","14":"r34","15":"r34","16":"r34","17":"r34","18":"r34","19":"r34","20":"r34","21":"r34","22":"r34","24":"r34","26":"r34","28":"r34","38":"r34","40":"r34"},{"11":"r37","12":"r37","13":"r37","14":"r37","15":"r37","16":"r37","17":"r37","18":"r37","19":"r37","20":"r37","21":"r37","22":"r37","24":"r37","26":"r37","28":"r37","38":"r37","40":"r37"},{"11":"r38","12":"r38","13":"r38","14":"r38","15":"r38","16":"r38","17":"r38","18":"r38","19":"r38","20":"r38","21":"r38","22":"r38","24":"r38","26":"r38","28":"r38","38":"r38","40":"r38"},{"11":"r39","12":"r39","13":"r39","14":"r39","15":"r39","16":"r39","17":"r39","18":"r39","19":"r39","20":"r39","21":"r39","22":"r39","24":"r39","26":"r39","28":"r39","38":"r39","40":"r39"},{"11":"r35","12":"r35","13":"r35","14":"r35","15":"r35","16":"r35","17":"r35","18":"r35","19":"r35","20":"r35","21":"r35","22":"r35","23":"s56","24":"r35","26":"r35","28":"r35","33":"r35","38":"r35","40":"r35"},{"8":64,"9":65,"27":"s66","38":"s63"},{"0":32,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":33,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":34,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":35,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":36,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":37,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":38,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":39,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":40,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":41,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":42,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"0":43,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"s27","12":"r5","13":"r5","14":"r5","15":"r5","16":"r5","17":"r5","18":"s26","19":"s28","20":"s29","21":"r5","22":"r5","24":"r5","26":"r5","28":"r5","38":"r5","40":"r5"},{"11":"s27","12":"r6","13":"r6","14":"r6","15":"r6","16":"r6","17":"r6","18":"s26","19":"s28","20":"s29","21":"r6","22":"r6","24":"r6","26":"r6","28":"r6","38":"r6","40":"r6"},{"11":"s27","12":"r7","13":"r7","14":"r7","15":"r7","16":"r7","17":"r7","18":"s26","19":"s28","20":"s29","21":"r7","22":"r7","24":"r7","26":"r7","28":"r7","38":"r7","40":"r7"},{"11":"s27","12":"r8","13":"r8","14":"r8","15":"r8","16":"r8","17":"r8","18":"s26","19":"s28","20":"s29","21":"r8","22":"r8","24":"r8","26":"r8","28":"r8","38":"r8","40":"r8"},{"11":"s27","12":"r9","13":"r9","14":"r9","15":"r9","16":"r9","17":"r9","18":"s26","19":"s28","20":"s29","21":"r9","22":"r9","24":"r9","26":"r9","28":"r9","38":"r9","40":"r9"},{"11":"s27","12":"r10","13":"r10","14":"r10","15":"r10","16":"r10","17":"r10","18":"s26","19":"s28","20":"s29","21":"r10","22":"r10","24":"r10","26":"r10","28":"r10","38":"r10","40":"r10"},{"11":"r11","12":"r11","13":"r11","14":"r11","15":"r11","16":"r11","17":"r11","18":"r11","19":"s28","20":"s29","21":"r11","22":"r11","24":"r11","26":"r11","28":"r11","38":"r11","40":"r11"},{"11":"r12","12":"r12","13":"r12","14":"r12","15":"r12","16":"r12","17":"r12","18":"r12","19":"s28","20":"s29","21":"r12","22":"r12","24":"r12","26":"r12","28":"r12","38":"r12","40":"r12"},{"11":"r13","12":"r13","13":"r13","14":"r13","15":"r13","16":"r13","17":"r13","18":"r13","19":"r13","20":"r13","21":"r13","22":"r13","24":"r13","26":"r13","28":"r13","38":"r13","40":"r13"},{"11":"r14","12":"r14","13":"r14","14":"r14","15":"r14","16":"r14","17":"r14","18":"r14","19":"r14","20":"r14","21":"r14","22":"r14","24":"r14","26":"r14","28":"r14","38":"r14","40":"r14"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"r15","22":"r15","24":"r15","26":"r15","28":"r15","38":"r15","40":"r15"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"r16","22":"r16","24":"r16","26":"r16","28":"r16","38":"r16","40":"r16"},{"11":"r3","12":"r3","13":"r3","14":"r3","15":"r3","16":"r3","17":"r3","18":"r3","19":"r3","20":"r3","21":"r3","22":"r3","24":"r3","26":"r3","28":"r3","38":"r3","40":"r3"},{"11":"r4","12":"r4","13":"r4","14":"r4","15":"r4","16":"r4","17":"r4","18":"r4","19":"r4","20":"r4","21":"r4","22":"r4","24":"r4","26":"r4","28":"r4","38":"r4","40":"r4"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","24":"s47"},{"11":"r17","12":"r17","13":"r17","14":"r17","15":"r17","16":"r17","17":"r17","18":"r17","19":"r17","20":"r17","21":"r17","22":"r17","24":"r17","26":"r17","28":"r17","38":"r17","40":"r17"},{"11":"r18","12":"r18","13":"r18","14":"r18","15":"r18","16":"r18","17":"r18","18":"r18","19":"r18","20":"r18","21":"r18","22":"r18","24":"r18","26":"r18","28":"r18","38":"r18","40":"r18"},{"26":"s51","28":"s52"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","26":"r26","28":"r26"},{"11":"r19","12":"r19","13":"r19","14":"r19","15":"r19","16":"r19","17":"r19","18":"r19","19":"r19","20":"r19","21":"r19","22":"r19","24":"r19","26":"r19","28":"r19","38":"r19","40":"r19"},{"0":53,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","26":"r28","27":"s18","28":"r28","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","26":"r27","28":"r27"},{"27":"s55"},{"11":"r36","12":"r36","13":"r36","14":"r36","15":"r36","16":"r36","17":"r36","18":"r36","19":"r36","20":"r36","21":"r36","22":"r36","24":"r36","26":"r36","28":"r36","33":"r36","38":"r36","40":"r36"},{"0":59,"1":8,"2":58,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","24":"s57","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"r21","12":"r21","13":"r21","14":"r21","15":"r21","16":"r21","17":"r21","18":"r21","19":"r21","20":"r21","21":"r21","22":"r21","24":"r21","26":"r21","28":"r21","38":"r21","40":"r21"},{"24":"s60","28":"s61"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","24":"r23","28":"r23"},{"11":"r22","12":"r22","13":"r22","14":"r22","15":"r22","16":"r22","17":"r22","18":"r22","19":"r22","20":"r22","21":"r22","22":"r22","24":"r22","26":"r22","28":"r22","38":"r22","40":"r22"},{"0":62,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","24":"r25","25":"s7","27":"s18","28":"r25","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","24":"r24","28":"r24"},{"11":"r40","12":"r40","13":"r40","14":"r40","15":"r40","16":"r40","17":"r40","18":"r40","19":"r40","20":"r40","21":"r40","22":"r40","24":"r40","26":"r40","28":"r40","38":"r40","40":"r40"},{"28":"s68","38":"s67"},{"28":"r42","38":"r42"},{"39":"s70"},{"11":"r41","12":"r41","13":"r41","14":"r41","15":"r41","16":"r41","17":"r41","18":"r41","19":"r41","20":"r41","21":"r41","22":"r41","24":"r41","26":"r41","28":"r41","38":"r41","40":"r41"},{"9":69,"27":"s66","28":"r44","38":"r44"},{"28":"r43","38":"r43"},{"0":71,"1":8,"4":2,"5":12,"6":11,"7":3,"10":"s4","11":"s5","23":"s6","25":"s7","27":"s18","29":"s9","30":"s10","31":"s13","32":"s14","34":"s15","35":"s16","36":"s17","37":"s19"},{"11":"s27","12":"s20","13":"s21","14":"s22","15":"s23","16":"s24","17":"s25","18":"s26","19":"s28","20":"s29","21":"s30","22":"s31","28":"r45","38":"r45"}];

/**
 * Parsing stack.
 */
const stack = [];

/**
 * Tokenizer instance.
 */
let tokenizer;
/**
 * Generic tokenizer used by the parser in the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 * See `--custom-tokinzer` to skip this generation, and use a custom one.
 */

const lexRules = [[/^\/\*[^*]*\*+([^\/][^*]*\*+)*\//, function() { /*return 'COMMENT_BLOCK'*/ }],
[/^\/\/[^\r\n]*/, function() { /*return 'COMMENT_LINE'*/ }],
[/^\"([^\\\n"]|\\.)*\"/, function() { return 'STRING_TRIPLE' }],
[/^'([^\\\n']|\\.)*'/, function() { return 'STRING_SINGLE' }],
[/^%[0-9A-Fa-f\s]*%/, function() { return 'STRING_HEX' }],
[/^\s+/, function() { /* return 'WHITESPACE' */ }],
[/^\n/, function() { /* return 'NEWLINE' */ }],
[/^\bbitlr\b/, function() { return 'BITLR'  }],
[/^\bbitrl\b/, function() { return 'BITRL'  }],
[/^\bprotocol\b/, function() { if(this.getCurrentState()!=='INITIAL') this.popState(); this.pushState('protocol'); return 'PROTOCOL'; }],
[/^\bsegments\b/, function() { return 'SEGMENTS' }],
[/^\bsegment\b/, function() { return 'SEGMENT' }],
[/^\boneof\b/, function() { return 'ONEOF' }],
[/^\bdevice\b/, function() { if(this.getCurrentState()!=='INITIAL') this.popState(); this.pushState('device'); return 'DEVICE'; }],
[/^\b(udp|tcp_server|tcp_client|serial_ttl|serial_232|serial_422|serial_485|serial_usb|can|di|do|ad|da)\b/, function() { return 'INTFTYPE' }],
[/^\btopology\b/, function() { if(this.getCurrentState()!=='INITIAL') this.popState(); this.pushState('topology'); return 'TOPOLOGY'; }],
[/^\blinking\b/, function() { return 'LINKING' }],
[/^\bmapping\b/, function() { return 'MAPPING' }],
[/^\bbinding\b/, function() { return 'BINDING' }],
[/^\buut\b/, function() { return 'UUT' }],
[/^\betest\b/, function() { return 'ETEST' }],
[/^true/, function() { return 'TRUE' }],
[/^false/, function() { return 'FALSE' }],
[/^0[xX][0-9a-fA-F]+/, function() { return 'NUMBER_HEX' }],
[/^[0-9]+(?:\.[0-9]+)?/, function() { return 'NUMBER' }],
[/^[a-zA-Z_$][a-zA-Z0-9_]*/, function() { return 'ID' }],
[/^!=/, function() { return 'NOT_EQ' }],
[/^!/, function() { return 'NOT' }],
[/^==/, function() { return 'EQ_EQ' }],
[/^>=/, function() { return 'GT_EQ' }],
[/^<=/, function() { return 'LT_EQ' }],
[/^&&/, function() { return 'AND' }],
[/^\|\|/, function() { return 'OR' }],
[/^{/, function() { return '{' }],
[/^}/, function() { return '}' }],
[/^]/, function() { return ']' }],
[/^\[/, function() { return '[' }],
[/^,/, function() { return ',' }],
[/^\:/, function() { return ':' }],
[/^\./, function() { return 'DOT' }],
[/^\+/, function() { return '+' }],
[/^-/, function() { return '-' }],
[/^\*/, function() { return '*' }],
[/^\//, function() { return '/' }],
[/^\(/, function() { return '(' }],
[/^\)/, function() { return ')' }],
[/^>/, function() { return '>' }],
[/^</, function() { return '<' }]];
const lexRulesByConditions = {"INITIAL":[0,1,2,3,4,5,6,7,8,9,13,15,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],"protocol":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,15,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],"device":[0,1,2,3,4,5,6,7,8,9,13,14,15,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],"topology":[0,1,2,3,4,5,6,7,8,9,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]};

const EOF_TOKEN = {
  type: EOF,
  value: '',
};

tokenizer = {
  initString(string) {
    this._string = string;
    this._cursor = 0;

    this._states = ['INITIAL'];
    this._tokensQueue = [];

    this._currentLine = 1;
    this._currentColumn = 0;
    this._currentLineBeginOffset = 0;

    /**
     * Matched token location data.
     */
    this._tokenStartOffset = 0;
    this._tokenEndOffset = 0;
    this._tokenStartLine = 1;
    this._tokenEndLine = 1;
    this._tokenStartColumn = 0;
    this._tokenEndColumn = 0;

    return this;
  },

  /**
   * Returns tokenizer states.
   */
  getStates() {
    return this._states;
  },

  getCurrentState() {
    return this._states[this._states.length - 1];
  },

  pushState(state) {
    this._states.push(state);
  },

  begin(state) {
    this.pushState(state);
  },

  popState() {
    if (this._states.length > 1) {
      return this._states.pop();
    }
    return this._states[0];
  },

  getNextToken() {
    // Something was queued, return it.
    if (this._tokensQueue.length > 0) {
      return this.onToken(this._toToken(this._tokensQueue.shift()));
    }

    if (!this.hasMoreTokens()) {
      return this.onToken(EOF_TOKEN);
    }

    let string = this._string.slice(this._cursor);
    let lexRulesForState = lexRulesByConditions[this.getCurrentState()];

    for (let i = 0; i < lexRulesForState.length; i++) {
      let lexRuleIndex = lexRulesForState[i];
      let lexRule = lexRules[lexRuleIndex];

      let matched = this._match(string, lexRule[0]);

      // Manual handling of EOF token (the end of string). Return it
      // as `EOF` symbol.
      if (string === '' && matched === '') {
        this._cursor++;
      }

      if (matched !== null) {
        yytext = matched;
        yyleng = yytext.length;
        let token = lexRule[1].call(this);

        if (!token) {
          return this.getNextToken();
        }

        // If multiple tokens are returned, save them to return
        // on next `getNextToken` call.

        if (Array.isArray(token)) {
          const tokensToQueue = token.slice(1);
          token = token[0];
          if (tokensToQueue.length > 0) {
            this._tokensQueue.unshift(...tokensToQueue);
          }
        }

        return this.onToken(this._toToken(token, yytext));
      }
    }

    if (this.isEOF()) {
      this._cursor++;
      return EOF_TOKEN;
    }

    this.throwUnexpectedToken(
      string[0],
      this._currentLine,
      this._currentColumn
    );
  },

  /**
   * Throws default "Unexpected token" exception, showing the actual
   * line from the source, pointing with the ^ marker to the bad token.
   * In addition, shows `line:column` location.
   */
  throwUnexpectedToken(symbol, line, column) {
    const lineSource = this._string.split('\n')[line - 1];
    let lineData = '';

    if (lineSource) {
      const pad = ' '.repeat(column);
      lineData = '\n\n' + lineSource + '\n' + pad + '^\n';
    }

    throw new SyntaxError(
      `${lineData}Unexpected token: "${symbol}" ` +
      `at ${line}:${column}.`
    );
  },

  getCursor() {
    return this._cursor;
  },

  getCurrentLine() {
    return this._currentLine;
  },

  getCurrentColumn() {
    return this._currentColumn;
  },

  _captureLocation(matched) {
    const nlRe = /\n/g;

    // Absolute offsets.
    this._tokenStartOffset = this._cursor;

    // Line-based locations, start.
    this._tokenStartLine = this._currentLine;
    this._tokenStartColumn =
      this._tokenStartOffset - this._currentLineBeginOffset;

    // Extract `\n` in the matched token.
    let nlMatch;
    while ((nlMatch = nlRe.exec(matched)) !== null) {
      this._currentLine++;
      this._currentLineBeginOffset = this._tokenStartOffset + nlMatch.index + 1;
    }

    this._tokenEndOffset = this._cursor + matched.length;

    // Line-based locations, end.
    this._tokenEndLine = this._currentLine;
    this._tokenEndColumn = this._currentColumn =
      (this._tokenEndOffset - this._currentLineBeginOffset);
  },

  _toToken(tokenType, yytext = '') {
    return {
      // Basic data.
      type: tokenType,
      value: yytext,

      // Location data.
      startOffset: this._tokenStartOffset,
      endOffset: this._tokenEndOffset,
      startLine: this._tokenStartLine,
      endLine: this._tokenEndLine,
      startColumn: this._tokenStartColumn,
      endColumn: this._tokenEndColumn,
    };
  },

  isEOF() {
    return this._cursor === this._string.length;
  },

  hasMoreTokens() {
    return this._cursor <= this._string.length;
  },

  _match(string, regexp) {
    let matched = string.match(regexp);
    if (matched) {
      // Handle `\n` in the matched token to track line numbers.
      this._captureLocation(matched[0]);
      this._cursor += matched[0].length;
      return matched[0];
    }
    return null;
  },

  /**
   * Allows analyzing, and transforming token. Default implementation
   * just passes the token through.
   */
  onToken(token) {
    return token;
  },
};

/**
 * Expose tokenizer so it can be accessed in semantic actions.
 */
yy.lexer = tokenizer;
yy.tokenizer = tokenizer;

/**
 * Global parsing options. Some options can be shadowed per
 * each `parse` call, if the optations are passed.
 *
 * Initalized to the `captureLocations` which is passed
 * from the generator. Other options can be added at runtime.
 */
yy.options = {
  captureLocations: true,
};

/**
 * Parsing module.
 */
const yyparse = {
  /**
   * Sets global parsing options.
   */
  setOptions(options) {
    yy.options = options;
    return this;
  },

  /**
   * Returns parsing options.
   */
  getOptions() {
    return yy.options;
  },

  /**
   * Parses a string.
   */
  parse(string, parseOptions) {
    if (!tokenizer) {
      throw new Error(`Tokenizer instance wasn't specified.`);
    }

    tokenizer.initString(string);

    /**
     * If parse options are passed, override global parse options for
     * this call, and later restore global options.
     */
    let globalOptions = yy.options;
    if (parseOptions) {
      yy.options = Object.assign({}, yy.options, parseOptions);
    }

    /**
     * Allow callers to do setup work based on the
     * parsing string, and passed options.
     */
    yyparse.onParseBegin(string, tokenizer, yy.options);

    stack.length = 0;
    stack.push(0);

    let token = tokenizer.getNextToken();
    let shiftedToken = null;

    do {
      if (!token) {
        // Restore options.
        yy.options = globalOptions;
        unexpectedEndOfInput();
      }

      let state = stack[stack.length - 1];
      let column = tokens[token.type];

      if (!table[state].hasOwnProperty(column)) {
        yy.options = globalOptions;
        unexpectedToken(token);
      }

      let entry = table[state][column];

      // Shift action.
      if (entry[0] === 's') {
        let loc = null;

        if (yy.options.captureLocations) {
          loc = {
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            startLine: token.startLine,
            endLine: token.endLine,
            startColumn: token.startColumn,
            endColumn: token.endColumn,
          };
        }

        shiftedToken = this.onShift(token);

        stack.push(
          {symbol: tokens[shiftedToken.type], semanticValue: shiftedToken.value, loc},
          Number(entry.slice(1))
        );

        token = tokenizer.getNextToken();
      }

      // Reduce action.
      else if (entry[0] === 'r') {
        let productionNumber = entry.slice(1);
        let production = productions[productionNumber];
        let hasSemanticAction = typeof production[2] === 'function';
        let semanticValueArgs = hasSemanticAction ? [] : null;

        const locationArgs = (
          hasSemanticAction && yy.options.captureLocations
            ? []
            : null
        );

        if (production[1] !== 0) {
          let rhsLength = production[1];
          while (rhsLength-- > 0) {
            stack.pop();
            let stackEntry = stack.pop();

            if (hasSemanticAction) {
              semanticValueArgs.unshift(stackEntry.semanticValue);

              if (locationArgs) {
                locationArgs.unshift(stackEntry.loc);
              }
            }
          }
        }

        const reduceStackEntry = {symbol: production[0]};

        if (hasSemanticAction) {
          yytext = shiftedToken ? shiftedToken.value : null;
          yyleng = shiftedToken ? shiftedToken.value.length : null;

          const semanticActionArgs = (
            locationArgs !== null
              ? semanticValueArgs.concat(locationArgs)
              : semanticValueArgs
          );

          production[2](...semanticActionArgs);

          reduceStackEntry.semanticValue = __;

          if (locationArgs) {
            reduceStackEntry.loc = __loc;
          }
        }

        const nextState = stack[stack.length - 1];
        const symbolToReduceWith = production[0];

        stack.push(
          reduceStackEntry,
          table[nextState][symbolToReduceWith]
        );
      }

      // Accept.
      else if (entry === 'acc') {
        stack.pop();
        let parsed = stack.pop();

        if (stack.length !== 1 ||
            stack[0] !== 0 ||
            tokenizer.hasMoreTokens()) {
          // Restore options.
          yy.options = globalOptions;
          unexpectedToken(token);
        }

        if (parsed.hasOwnProperty('semanticValue')) {
          yy.options = globalOptions;
          yyparse.onParseEnd(parsed.semanticValue);
          return parsed.semanticValue;
        }

        yyparse.onParseEnd();

        // Restore options.
        yy.options = globalOptions;
        return true;
      }

    } while (tokenizer.hasMoreTokens() || stack.length > 1);
  },

  setTokenizer(customTokenizer) {
    tokenizer = customTokenizer;
    return yyparse;
  },

  getTokenizer() {
    return tokenizer;
  },

  onParseBegin(string, tokenizer, options) {},
  onParseEnd(parsed) {},

  /**
   * Allows analyzing, and transforming shifted token. Default implementation
   * just passes the token through.
   */
  onShift(token) {
    return token;
  },
};



    function newList(item) {
      if(item) {
        return [item];
      } else {
        return [];
      }
    }

    function joinList(list, item) {
      if(list && item) {
        list.push(item);
      }
      return list;
    }

    function newKindList(kind, item) {
      if(item) {
        return {kind: kind, list: [item]};
      } else {
        return {kind: kind, list: []};
      }
    }

    function joinKindList(list, item) {
      if(list && list.list && item) {
        list.list.push(item);
      }
      return list;
    }

    function newProp(id, exp, id_loc, exp_loc) {
      return {
        kind: 'prop',
        name: id,
        value: exp,
        name_from: id_loc.startOffset,
        name_to: id_loc.endOffset,
        name_line: id_loc.startLine,
        value_from: exp_loc.startOffset,
        value_to: exp_loc.endOffset,
        value_line: exp_loc.startLine,
      }
    }

    function newProtBranch(kind, exp, seglist, exp_loc) {
      return {
        kind: kind,
        exp: exp,
        seglist: seglist,
        exp_from: exp_loc.startOffset,
        exp_to: exp_loc.endOffset,
        exp_line: exp_loc.startLine,
      }
    }

    function newProtSeggroup(name, seglist, name_loc, repeated) {
      let res = {
        kind: 'seggroup',
        name: name,
        seglist: seglist,
        name_from: name_loc.startOffset,
        name_to: name_loc.endOffset,
        name_line: name_loc.startLine,
      }
      if(repeated) {
        res.repeated = repeated;
      }
      return res;
    }

    function newElement(kind, name, body_name, body, name_loc, repeated) {
      let res = {
        kind: kind,
        name: name,
        name_from: name_loc.startOffset,
        name_to: name_loc.endOffset,
        name_line: name_loc.startLine,
      }
      res[body_name] = body;
      if(repeated) {
        res.repeated = repeated;
      }
      return res;
    }




function unexpectedToken(token) {
  if (token.type === EOF) {
    unexpectedEndOfInput();
  }

  tokenizer.throwUnexpectedToken(
    token.value,
    token.startLine,
    token.startColumn
  );
}

function unexpectedEndOfInput() {
  parseError(`Unexpected end of input.`);
}

function parseError(message) {
  throw new SyntaxError(message);
}

module.exports = yyparse;
