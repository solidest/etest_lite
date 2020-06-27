<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-editor-bar :items="cfg.bar_items" :title="title" :icon="cfg.icon" @step="on_step">
            </e-editor-bar>
            <v-row>
                <v-col cols=8 class="pa-0">
                    <div style="height: calc(100vh - 83px); ">
                    </div>
                </v-col>
                <v-col cols=4 class="pa-0">
                    <div style="height: calc(100vh - 85px); overflow-y:auto;">
                        <e-device-mapping v-if="step==='dev'" :items="main.mapping" :devs="main.devs" @save="save_doc"> </e-device-mapping>
                        <e-device-linking v-if="step==='link'" :items="main.linking" :devs="main.devs" :mapping="main.mapping" :conns="main.conns" @save="save_linking"> </e-device-linking>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
    import h from '../feature/h_topo';
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_topology';
    // import helper from '../helper/helper';
    import EEditorBar from '../components/ETopologyBar';
    import EDeviceMapping from '../components/EDeviceMapping';
    import EDeviceLinking from '../components/EDeviceLinking';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-device-mapping': EDeviceMapping,
            'e-device-linking': EDeviceLinking,
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
                step: null,
                doc_id: null,
                cfg: cfg,
                bar_items: [],
                main: {},
                kind: cfg.kind,
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
            on_step: function (step) {
                if(this.step === step) {
                    return;
                }
                this.step = step;

            },
            load_main: async function () {
                this.main = await h.load(this.proj_id, this.doc_id);
            },
            save_linking: async function(linking) {
                this.main.linking = linking;
                await this.save_doc();
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: {mapping: this.main.mapping, linking: this.main.linking }
                };
                await ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>