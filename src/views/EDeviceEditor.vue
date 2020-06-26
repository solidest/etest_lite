<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-edit-bar :items="bar_items" :title="title" :icon="cfg.icon" :new_items="cfg.new_items"
                :newdef_data="{count:1}" :kind="cfg.kind" @action="on_action">
                <template v-slot:new_sheet="{new_data}">
                    <e-newintf-sheet :data="new_data" :types="cfg.types" />
                </template>
            </e-edit-bar>
            <div style="height: calc(100vh - 90px);  overflow-y:auto">
                <v-data-table :headers="headers" :items="items" v-model="selected" no-data-text="空" disable-sort
                    hide-default-footer disable-pagination single-select show-select>
                    <template v-slot:item.config="{value}">
                        <span> {{value?JSON.stringify(value): ''}}</span>
                    </template>
                    <template v-slot:item.name="props">
                        <v-edit-dialog :return-value.sync="props.item.name"> {{ props.item.name }}
                            <template v-slot:input>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                                <v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:item.config="props">
                        <v-edit-dialog :return-value.sync="props.item.config"> {{ props.item.config }}
                            <template v-slot:input>
                                <v-text-field v-model="props.item.config" label="Edit" single-line counter>
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:item.kind="props">
                        <v-edit-dialog :return-value.sync="props.item.kind"> {{ props.item.kind }}
                            <template v-slot:input>
                                <v-text-field v-model="props.item.kind" label="Edit" single-line counter>
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                </v-data-table>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/device_cfg';
    import EEditBar from '../components/EEditBar';
    import EInterfNewSheet from '../components/sheets/EInterfNewSheet';
    import lman from '../helper/list_man';
    import shortid from 'shortid';
    import RedoUndo from '../helper/redo_undo';
    export default {
        components: {
            'e-edit-bar': EEditBar,
            'e-newintf-sheet': EInterfNewSheet,
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
                bar_items: [],
                headers: [],
                items: [],
                selected: [],
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
            current_row: function () {
                if (!this.selected || this.selected.length === 0) {
                    return null;
                }
                return this.selected[0];
            }
        },
        watch: {
            selected: function (vs) {
                let i = vs ? vs.length : 0;
                this.$store.commit('setSeleCount', i);
            }
        },
        methods: {
            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                this.items = doc ? doc.content : [];
                this.redo_undo.reset(this.items);
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: this.items
                };
                await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
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
                let idx = lman.insertAfter(this.items, this.current_row, ns);
                this.selected = [this.items[idx]];
                return true;
            },
            new_item_before: function (data) {
                let ns = this.get_new_items_(data);
                if (!ns) {
                    return false;
                }
                let idx = lman.insertBefore(this.items, this.current_row, ns);
                this.selected = [this.items[idx]];
                return true;
            },
            move_up: function () {
                return lman.moveUp(this.items, this.current_row);
            },
            move_down: function () {
                return lman.moveDown(this.items, this.current_row);
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
                let idx = lman.insertAfter(this.items, this.current_row, [obj]);
                this.selected = [this.items[idx]];
                return true;
            },
            undo: function () {
                let its = this.redo_undo.popUndo();
                if (its) {
                    this.items = its;
                    this.selected = [];
                    return true;
                }
            },
            redo: function () {
                let its = this.redo_undo.popRedo();
                if (its) {
                    this.items = its;
                    this.selected = [];
                    return true;
                }
            },
            del_item: function () {
                if(!this.current_row) {
                    return false;
                }
                lman.removeItem(this.items, this.current_row);
                this.selected = [];
                return true;
            },
            on_action: function (ac, data) {
                if (this[ac](data)) {
                    this.save_doc();
                    if(!(ac==='redo'||ac==='undo')) {
                        this.redo_undo.pushChange(this.items);
                    }
                    this.update_redo_undo();
                }
            }
        }
    }
</script>