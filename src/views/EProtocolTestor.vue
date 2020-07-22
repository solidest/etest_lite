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
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="begin">
                                    <v-btn color="grey lighten-1" outlined>解包HEX</v-btn>
                                    </v-col>
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn icon color="grey lighten-1" class="mr-3" @click="format_hex">
                                        <v-icon>mdi-format-paint</v-icon>
                                    </v-btn>
                                </v-col>

                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-1 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor id="hex" :script="hex" type="ethex" @change="on_change" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="2" class="pa-0 ma-0 flex-grow-1 flex-shrink-1"
                        style="min-width: 200px; max-width: 100%;">
                        <v-sheet class="pa-1">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="begin">
                                    <v-btn color="grey lighten-1" outlined>解包BIN</v-btn>
                                    </v-col>
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn icon color="grey lighten-1" class="mr-3" @click="format_bin">
                                        <v-icon>mdi-format-paint</v-icon>
                                    </v-btn>
                                </v-col>

                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-1 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor id="bin" :script="bin" type="etbin" @change="on_change" />
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
                                    <v-btn color="grey lighten-1" outlined @click="pack">打包</v-btn>
                                </v-col>
                                <v-col cols="6" class="ma-0 pa-1 pr-2" align="end">
                                    <v-btn color="grey lighten-1" icon class="mr-3">
                                        <v-icon>mdi-brightness-auto</v-icon>
                                    </v-btn>
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

                        <v-data-table>
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
            parse_outs: function(recorder) {
                for(let key in recorder) {
                    console.log(key, recorder[key])
                }
            },
            read_out: async function() {
                if(this.reading) {
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
                if(res && res.debug && res.debug.length>0) {
                    this.last_time = res.debug[res.debug.length-1].$time;
                    if(res.stop) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    let err = res.debug.find(it => it.tag && it.tag.is_error);
                    if(err) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.$store.commit('setMsgError', err.text);
                    }
                }
                if(res && res.recorder) {
                    this.parse_outs(res.recorder);
                }
            },
            start_read_out: function() {
                this.last_time = -1;
                if(this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                let self = this;
                this.timer = setInterval(async ()=>{
                    await self.read_out();
                }, 40);
            },
            pack: async function() {
                if(this.valid_msg()) {
                    let info = {
                        proj_id: this.proj_id,
                        id: this.doc_id, 
                        name: this.title,
                        prot_id: this.doc_id,
                        script: cfg.script.pack,
                        vars: { action: 'pack', prot: this.title, msg: this.omsg }
                    };
                    let res = await run.run_test(info);
                    if(res.result !== 'ok') {
                        this.$store.commit('setMsgError', res.value);
                    } else {
                        this.start_read_out();
                    }
                }
            },
            format_hex: function() {
                if(!formater.valid_hex(this.hex)) {
                    this.$store.commit('setMsgError', '数据格式无效');
                    return false;
                }
                this.hex = formater.format_hex(this.hex);
                this.bin = formater.hex2bin(this.hex);
                return true;
            },
            format_bin: function() {
                if(!formater.valid_bin(this.bin)) {
                    this.$store.commit('setMsgError', '数据格式无效');
                    return false;
                }
                this.bin = formater.format_bin(this.bin);
                this.hex = formater.bin2hex(this.bin);
                return true;
            },
            valid_msg: function() {
                if(!this.msg || !this.msg.trim()) {
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
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.frm = h.load_frm(content.items);
            }
        }
    }
</script>