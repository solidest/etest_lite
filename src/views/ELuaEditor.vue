<template>
    <v-container class="pa-0 ma-0 fill-height" fluid>
        <v-card height="100%" width="100%" class="ma-0 pa-0" tile color="grey darken-3">
            <e-editor-bar class="pa-0 ma-0" :items="cfg.bar_items" :title="title" :icon="cfg.icon" @action="on_action"
                :editor="editor" :option="content.option">
            </e-editor-bar>
            <div :style="{height: `calc(100vh - ${80+out_height}px)`}" class="pa-0 ma-0">
                <e-editor :script="content.script" @change="save_script" ref="editor"> </e-editor>
            </div>
            <v-sheet style="position:absolute; left:0px; bottom:1px; z-index:100" class="ma-0 pa-0" color="primary"
                width="100%" :height="out_height" tile>
                <v-row class="pa-0 ma-0">
                    <v-col cols="4" class="pl-1 pt-1 pb-0 pr-0 ma-0">
                        <span>静态检查通过</span>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_lua';
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
            error_obj: function () {
                let res = this.$store.getters.check_result;
                if (!res) {
                    return {}
                }
                res = res[cfg.kind];
                if (!res) {
                    return {}
                }
                return res[this.doc_id] || {};
            }
        },
        methods: {
            setting: function (data) {
                this.content.option = data;
                this.save_doc();
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
                this.content.script = content.script || '';
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
                            complition.set_env(self.env.get_dev_list(), self.env.get_proto_list(), self.env.records);
                            let sett = cfg.bar_items.find(it => it.value === 'setting');
                            sett.widgets[1].items = self.env.get_topo_list();
                            sett.widgets[2].items = self.env.get_panel_list();
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
                await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>