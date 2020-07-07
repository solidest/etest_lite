<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" class="ma-0 pa-0" tile color="grey darken-3">
            <e-editor-bar :items="cfg.bar_items" :title="title" :icon="cfg.icon" :newdef_data="{count:1}"
                :kind="cfg.kind" @action="on_action">
            </e-editor-bar>
                <div :style="{height: `calc(100vh - ${82+out_height}px)`}">

                <e-editor :script="content.script" @change="save_doc"> </e-editor>
            </div>
            <v-sheet style="position:absolute; left:0px; bottom:0px; z-index:100" color="primary"
                width="100%" :height="out_height">
                Hello, world! I'm a simple v-sheet
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_lua';
    import EEditorBar from '../components/EEditorBar';
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
        },

        data() {
            return {
                doc_id: null,
                cfg: cfg,
                kind: cfg.kind,
                bar_items: [],
                content: {
                    script: '',
                    memo: ''
                },
                out_height: 30,
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
                this.content.script = content.script || [];
                this.content.memo = content.memo || '';
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