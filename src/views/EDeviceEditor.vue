<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-editor-bar :items="bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1}" :kind="cfg.kind"
                @action="on_action">
                <template v-slot:new_sheet="{new_data}">
                    <e-editor-sheet :data="new_data" :widgets="cfg.new_widgets" :hide_name="true" :max_width="260" />
                </template>
            </e-editor-bar>
            <div style="height: calc(100vh - 90px);  overflow-y:auto">
                <v-data-table :headers="headers" :items="content.items" no-data-text="空" disable-sort
                    hide-default-footer disable-pagination>
                    <template v-slot:top>
                        <v-text-field dense v-model="content.memo" placeholder="设备说明" label="说明" class="px-4 pt-4 pb-1"
                            outlined hide-details @change="save_doc">
                        </v-text-field>
                    </template>
                    <template v-slot:item="{item}">
                        <tr>
                            <td @click.stop="current_row=item" class="mt-0">
                                <v-icon small class="pt-0" :color="item===current_row?'primary':''"
                                    style="cursor:pointer;">
                                    {{item===current_row?'mdi-radiobox-marked':'mdi-radiobox-blank'}}
                                </v-icon>
                            </td>
                            <td>
                                <v-chip class="ma-1" @click.stop="current_row=item">
                                    {{item.kind}}
                                </v-chip>
                                <v-tooltip v-if="error_obj[item.id]" right color='red lighten-1'>
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="red lighten-1" v-on="on">mdi-alert</v-icon>
                                    </template>
                                    <span>{{errtip_fmt(error_obj[item.id])}}</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <e-editor-dlg :text="item.name" :memo="item.memo" :data="{name: item.name, memo: item.memo}"
                                    :id="item.id" :widgets="cfg.name_widgets" @save="on_edited_name_memo"
                                    :hide_name="true">
                                </e-editor-dlg>
                            </td>
                            <td>
                                <e-editor-dlg :text="obj_fmt(item.config)" :data="item.config" :id="item.id"
                                    :widgets="cfg.intf_widgets[item.kind]" :title="`${title}.${item.name}`"
                                    @save="on_edited_cfg">
                                </e-editor-dlg>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_device';
    import lman from '../helper/list_man';
    import shortid from 'shortid';
    import helper from '../helper/helper';
    import EEditorBar from '../components/EEditorBar';
    import RedoUndo from '../helper/redo_undo';
    import EEditorSheet from '../components/widgets/EEditorSheet';
    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-editor-sheet': EEditorSheet,
            'e-editor-dlg': () => import( /* webpackChunkName: "eeditordlg" */ '../components/EEditorDlg'),
        },
        mounted: function () {
            this.$store.commit('clearEditor');
            this.redo_undo = new RedoUndo();
            this.doc_id = this.$route.params.doc_id;
            if (!this.doc_id) {
                return;
            }
            this.bar_items = this.cfg.bar_items;
            this.headers = this.cfg.headers;
            this.load_doc();
        },

        data() {
            return {
                doc_id: null,
                cfg: cfg,
                kind: cfg.kind,
                bar_items: [],
                headers: [],
                content: {
                    items: [],
                    memo: ''
                },
                current_row: null,
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
                res = res.device;
                if (!res) {
                    return {}
                }
                return res[this.doc_id] || {};
            }
        },
        watch: {
            current_row: function (v) {
                this.$store.commit('setSeleCount', v ? 1 : 0);
            }
        },
        methods: {
            obj_fmt: function (o) {
                return helper.obj_fmt(o);
            },
            // name_fmt: function (it) {
            //     return it.name + (it.memo ? `  (${it.memo})` : '');
            // },
            errtip_fmt: function (errs) {
                if (!errs) {
                    return '';
                }
                let res = errs.map(it => it.msg);
                return res.join('; ');
            },
            update_redo_undo: function () {
                this.$store.commit('setRedoUndo', {
                    redo_count: this.redo_undo.redoCount,
                    undo_count: this.redo_undo.undoCount
                });
            },
            get_new_items_: function (data) {
                if (!data.type) {
                    return null;
                }
                let count = isNaN(data.count) ? 1 : Number.parseInt(data.count);
                if (count <= 0) {
                    count = 1;
                } else if (count > 20) {
                    count = 20;
                }
                let dcfg = this.cfg.intf_default[data.type];
                let nd = {
                    id: shortid.generate(),
                    name: data.name || '',
                    memo: '',
                    kind: data.type,
                    config: JSON.parse(JSON.stringify(dcfg)),
                };
                let res = [];
                if (count > 1) {
                    for (let i = 0; i < count; i++) {
                        let ndd = JSON.parse(JSON.stringify(nd));
                        ndd.name = nd.name + (i + 1);
                        ndd.id = shortid.generate();
                        res.push(ndd);
                    }
                } else {
                    res.push(nd);
                }
                return res;
            },
            new_item_after: function (data) {
                let ns = this.get_new_items_(data);
                if (!ns) {
                    return false;
                }
                let idx = lman.insertAfter(this.content.items, this.current_row, ns);
                this.current_row = this.content.items[idx];
                return true;
            },
            new_item_before: function (data) {
                let ns = this.get_new_items_(data);
                if (!ns) {
                    return false;
                }
                let idx = lman.insertBefore(this.content.items, this.current_row, ns);
                this.current_row = this.content.items[idx];
                return true;
            },
            move_up: function () {
                return lman.moveUp(this.content.items, this.current_row);
            },
            move_down: function () {
                return lman.moveDown(this.content.items, this.current_row);
            },
            copy: function () {
                if (!this.current_row) {
                    return false;
                }
                this.$store.commit('setCopyObject', {
                    kind: this.cfg.kind,
                    obj: this.current_row
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
                let idx = lman.insertAfter(this.content.items, this.current_row, [obj]);
                this.current_row = this.content.items[idx];
                return true;
            },
            undo: function () {
                let its = this.redo_undo.popUndo();
                if (its) {
                    this.content = its;
                    this.current_row = null;
                    return true;
                }
            },
            redo: function () {
                let its = this.redo_undo.popRedo();
                if (its) {
                    this.content = its;
                    this.current_row = null;
                    return true;
                }
            },
            del_item: function () {
                if (!this.current_row) {
                    return false;
                }
                let idx = this.content.items.findIndex(it => it === this.current_row);
                lman.removeItem(this.content.items, this.current_row);
                this.current_row = this.content.items[idx];
                return true;
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
            on_edited: function () {
                this.save_doc();
                this.redo_undo.pushChange(this.content);
                this.update_redo_undo();
            },
            on_edited_name_memo: function (id, info) {
                let it = this.content.items.find(it => it.id === id);
                it.name = info.name || '';
                it.memo = info.memo || '';
                this.on_edited();
            },
            on_edited_cfg: function (id, cfg) {
                this.content.items.find(it => it.id === id).config = cfg;
                this.on_edited();
            },
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.content.items = content.items || [];
                this.content.memo = content.memo || '';
                this.redo_undo.reset(this.content);
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: this.content
                };
                await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>