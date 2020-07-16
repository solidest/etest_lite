<template>
    <v-container class="pa-0 ma-0 fill-height" fluid>
        <v-card height="100%" width="100%" class="ma-0 pa-0" tile color="grey darken-3" :loading="loading">
            <e-editor-bar class="pa-0 ma-0" :items="cfg.bar_items" :title="title" :icon="cfg.icon" @action="on_action"
                :editor="editor" :option="content.option">
            </e-editor-bar>
            <div :style="{height: `calc(100vh - ${80+out_height}px)`}" class="pa-0 ma-0">
                <e-editor :script="content.script" @change="save_script" ref="editor"> </e-editor>
            </div>
            <v-sheet :style="{position:'absolute', left:'0px', bottom: `${show_out?300+1:2}px`}" class="ma-0 pa-0"
                color="primary" width="100%" :height="out_height" tile>
                <v-row class="px-3 py-1 ma-0">
                    <v-col class="pa-0 ma-0 flex-grow-0 flex-shrink-1" style="min-width: 26px; max-width: 26px;" cols=1>
                        <v-icon small class="pa-0 ma-0" style="cursor: pointer;" @click="goto_line(check_result.line)">
                            {{is_check_error ? 'mdi-close-circle':'mdi-check'}}
                        </v-icon>
                    </v-col>
                    <v-col class="pa-0 ma-0 pr-3 flex-grow-1 flex-shrink-0" style="min-width: 200px; max-width: 800px;"
                        cols=4>
                        <span style="cursor: pointer;" class="text-shenglue"
                            @click="goto_line(check_result.line)">{{check_result.tip}}</span>
                    </v-col>
                    <v-col class="pa-0 ma-0 flex-grow-0 flex-shrink-1" style="min-width: 100px; max-width: 100px;"
                        cols=2>
                        <span>{{x_state}}</span>
                    </v-col>
                    <v-col class="pa-0 ma-0 pl-3 flex-grow-1 flex-shrink-0" style="min-width: 200px; max-width: 800px;"
                        cols=4>
                        <span>{{show_out ? '':run_out}}</span>
                    </v-col>
                    <v-col class="pa-0 ma-0 flex-grow-0 flex-shrink-1" style="min-width: 26px; max-width: 26px;" cols=1>
                        <v-icon small class="pa-0 ma-0" style="cursor: pointer" @click="show_out=!show_out">
                            {{show_out ? 'mdi-chevron-triple-down':'mdi-chevron-triple-up'}}
                        </v-icon>
                    </v-col>
                </v-row>
            </v-sheet>
            <v-sheet v-if="show_out" :style="{position:'absolute', left:'0px', bottom:'1px'}" class="ma-0 pa-0"
                color="grey darken-3" width="100%" height="300" tile>
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
    import hrun from '../run/helper';
    import cfg from '../helper/cfg_lua';
    import run from '../run/run_r';
    import Env from '../feature/f_env';
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
            this.doc_id = this.$route.params.doc_id;
            if (!this.doc_id) {
                return;
            }
            this.bar_items = this.cfg.bar_items;
            this.load_doc();
            this.editor = this.$refs.editor.get_action_handler();
        },
        data() {
            return {
                doc_id: null,
                cfg: cfg,
                kind: cfg.kind,
                bar_items: [],
                content: {
                    script: '',
                    memo: '',
                    option: {},
                },
                out_height: 30,
                editor: {},
                show_out: false,
                version: 0,
                try_run_times: 0,
                loading: false,
                outs: [],
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
            proj_id: function () {
                return this.$store.state.proj.id;
            },
            error_obj: function () {
                let res = this.$store.getters.check_result;
                if (!res) {
                    return {}
                }
                res = res.program;
                if (!res) {
                    return {}
                }
                return res[this.doc_id] || {};
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
                            if (res.line === -100) {
                                res.line = line;
                                this.set_err_tip(line, l.msg);
                            }
                        }
                    });
                }
                if (msgs.length > 0) {
                    res.tip = msgs.join('; ');
                }
                if (res.line === -100) {
                    this.set_err_tip(-1);
                }
                return res;
            },
            x_state: function () {
                return '<执行器状态>';
            },
            run_out: function () {
                return '<无输出>';
            },
            check_version: function () {
                let res = this.$store.state.check_result;
                return res ? res.version : 0;
            }
        },
        methods: {
            do_play: function() {
                this.try_run_times++;
                if(this.try_run_times>10){
                    this.$store.commit('setMsgError', '启动执行失败');
                    this.loading = false;
                    return;
                }
                if (this.check_version !== this.version) {
                    let self = this;
                    setTimeout(() => {
                        self.do_play();
                    }, 300);
                    return;
                }
                let check_res = this.$store.getters.check_result;
                if (hrun.has_error(check_res)) {
                    this.$store.commit('setMsgError', '启动执行失败，因为存在未解决的错误');
                    this.loading = false;
                    return;
                }
                try {
                    let self = this;
                    let info = {id: this.doc_id, proj_id: this.proj_id, remake: true}
                    run.run_script(info).then(outs => {
                        self.outs = outs;
                        self.loading = false;
                    });
                    this.$nextTick(() => {
                        self.show_out = true;
                    });
                } catch (error) {
                    this.loading = false;
                    this.$store.commit('setMsgError', error.message);
                }
            },

            play: async function () {
                if(this.content.option.lib) {
                    this.$store.commit('setMsgError', '已设置为共享库，无法启动执行');
                    return;
                }
                await this.save_doc();
                this.try_run_times = 0;
                this.loading = true;
                let self = this;
                setTimeout(() => {
                    self.do_play();
                }, 300);
                return false;
            },
            stop: function() {
                run.stop_run();
            },
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
            setting: function (data) {
                this.content.option = data;
                this.save_doc();
                complition.set_env(this.env.get_dev_list(), this.env.get_proto_list(),
                    this.env.records, data.vars_obj);
            },
            on_action: function (ac, data) {
                if (this[ac](data)) {
                    this.save_doc();
                }
            },
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.content.script = content.script || cfg.default_script();
                this.content.memo = content.memo || '';
                this.content.option = content.option || cfg.default_option();
                this.load_env();
            },
            load_env: function () {
                let self = this;
                setTimeout(() => {
                    self.env = new Env();
                    self.env.open(self.proj_id, self.content.option.topology, self.content.option.panel)
                        .then(() => {
                            complition.set_env(self.env.get_dev_list(), self.env.get_proto_list(),
                                self.env.records, this.content.option.vars_obj);
                            let sett = cfg.bar_items.find(it => it.value === 'setting');
                            sett.widgets[1].items = self.env.get_topo_list();
                            sett.widgets[2].items = self.env.get_panel_list();
                            let topo_id = self.env.get_only_topo();
                            if (topo_id && self.content.option.topology !== topo_id) {
                                self.content.option.topology = topo_id;
                                self.save_doc();
                            }
                        });
                }, 380);
            },
            save_script: function (script) {
                this.content.script = script;
                this.save_doc();
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: this.content,
                };
                this.version = await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>