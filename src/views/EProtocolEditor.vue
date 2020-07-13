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
                        <v-row class="pa-0 ma-0">
                            <v-col class="pa-0 ma-0" cols=10>
                                <v-text-field dense v-model="content.memo" placeholder="协议说明" label="说明"
                                    class="px-4 pt-4 pb-1" outlined hide-details @change="save_doc">
                                </v-text-field>
                            </v-col>
                            <v-col class="pa-0 ma-0" cols=2>
                                <v-select class="px-3" :items="cfg.bitaligns" hide-details v-model="content.bitalign"
                                    @change="save_doc">
                                </v-select>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-slot:item="{item}">
                        <tr>
                            <!-- 选择 -->
                            <td @click.stop="current_row=item">
                                <v-icon small :color="item===current_row?'primary':''" style="cursor:pointer;" >
                                    {{item===current_row?'mdi-radiobox-marked':'mdi-radiobox-blank'}}
                                </v-icon>
                            </td>
                            <!-- oneof连线 -->
                            <td class="pa-0 ma-0">
                                <div style="width: 100%; height: 100%; ">
                                    
                                    <div v-if="item.deep>0" style="width: 100%; height: 100%; ">
                                        <div v-for="index of item.deep" :key="index"
                                            style="width: 10px; height: 100%; margin: 0px; border-left: 1px solid grey; display: inline-block">
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <!-- 名称数组长度 -->
                            <td>
                                <div class="d-flex">
                                <e-condition-editor v-if="item.kind==='oneof'" text="..." :items="item.conditions()"
                                    :id="item.id" :cls="`pl-${item.level*4}`" @save="on_edited_conditions">
                                </e-condition-editor>
                                <e-editor-dlg v-else :text="fmt_name_arrlen(item)" :memo="item.memo"
                                    :data="{name: item.name, memo: item.memo, arrlen:item.arrlen}" :id="item.id"
                                    :widgets="cfg.name_widgets" @save="on_edited_name_arrlen" :hide_name="true"
                                    :cls="`pl-${item.level*4}`">
                                </e-editor-dlg>
                                <v-tooltip v-if="error_obj[item.id]" right color="red lighten-1">
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="red lighten-1" v-on="on" class="ml-2 mt-0">mdi-alert</v-icon>
                                    </template>
                                    <span>{{errtip_fmt(error_obj[item.id])}}</span>
                                </v-tooltip>
                                </div>
                            </td>
                            <!-- 解析类型 -->
                            <td>
                                <e-editor-dlg v-if="item.kind==='segments'" :text="'{ }'" cls="grey--text"
                                    :data="{autovalue: item.autovalue}" :id="item.id" :widgets="cfg.autovalue_widgets"
                                    @save="on_edited_autovalue">
                                </e-editor-dlg>
                                <e-editor-dlg v-else-if="item.kind==='segment'" :text="item.parser"
                                    :data="{parser: item.parser, autovalue: item.autovalue, length: item.length, endwith: item.endwith}"
                                    :id="item.id" :widgets="cfg.config_widgets" @save="on_edited_config">
                                </e-editor-dlg>
                                <e-condition-editor v-else-if="item.kind==='oneof'" :text="item.condition" cls="grey--text"	
                                    :items="item.conditions()" :id="item.id" @save="on_edited_conditions">	
                                </e-condition-editor>
                            </td>
                            <!-- 配置 -->
                            <td>
                                <e-editor-dlg v-if="item.kind==='segments'" :text="item.config"
                                    :data="{autovalue: item.autovalue}" :id="item.id" :widgets="cfg.autovalue_widgets"
                                    @save="on_edited_autovalue">
                                </e-editor-dlg>
                                <e-editor-dlg v-else-if="item.kind==='segment'" :text="item.config"
                                    :data="{parser: item.parser, autovalue: item.autovalue, length: item.length, endwith: item.endwith}"
                                    :id="item.id" :widgets="cfg.config_widgets" @save="on_edited_config">
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
    import Mousetrap from 'mousetrap';
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_protocol';
    import h from '../feature/f_protocol';
    import EEditorBar from '../components/EEditorBar';
    import RedoUndo from '../helper/redo_undo';
    import EEditorSheet from '../components/widgets/EEditorSheet';
    
    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-editor-sheet': EEditorSheet,
            'e-editor-dlg': () => import( /* webpackChunkName: "eeditordlg" */ '../components/EEditorDlg'),
            'e-condition-editor': () => import( /* webpackChunkName: "econditioneditordlg" */
                '../components/widgets/EEditorOneofDlg'),
        },
        created: function() {
            let self = this;
            Mousetrap.bind('ctrl+x', () => self.on_action('cut'));
            Mousetrap.bind('ctrl+c', () => self.on_action('copy'));
            Mousetrap.bind('ctrl+v', () => self.on_action('paste'));
            Mousetrap.bind('ctrl+z', () => self.on_action('undo'));
            Mousetrap.bind('ctrl+y', () => self.on_action('redo'));
            Mousetrap.bind('del', () => self.on_action('del_item'));
        },
        beforeDestroy: function() {
            Mousetrap.bind('ctrl+x', ()=>{});
            Mousetrap.bind('ctrl+c', ()=>{});
            Mousetrap.bind('ctrl+v', ()=>{});
            Mousetrap.bind('ctrl+z', ()=>{});
            Mousetrap.bind('ctrl+y', ()=>{});
            Mousetrap.bind('del', ()=>{});
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
            },
            error_obj: function () {
                let res = this.$store.getters.check_result;
                if (!res) {
                    return {}
                }
                res = res[this.kind];
                if (!res) {
                    return {}
                }
                // console.log(res[this.doc_id])
                return res[this.doc_id] || {};
            }
        },
        watch: {
            current_row: function (v) {
                this.$store.commit('setSeleCount', v ? 1 : 0);
            }
        },
        methods: {
            fmt_name_arrlen: function (item) {
                if (item.arrlen && item.arrlen.trim()) {
                    return `${item.full_name()} [ ${item.arrlen.trim()} ]`;
                } else {
                    return item.full_name();
                }
            },
            errtip_fmt: function (errs) {
                if (!errs) {
                    return '';
                }
                let res = errs.map(it => it.msg);
                return res.join('; ');
            },
            disabled_sub_insert: function () {
                return !(this.current_row && ['segments', 'oneof'].includes(this.current_row.kind));
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
                let res = h.insert(this.content.frm, this.current_row, data, 1);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                this.current_row = null;
                return false;
            },
            new_item_before: function (data) {
                let res = h.insert(this.content.frm, this.current_row, data, 0);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                this.current_row = null;
                return false;
            },
            new_item_sub: function (data) {
                let res = h.insert(this.content.frm, this.current_row, data, -1);
                if (res && res.length > 0) {
                    this.current_row = res[0];
                    return true;
                }
                this.current_row = null;
                return false;
            },
            move_up: function () {
                return h.moveup(this.content.frm, this.current_row);
            },
            move_down: function () {
                return h.movedown(this.content.frm, this.current_row);
            },
            copy: function () {
                if (!this.current_row) {
                    return false;
                }
                this.$store.commit('setCopyObject', {
                    kind: this.cfg.kind,
                    obj: h.copy(this.current_row),
                });
                return false;
            },
            paste: function () {
                let str = this.$store.state.copys[this.cfg.kind];
                if (!str) {
                    return false;
                }
                let obj = JSON.parse(str);
                this.current_row = h.paste(this.content.frm, this.current_row, obj);
                return true;
            },
            cut: function() {
                this.copy();
                return this.del_item();
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
                if (!this.current_row) {
                    return false;
                }
                let idx = this.content.frm.draw_items.findIndex(it => it === this.current_row);
                h.remove(this.content.frm, this.current_row);
                this.current_row = idx < this.content.frm.draw_items.length ? this.content.frm.draw_items[idx] :
                    null;
                return true;
            },
            on_action: function (ac, data) {
                console.log('ac', ac);
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
                this.current_row = this.content.frm.draw_items.find(it => it === this.current_row);
            },
            on_edited_autovalue: function (id, info) {
                let it = this.content.frm.draw_items.find(it => it.id === id);
                it.udpate_autovalue(info.autovalue);
                this.on_edited();
            },
            on_edited_name_arrlen: function (id, info) {
                let it = this.content.frm.draw_items.find(it => it.id === id);
                it.update_name_arrlen(info.name, info.memo, info.arrlen);
                this.on_edited();
            },
            on_edited_config: function (id, cfg) {
                let it = this.content.frm.draw_items.find(it => it.id === id);
                it.update_config(cfg.parser, cfg.autovalue, cfg.length, cfg.endwith);
                this.on_edited();
            },
            on_edited_conditions: function (id, conditions, sel_id) {
                h.udpate_conditions(this.content.frm, id, conditions, sel_id);
                this.on_edited();
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