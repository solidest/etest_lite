<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-editor-bar :items="bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1, name:''}"
                :kind="cfg.kind" @action="on_action">
                <template v-slot:new_sheet="{new_data}">
                    <e-editor-sheet :data="new_data" :widgets="cfg.new_widgets" :hide_name="true" :max_width="260" />
                </template>
            </e-editor-bar>
            <div style="height: calc(100vh - 90px);  overflow-y:auto">
                <v-data-table :headers="headers" :items="draw_items" no-data-text="空" disable-sort hide-default-footer
                    disable-pagination>
                    <template v-slot:top>
                        <v-text-field dense v-model="content.memo" placeholder="协议说明" label="说明" class="px-4 pt-4 pb-1"
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
                                <e-editor-dlg v-if="item.kind!=='oneof'" :text="name_fmt(item)" :data="{name: item.name, memo: item.memo}"
                                    :id="item.id" :widgets="cfg.name_widgets" @save="on_edited_name_memo"
                                    :hide_name="true" :cls="`pl-${item.level*4}`">
                                </e-editor-dlg>
                            </td>
                            <td>
                                <span v-if="item.kind==='oneof'" class="ml-3" style="cursor: pointer">---</span>
                                <span v-if="item.kind==='segments'" class="ml-3">{  }</span>
                                <v-chip v-else-if="item.kind==='segment'" class="ma-1" @click.stop="current_row=item">
                                    {{item.kind}}
                                </v-chip>
                                <!-- <v-tooltip v-if="error_obj[item.id]" right color='red lighten-1'>
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="red lighten-1" v-on="on">mdi-alert</v-icon>
                                    </template>
                                    <span>{{errtip_fmt(error_obj[item.id])}}</span>
                                </v-tooltip> -->
                            </td>
                            <td>
                                <!-- <e-editor-dlg :text="obj_fmt(item.config)" :data="item.config" :id="item.id"
                                    :widgets="cfg.intf_widgets[item.kind]" :title="`${title}.${item.name}`"
                                    @save="on_edited_cfg">
                                </e-editor-dlg> -->
                                <span>  {{item.to_code()}}
                                </span>
                            </td>
                             <td>
                                <span>  {{item.level}}
                                </span>
                            </td>
                             <td>
                                <span>  {{item.deep}}
                                </span>
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
    import cfg from '../helper/cfg_protocol';
    import h from '../feature/f_protocol';
    // import lman from '../helper/list_man';
    // import shortid from 'shortid';
    // import helper from '../helper/helper';
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
            this.cfg.bar_items[0].disabled = this.disabled_sub_insert;
        },

        data() {
            return {
                doc_id: null,
                bar_items: [],
                cfg: cfg,
                kind: cfg.kind,
                headers: [],
                content: {
                    memo: '',
                    bitalign: 'bitlr',
                    frm: null,
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
            draw_items: function () {
                if (!this.content.frm) {
                    return [];
                }
                return this.content.frm.draw_items || [];
            }
        },
        watch: {
            current_row: function (v) {
                this.$store.commit('setSeleCount', v ? 1 : 0);
            }
        },
        methods: {
            name_fmt: function (it) {
                return it.full_name() + (it.memo ? `  (${it.memo})` : '');
            },
            disabled_sub_insert: function() {
                return !(this.current_row && this.current_row.kind==='segments');
            },
            get_save_obj: function () {
                return {
                    items: this.content.frm.save(),
                    memo: this.content.memo,
                    bitalign: this.content.bitalign
                }
            },
            restore_from_obj: function (obj) {
                this.content.memo = obj.memo || '',
                    this.content.bitalign = obj.bitalign || 'bitlr';
                this.content.frm = h.load_frm(obj.items);
            },
            update_redo_undo: function () {
                this.$store.commit('setRedoUndo', {
                    redo_count: this.redo_undo.redoCount,
                    undo_count: this.redo_undo.undoCount
                });
            },

            new_item_after: function (data) {
                let res = h.insert(this.content.frm, this.current_row, data.type, data.name, data.count, 1);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                return false;
            },
            new_item_before: function (data) {
                let res = h.insert(this.content.frm, this.current_row, data.type, data.name, data.count, 0);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                return false;
            },
            new_item_sub: function (data) {
                let res = h.insert(this.content.frm, this.current_row, data.type, data.name, data.count, -100);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                return false;
            },
            move_up: function () {

            },
            move_down: function () {

            },
            copy: function () {

            },
            paste: function () {

            },
            undo: function () {
                let content = this.redo_undo.popUndo();
                if (content) {
                    this.restore_from_obj(content);
                    this.current_row = null;
                    return true;
                }
            },
            redo: function () {
                let content = this.redo_undo.popRedo();
                if (content) {
                    this.restore_from_obj(content);
                    this.current_row = null;
                    return true;
                }
            },
            del_item: function () {

            },
            on_action: function (ac, data) {
                if (this[ac](data)) {
                    this.save_doc();
                    if (!(ac === 'redo' || ac === 'undo')) {

                        this.redo_undo.pushChange(this.get_save_obj());
                    }
                    this.update_redo_undo();
                }
            },
            on_edited: function () {
                this.save_doc();
                this.redo_undo.pushChange(this.get_save_obj());
                this.update_redo_undo();
            },
            on_edited_name_memo: function (id, info) {
                let it = this.content.frm.draw_items.find(it => it.id === id);
                it.update_name_memo(info.name, info.memo);
                this.on_edited();
            },
            on_edited_cfg: function (id, cfg) {
                console.log('on_edited_cfg', id, cfg);
            },
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.restore_from_obj(content);
                this.redo_undo.reset(content);
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: this.get_save_obj(),
                };
                await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>