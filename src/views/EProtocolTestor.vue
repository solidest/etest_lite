<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile :loading="loading">
            <e-editor-bar :items="bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1, name:''}"
                :kind="cfg.kind" @action="on_action">
            </e-editor-bar>
            <div style="height: calc(100vh - 90px);  overflow-y:auto">
                <v-row class="pa-0 ma-0" style="flex-wrap: nowrap;">
                    <v-col cols="2" class="pa-0 ma-0 flex-grow-0 flex-shrink-1"
                        style="min-width: 100px; max-width: 100%;">
                        <v-sheet class="pa-1">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="3" class="ma-0 pa-1 pr-2" align="begin">
                                    <v-btn icon color="grey lighten-1" class="mr-3" @click="format_hex">
                                        <v-icon>mdi-format-paint</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="9" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn color="grey lighten-1" outlined @click="unpack_hex">解包十六进制</v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-1 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor :zero_lnumber="true" id="hex" ref="hex" :script="hex" type="ethex" @change="on_change" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="2" class="pa-0 ma-0 flex-grow-1 flex-shrink-1"
                        style="min-width: 200px; max-width: 100%;">
                        <v-sheet class="pa-1">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="3" class="ma-0 pa-1 pr-2" align="begin">
                                    <v-btn icon color="grey lighten-1" class="mr-3" @click="format_bin">
                                        <v-icon>mdi-format-paint</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="9" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn color="grey lighten-1" outlined @click="unpack_bin">解包二进制</v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-1 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor :zero_lnumber="true" id="bin" ref="bin" :script="bin" type="etbin" @change="on_change" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="4" class="pa-0 ma-0 flex-grow-1 flex-shrink-0"
                        style="min-width: 200px; max-width: 100%;">
                        <v-sheet class="pa-1">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="begin">
                                    <v-checkbox class="pa-0 pt-1 ma-0" dense hide-details label="回显autovalue" v-model="show_autovalue"></v-checkbox>
                                </v-col>
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn color="grey lighten-1" outlined @click="pack">打包</v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-1 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor id="msg" :script="msg" type="yaml" @change="on_change" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="4" class="pa-1 ma-0 flex-grow-1 flex-shrink-0"
                        style="min-width: 200px; max-width: 100%;">
                        <v-data-table :headers="cfg.headers" :items="items" no-data-text="空" disable-sort hide-default-footer
                            dense disable-pagination @click:row="click_row">
                            <template v-slot:top>
                                <v-card-text>{{align==='lr'? '高位在前':'低位在前'}} </v-card-text>
                            </template>
                        </v-data-table>
                    </v-col>

                </v-row>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/ipc_render';
    import run from '../run/run_render';
    import cfg from '../helper/cfg_protocol_test';
    import h from '../feature/f_protocol';
    import formater from '../helper/formater';
    import EEditorBar from '../components/EEditorBar';
    import EScriptEditor from '../components/widgets/EDataFormatEditor';
    import yaml from 'js-yaml';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-script-editor': EScriptEditor,
        },

        mounted: function () {
            this.doc_id = this.$route.params.doc_id;
            if (!this.doc_id) {
                return;
            }
            this.bar_items = this.cfg.bar_items;
            this.load_doc();
        },

        data() {
            return {
                doc_id: null,
                bar_items: [],
                cfg: cfg,
                bin: '',
                hex: '',
                msg: '',
                omsg: {},
                frm: {},
                loading: false,
                show_autovalue: true,
                items: [],
            }
        },
        computed: {
            title: function () {
                let ed = this.$store.state.edit_doc;
                return ed ? ed.doc.name : '';
            },
            proj_id: function () {
                return this.$store.state.proj.id;
            },
            align: function() {
                return this.frm.bitalign;
            }
        },
        methods: {
            on_change(id, script) {
                this[id] = script;
            },
            on_action: function (ac) {
                if (ac === 'd_stop') {
                    this.$router.push({
                        name: 'Protocol',
                        params: {
                            doc_id: this.doc_id,
                        }
                    })
                }
            },
            set_pack_detail: function (value, detail, autovalue) {
                this.hex = formater.format_hex(value);
                this.bin = formater.hex2bin(this.hex);
                if(this.show_autovalue) {
                    this.msg = yaml.safeDump(autovalue);
                }
                this.items = h.load_msg(this.frm.items, autovalue, detail);
            },
            set_unpack_detail: function (value, detail) {
                this.msg = yaml.safeDump(value);
                this.items = h.load_msg(this.frm.items, value, detail);
            },
            parse_outs: function (recorder) {
                switch (recorder.result) {
                    case 'error':
                        this.$store.commit('setMsgError', recorder.value);
                        break;
                    case 'pack':
                        this.$store.commit('setMsgSuccess', '打包成功');
                        this.set_pack_detail(recorder.value, recorder.detail,recorder.auto_value);
                        break;
                    case 'unpack':
                        this.$store.commit('setMsgSuccess', '解包成功');
                        this.set_unpack_detail(recorder.value, recorder.detail);
                        break;
                    default:
                        for (let k in recorder) {
                            console.log(k, recorder[k])
                        }
                        break;
                }
            },
            read_out: async function () {
                if (this.reading) {
                    return;
                }
                this.reading = true;
                let info = {
                    proj_id: this.proj_id,
                    case_id: this.doc_id,
                    limit: 1000,
                    begin_time: this.last_time,
                    kinds: {
                        debug: true,
                        recorder: true,
                    }
                }
                let res = await run.get_outs(info);
                this.reading = false;
                if (res && res.debug && res.debug.length > 0) {
                    this.last_time = res.debug[res.debug.length - 1].$time;
                    if (res.stop) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    let err = res.debug.find(it => it.tag && it.tag.is_error);
                    if (err) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.$store.commit('setMsgError', err.text);
                    }
                }
                if (res && res.recorder) {
                    this.parse_outs(res.recorder);
                }
            },
            start_read_out: function () {
                this.last_time = -1;
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                let self = this;
                this.timer = setInterval(async () => {
                    await self.read_out();
                }, 40);
            },
            pack: async function () {
                if (this.valid_msg()) {
                    let info = {
                        proj_id: this.proj_id,
                        id: this.doc_id,
                        name: this.title,
                        prot_id: this.doc_id,
                        script: cfg.script.pack,
                        vars: {
                            prot: this.title,
                            msg: this.omsg
                        }
                    };
                    let res = await run.run_test(info);
                    if (res.result !== 'ok') {
                        this.$store.commit('setMsgError', res.value);
                    } else {
                        this.start_read_out();
                    }
                }
            },
            unpack_hex: async function () {
                if (this.format_hex()) {
                    let info = {
                        proj_id: this.proj_id,
                        id: this.doc_id,
                        name: this.title,
                        prot_id: this.doc_id,
                        script: cfg.script.unpack,
                        vars: {
                            prot: this.title,
                            buff: formater.zip_hex(this.hex)
                        }
                    };
                    let res = await run.run_test(info);
                    if (res.result !== 'ok') {
                        this.$store.commit('setMsgError', res.value);
                    } else {
                        this.start_read_out();
                    }
                }
            },
            unpack_bin: async function () {
                if (this.format_bin()) {
                    let info = {
                        proj_id: this.proj_id,
                        id: this.doc_id,
                        name: this.title,
                        prot_id: this.doc_id,
                        script: cfg.script.unpack,
                        vars: {
                            prot: this.title,
                            buff: formater.zip_hex(this.hex)
                        }
                    };
                    let res = await run.run_test(info);
                    if (res.result !== 'ok') {
                        this.$store.commit('setMsgError', res.value);
                    } else {
                        this.start_read_out();
                    }
                }
            },
            format_hex: function () {
                if (!formater.valid_hex(this.hex)) {
                    this.$store.commit('setMsgError', '数据格式无效');
                    return false;
                }
                this.hex = formater.format_hex(this.hex);
                this.bin = formater.hex2bin(this.hex);
                return true;
            },
            format_bin: function () {
                if (!formater.valid_bin(this.bin)) {
                    this.$store.commit('setMsgError', '数据格式无效');
                    return false;
                }
                this.bin = formater.format_bin(this.bin);
                this.hex = formater.bin2hex(this.bin);
                return true;
            },
            valid_msg: function () {
                if (!this.msg || !this.msg.trim()) {
                    this.$store.commit('setMsgError', '数据格式无效');
                    return false;
                }
                try {
                    this.omsg = yaml.safeLoad(this.msg);
                    return true;
                } catch (error) {
                    this.$store.commit('setMsgError', error.message);
                    return false;
                }
            },
            
            click_row: function(item) {
                if(item.pos && item.pos.bit_end_pos) {
                    let p1 = item.pos.bit_begin_pos;
                    let p2 = item.pos.bit_end_pos-1;
                    let L1 = Math.floor(p1/8);
                    let L2 = Math.floor(p2/8);
                    let B1 = p1%8;
                    let B2 = p2%8;
                    if(B1>3){
                        B1++;
                    }
                    if(B2>3){
                        B2++;
                    }
                    this.$refs.hex.select_range(L1, 0, L2, 1);
                    this.$refs.bin.select_range(L1, B1, L2, B2);
                }
            },
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.frm = content;
                this.items = h.load_msg(this.frm.items, this.omsg);
            }
        }
    }
</script>