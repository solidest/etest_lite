<template>
    <v-container class="pa-0 ma-0 fill-height" fluid>
        <v-card height="100%" width="100%" class="ma-0 pa-0" tile color="grey darken-3">
            <e-editor-bar class="pa-0 ma-0" :items="cfg.bar_items" :title="title" :icon="cfg.icon" @action="on_action"
                :editor="editor">
            </e-editor-bar>
            <div :style="{height: `calc(100vh - ${80+out_height}px)`}" class="pa-0 ma-0">
                <e-editor :script="script" @change="save_doc" ref="editor"> </e-editor>
            </div>
            <v-sheet :style="{position:'absolute', left:'0px', bottom: '1px'}" class="ma-0 pa-0"
                color="primary" width="100%" :height="out_height" tile>
                <v-row class="px-3 py-1 ma-0">
                    <v-col class="pa-0 ma-0 flex-grow-0 flex-shrink-1"  style="min-width: 26px; max-width: 26px;" cols=1 >
                        <v-icon small class="pa-0 ma-0" style="cursor: pointer;"
                            @click="goto_line(check_result.line)">
                            {{is_check_error ? 'mdi-close-circle':'mdi-check'}}
                        </v-icon>
                    </v-col>
                    <v-col class="pa-0 ma-0 pr-3 flex-grow-1 flex-shrink-0"  style="min-width: 200px; max-width: 100%;" cols=11>
                        <span style="cursor: pointer;" class="text-shenglue"
                            @click="goto_line(check_result.line)">{{check_result.tip}}</span>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-card>
    </v-container>
</template>
<style scoped>
    .text-shenglue {
        display: block;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
    }
</style>
<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_xtra';
    import complition from '../language/complition';
    import EEditorBar from '../components/widgets/EScriptToolBar';
    import EEditor from '../components/ELuaScriptEditor';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-editor': EEditor,
        },
        mounted: function () {
            this.$store.commit('clearEditor');
            this.kind = this.$route.params.doc_id;
            if (!this.kind) {
                return;
            }
            this.editor = this.$refs.editor.get_action_handler();
            this.script = this.proj.xtra[this.kind] || cfg['default_'+this.kind]();
            complition.set_env([], [], {}, {});
        },
        data() {
            return {
                cfg: cfg,
                kind: '',
                script: '',
                editor: {},
                out_height: 30,
            }
        },
        computed: {
            is_check_error: function () {
                return this.check_result.line >= -1;
            },
            title: function () {
                let ed = this.$store.state.edit_doc;
                return ed ? ed.doc.name : '';
            },
            proj: function () {
                return this.$store.state.proj;
            },
            error_obj: function () {
                let res = this.$store.getters.check_result;
                if (!res) {
                    return {}
                }
                res = res.project;
                if (!res) {
                    return {}
                }
                return res[this.kind] || {};
            },
            check_result: function () {
                let res = {
                        line: -100,
                        tip: '代码检查通过'
                    };
                let err = this.error_obj;
                if (!err || !err.$count) {
                    this.set_err_tip(-1);
                    return res;
                }
                let msgs = [];
                for (let key in err) {
                    if (key.startsWith('$')) {
                        continue;
                    }
                    let ls = err[key];
                    ls.forEach(l => {
                        if (l.type === 'error') {
                            msgs.push(l.msg);
                            let line = Number.parseInt(key);
                            if(res.line === -100) {
                                res.line = line;
                                this.set_err_tip(line, l.msg);
                            }
                        }
                    });
                }
                if(msgs.length >0 ){
                    res.tip = msgs.join('; ');                
                }
                if(res.line === -100) {
                    this.set_err_tip(-1);
                }
                return res;
            },
        },
        methods: {
            set_err_tip: function (line, msg) {
                if (!this.editor || !this.editor.set_err) {
                    return;
                }
                this.editor.set_err(line, msg);
            },
            goto_line: function (line) {
                if (line < 0 || !this.editor) {
                    return;
                }
                this.editor.goto_line(line);
            },
            on_action: function (ac, data) {
                if (this[ac](data)) {
                    this.save_doc();
                }
            },
            save_doc: async function (value) {
                this.proj.xtra[this.kind] = value;
                ipc.update_proj(this.proj);
            },
        }
    }
</script>