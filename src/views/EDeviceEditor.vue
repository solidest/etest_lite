<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-edit-bar :items="bar_items" :title="title" :icon="cfg.icon" :new_items="cfg.new_items" :newdef_data="{count:1}"
                @action="on_action">
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
                                </v-text-field><v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field><v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field><v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field><v-text-field v-model="props.item.name" label="Edit" single-line>
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:item.config="props">
                        <v-edit-dialog :return-value.sync="props.item.config"> {{ props.item.config }}
                            <template v-slot:input>
                                <v-text-field v-model="props.item.config" label="Edit" single-line
                                    counter>
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:item.kind="props">
                        <v-edit-dialog :return-value.sync="props.item.kind"> {{ props.item.kind }}
                            <template v-slot:input>
                                <v-text-field v-model="props.item.kind" label="Edit" single-line
                                    counter>
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
    import shortid from 'shortid';
    export default {
        components: {
            'e-edit-bar': EEditBar,
            'e-newintf-sheet': EInterfNewSheet,
        },
        mounted: function () {
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
            on_action: function (ac, data) {
                console.log(ac, data)
                // let config = this.cfg.intf_default[type];
                return shortid.generate();
                // this.items.push({
                //     id: id,
                //     name: id,
                //     kind: type,
                //     config: config || {},
                // });
                // this.save_doc();
                // return count;
            }
        }
    }
</script>