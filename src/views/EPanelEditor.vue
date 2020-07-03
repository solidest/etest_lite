<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-editor-bar :items="cfg.bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1}"
                :kind="cfg.kind" @action="on_action">
            </e-editor-bar>
            <div style="height: calc(100vh - 90px); width:100%;  overflow-y:auto;">
                <v-row class="pa-0 ma-0" style="flex-wrap: nowrap;">
                    <v-col cols="1" class="pt-4 px-4 pb-0 ma-0 flex-grow-1 flex-shrink-0"
                        style="min-width: 100px; max-width: 100%;">
                        <v-row v-if="show_cfg" class="pa-0 ma-0">
                            <v-col class="pa-0 ma-0" cols=10>
                                <v-text-field dense v-model="memo" placeholder="监控说明" label="说明" class="px-0 pt-0 pb-1"
                                    outlined hide-details @change="save_doc">
                                </v-text-field>
                            </v-col>
                            <v-col class="pa-0 ma-0" cols=2>
                                <v-checkbox class="pl-3 pr-0 pt-1 pb-1 ma-0" hide-details v-model="show_line"
                                    label="显示边框" @change="save_doc" @selected="on_selected" >
                                </v-checkbox>
                            </v-col>
                        </v-row>
                        <div style="height: calc(100vh - 155px); width: 100%;">
                            <e-panel :layout="layout" :cfg="cfg" :show_line="show_line" @change="save_doc"
                                :recorder="recorder" :commander="commander">
                            </e-panel>
                        </div>
                    </v-col>
                    <v-col v-if="show_cfg" cols="3" class="pa-0 ma-0 flex-grow-0 flex-shrink-1"
                        style="min-width: 300px; max-width: 380px;">
                        <div style="height: calc(100vh - 92px); width: 100%; overflow-y:auto;">
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_panel';
    import EEditorBar from '../components/EEditorBar';
    import EPanel from '../components/EPanel';
    import shortid from 'shortid';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-panel': EPanel,
        },
        mounted: function () {
            this.$store.commit('clearEditor');
            this.doc_id = this.$route.params.doc_id;
            if (!this.doc_id) {
                return;
            }
            this.load_main();
        },

        data() {
            return {
                doc_id: null,
                cfg: cfg,
                layout: [],
                kind: cfg.kind,
                selected: null,
                show_cfg: true,
                memo: '',
                show_line: true,
                recorder: {ip: 'sss'},
                commander: {},
                recorder_: {},
                commander_: {},
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
            config: function () {
                if (!this.selected) {
                    return {}
                } else {
                    return {
                        data: this.selected.config,
                        editor: this.cfg[this.selected.kind]
                    }
                }
            },
        },
        methods: {
            d_show_hide_cfg: function () {
                this.show_cfg = !this.show_cfg;
                return false;
            },
            on_selected: function (item) {
                this.selected = item;
            },
            on_action: function (ac, data) {
                if (this[ac](data)) {
                    this.save_doc();
                    if (!(ac === 'redo' || ac === 'undo')) {
                        this.redo_undo.pushChange(this.content);
                    }
                    this.update_redo_undo();
                }
            },
            load_main: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                if (doc && doc.content) {
                    this.memo = doc.content.memo || '';
                    this.layout = doc.content.layout || [];
                    this.show_line = doc.content.show_line;
                    this.recorder_ = doc.content.recorder || {};
                    this.commander_ = doc.content.commander || {};
                } else {
                    let layout = JSON.parse(JSON.stringify(cfg.default_layout));
                    layout[0].id = shortid.generate();
                    layout[1].id = shortid.generate();
                    this.layout = layout;
                }
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: {
                        layout: this.layout,
                        memo: this.memo,
                        show_line: this.show_line,
                        commander: this.commander_,
                        recorder: this.recorder_
                    }
                };
                ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>