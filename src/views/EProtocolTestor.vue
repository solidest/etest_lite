<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile :loading="loading">
            <e-editor-bar :items="bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1, name:''}"
                :kind="cfg.kind" @action="on_action">
            </e-editor-bar>
            <div style="height: calc(100vh - 90px);  overflow-y:auto">
                <v-row class="pa-0 ma-0" style="flex-wrap: nowrap;">
                    <v-col cols="2" class="pa-0 ma-0 flex-grow-0 flex-shrink-1"
                        style="min-width: 100px; max-width: 100%;">
                        <v-sheet class="pa-2">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="12" class="ma-0 pa-1" align="center">
                                    <v-btn color="grey lighten-2" outlined>
                                        <v-icon left>mdi-message-reply-text</v-icon>十六进制解包
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-0 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor id="_pte1" :script="''" type="lua" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="2" class="pa-0 ma-0 flex-grow-1 flex-shrink-1"
                        style="min-width: 200px; max-width: 100%;">
                        <v-sheet class="pa-2">
                            <v-col cols="12" class="ma-0 pa-1" align="center">
                                <v-btn  color="grey lighten-2" outlined>
                                    <v-icon left>mdi-message-reply-text</v-icon>二进制解包
                                </v-btn>
                            </v-col>
                            <v-col cols="12" class="ma-0 pa-0">
                                <v-sheet class="pa-0 ma-0" style="height: calc(100vh - 150px);">
                                    <e-script-editor id="_pte2" :script="''" type="lua" />
                                </v-sheet>
                            </v-col>
                        </v-sheet>
                    </v-col>
                    <v-col cols="4" class="pa-0 ma-0 flex-grow-1 flex-shrink-0"
                        style="min-width: 200px; max-width: 100%;">
                        <v-sheet class="pa-2">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="12" class="ma-0 pa-1" align="center">
                                    <v-btn color="grey lighten-2" outlined>
                                        <v-icon left>mdi-message-reply</v-icon>打包报文数据
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-0 ma-0" style="height: calc(100vh - 150px);">
                                        <e-script-editor id="_pte3" :script="''" type="lua" />
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col cols="4" class="pa-0 ma-0 flex-grow-1 flex-shrink-0"
                        style="min-width: 200px; max-width: 100%;">

                        <v-data-table>
                        </v-data-table>

                    </v-col>

                </v-row>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/ipc_render';
    import cfg from '../helper/cfg_protocol_test';
    import h from '../feature/f_protocol';
    import EEditorBar from '../components/EEditorBar';
    import EScriptEditor from '../components/widgets/EProtCodeEditor';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-script-editor': EScriptEditor,
        },

        mounted: function () {
            this.doc_id = this.$route.params.doc_id;
            if (!this.doc_id) {
                return;
            }
            this.bar_items = this.cfg.bar_items;
            this.load_doc();
        },

        data() {
            return {
                doc_id: null,
                bar_items: [],
                cfg: cfg,
                frm: {},
                loading: false,
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
        },
        methods: {
            on_action: function (ac) {
                if (ac === 'd_stop') {
                    this.$router.push({
                        name: 'Protocol',
                        params: {
                            doc_id: this.doc_id,
                        }
                    })
                }
            },

            load_doc: async function () {
                let doc = await ipc.load({
                    kind: 'doc',
                    id: this.doc_id
                });
                let content = doc ? (doc.content || {}) : {};
                this.frm = h.load_frm(content.items);
            }
        }
    }
</script>