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
                                <v-text-field dense v-model="memo" placeholder="监控面板说明" label="说明" class="px-0 pt-0 pb-1"
                                    outlined hide-details @change="save_doc">
                                </v-text-field>
                            </v-col>
                            <v-col class="pa-0 ma-0" cols=2>
                                <v-checkbox class="pl-3 pr-0 pt-1 pb-1 ma-0" hide-details v-model="show_line"
                                    label="显示边框" @change="save_doc" @selected="on_selected">
                                </v-checkbox>
                            </v-col>
                        </v-row>
                        <div :style="{height: 'calc(100vh - 155px)', width: '100%'}">
                            <e-panel :layout="layout" :cfg="cfg" :show_line="show_line" :design="show_cfg"
                                @change="on_changed" :recorder="recorder" :commander="commander"
                                @selected="on_selected">
                            </e-panel>
                        </div>
                    </v-col>
                    <v-col v-if="show_cfg" cols="4" class="pa-0 ma-0 flex-grow-0 flex-shrink-1"
                        style="min-width: 300px; max-width: 480px; ">
                        <div style="height: calc(100vh - 92px); width: 100%; overflow-y:auto;">
                            <v-expansion-panels accordion flat>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>界面配置</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>数据配置</v-expansion-panel-header>
                                    <v-expansion-panel-content class="pa-0 ma-0">
                                        <e-data-editor :recorder="recorder" :commander="commander" ref="script_editor"> </e-data-editor>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import shortid from 'shortid';
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_panel';
    import RedoUndo from '../helper/redo_undo';
    import EEditorBar from '../components/EEditorBar';
    import EPanel from '../components/panel/EPanel';
    import EPanelDataEditor from '../components/EPanelDataEditor';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-panel': EPanel,
            'e-data-editor': EPanelDataEditor,
        },
        mounted: function () {
            this.$store.commit('clearEditor');
            this.doc_id = this.$route.params.doc_id;
            this.redo_undo = new RedoUndo();
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
                recorder: {},
                commander: {},
            }
        },
        watch: {
            selected: function (v) {
                this.$store.commit('setSeleCount', v ? 1 : 0);
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
            get_content: function () {
                return {
                    layout: this.layout,
                    memo: this.memo,
                    show_line: this.show_line,
                    commander: this.commander,
                    recorder: this.recorder
                }
            },
            get_last_y: function () {
                let last_y = 0;
                if (this.layout.length === 1) {
                    last_y = this.layout[0].y + this.layout[0].h + 1;
                } else if (this.layout.length > 1) {
                    last_y = this.layout.reduce((n1, n2) => {
                        return (n1.y + n1.h) > (n2.y + n2.h) ? (n1.y + n1.h) : (n2.y + n2.h)
                    }) + 1;
                }
                return last_y;
            },
            load_content: function (content) {
                this.memo = content.memo || '';
                this.layout = content.layout || [];
                this.show_line = content.show_line;
                this.recorder = content.recorder || {};
                this.commander = content.commander || {};
            },
            d_show_hide_cfg: function () {
                this.show_cfg = !this.show_cfg;
                return false;
            },
            on_selected: function (item) {
                this.selected = item;
            },
            update_redo_undo: function () {
                this.$store.commit('setRedoUndo', {
                    redo_count: this.redo_undo.redoCount,
                    undo_count: this.redo_undo.undoCount
                });
            },
            del_item: function () {
                let idx = this.layout.findIndex(it => it === this.selected);
                if (idx >= 0) {
                    this.layout.splice(idx, 1);
                    this.selected = null;
                    return true;
                }
            },
            d_new_widgets: function () {
                let last_y = this.get_last_y();
                let id = shortid.generate();
                this.layout.push({
                    x: 0,
                    y: last_y,
                    w: 6,
                    h: 6,
                    i: id,
                    id: id,
                    kind: "widgets",
                    items: [],
                    title: '',
                });
                return true;
            },
            d_new_chart: function () {
                let last_y = this.get_last_y();
                let id = shortid.generate();
                this.layout.push({
                    x: 0,
                    y: last_y,
                    w: 16,
                    h: 10,
                    i: id,
                    id: id,
                    kind: "widgets",
                    items: [],
                    title: '',
                });
                return true;
            },
            on_changed: function () {
                this.save_doc();
                this.redo_undo.pushChange(this.get_content());
                this.update_redo_undo();
                this.selected = null;
            },
            undo: function () {
                let ct = this.redo_undo.popUndo();
                if (ct) {
                    this.load_content(ct);
                    this.selected = null;
                    return true;
                }
            },
            redo: function () {
                let ct = this.redo_undo.popRedo();
                if (ct) {
                    this.load_content(ct);
                    this.selected = null;
                    return true;
                }
            },
            copy: function () {
                if (!this.selected) {
                    return false;
                }
                // console.log(this.cfg.kind, this.selected)
                this.$store.commit('setCopyObject', {
                    kind: this.cfg.kind,
                    obj: this.selected
                });
                return false;
            },
            paste: function () {
                let str = this.$store.state.copys[this.cfg.kind];
                if (!str) {
                    return false;
                }
                let obj = JSON.parse(str);
                obj.id = shortid.generate();
                obj.i = obj.id;
                obj.x = 0;
                obj.y = this.get_last_y();
                this.layout.push(obj);
                this.selected = null;
                return true;
            },
            on_action: function (ac, data) {
                console.log('ac', ac)
                if (this[ac](data)) {
                    this.save_doc();
                    if (!(ac === 'redo' || ac === 'undo')) {
                        this.redo_undo.pushChange(this.get_content());
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
                    this.load_content(doc.content);
                } else {
                    let layout = JSON.parse(JSON.stringify(cfg.default_layout));
                    layout.forEach(it => it.id = shortid.generate());
                    this.layout = layout;
                }
                this.redo_undo.reset(this.get_content());
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: this.get_content(),
                };
                ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>