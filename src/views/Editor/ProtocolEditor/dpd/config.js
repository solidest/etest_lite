
const toolbox = `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
<category name="协议段" colour="#5ba55b">
  <block type="seg_integer">
    <field name="seg_name">seg_xxx</field>
    <field name="signed">false</field>
    <field name="bits">8</field>
    <field name="big_order">false</field>
    <field name="encode">complement</field>
    <value name="auto_value">
      <shadow type="prot_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="arr_integer">
    <field name="seg_name">seg_xxx</field>
    <field name="signed">false</field>
    <field name="bits">1</field>
    <field name="bigorder">false</field>
    <field name="encode">complement</field>
    <field name="autovalue">[ ]</field>
    <value name="repeated">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="seg_real">
    <field name="seg_name">seg_xxx</field>
    <field name="double">false</field>
    <field name="big_order">false</field>
    <value name="auto_value">
      <shadow type="prot_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="arr_real">
    <field name="seg_name">seg_xxx</field>
    <field name="double">false</field>
    <field name="bigorder">false</field>
    <field name="autovalue">[ ]</field>
    <value name="repeated">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="seg_string">
    <field name="seg_name">seg_xxx</field>
    <field name="len_type">length</field>
    <field name="auto_value">''</field>
    <value name="repeated">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="arr_string">
    <field name="seg_name">seg_xxx</field>
    <field name="len_type">length</field>
    <field name="autovalue">[ ]</field>
    <value name="repeated">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
    <value name="length">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="seg_custom">
    <field name="seg_nage">seg_xxx</field>
    <field name="unpack_fn">fn1</field>
    <field name="pack_fn">fn1</field>
  </block>
</category>
<category name="逻辑" colour="#5b80a5">
  <block type="segments">
    <field name="seg_name">group_xxx</field>
  </block>
  <block type="arr_segments">
    <field name="seg_name">group_xxx</field>
    <value name="repeated">
      <shadow type="prot_number">
        <field name="NUM">10</field>
      </shadow>
    </value>
  </block>
  <block type="prot_oneof"></block>
  <block type="prot_compare">
    <field name="OP">EQ</field>
    <value name="A">
      <shadow type="prot_refseg">
        <field name="refseg">this</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="prot_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
  </block>
  <block type="prot_andor">
    <field name="andor">or</field>
  </block>
  <block type="prot_not"></block>
  <block type="prot_true_false">
    <field name="tf">true</field>
  </block>
</category>
<category name="计算" colour="#5b67a5">
  <block type="prot_number">
    <field name="NUM">0</field>
  </block>
  <block type="prot_refseg">
    <field name="refseg">this</field>
  </block>
  <block type="prot_arithmetic">
    <field name="OP">ADD</field>
    <value name="A">
      <shadow type="prot_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
    <value name="B">
      <shadow type="prot_number">
        <field name="NUM">1</field>
      </shadow>
    </value>
  </block>
  <block type="bytesize">
    <field name="sizeof_seg">this</field>
  </block>
  <block type="checkcode">
    <field name="check_type">crc8</field>
    <field name="seg_from">this.seg1</field>
    <field name="seg_to">this.seg1</field>
  </block>
</category>
</xml>`;

const workspace = `<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none">
<block type="protocol" id="4R{1S}8e=ghWuk#4nR4Q" x="13" y="13">
  <field name="prot_name">prot_xxx</field>
  <field name="align">lr</field>
  <statement name="segs">
    <block type="seg_integer" id="SCq{H@Pztj7*nS=v%OW.">
      <field name="seg_name">seg_xxx</field>
      <field name="signed">false</field>
      <field name="bits">8</field>
      <field name="big_order">false</field>
      <field name="encode">complement</field>
      <value name="auto_value">
        <shadow type="prot_number" id="o|HoOEMY5Hlsw)(99TrK">
          <field name="NUM">0</field>
        </shadow>
      </value>
      <next>
        <block type="seg_real" id="/$SF+2ICP6j(SntCLqEc">
          <field name="seg_name">seg_xxx</field>
          <field name="double">false</field>
          <field name="big_order">false</field>
          <value name="auto_value">
            <shadow type="prot_number" id="A+PRrj7EQyx1FL#!CECF">
              <field name="NUM">0</field>
            </shadow>
          </value>
          <next>
            <block type="seg_string" id="{Kd%4j([L+^s9y[%Vf:C">
              <field name="seg_name">seg_xxx</field>
              <field name="len_type">length</field>
              <field name="auto_value">''</field>
              <value name="repeated">
                <shadow type="prot_number" id="::SH#(}UI:CS}MHUqhJl">
                  <field name="NUM">10</field>
                </shadow>
              </value>
            </block>
          </next>
        </block>
      </next>
    </block>
  </statement>
</block>
</xml>`


export default {
    toolbox,
    // theme,
    workspace,
}