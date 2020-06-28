<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <e-editor-bar :items="cfg.bar_items" :title="title" :icon="cfg.icon" @step="on_step">
            </e-editor-bar>
            <v-row>
                <v-col cols=8 class="pa-0">
                    <div style="height: calc(100vh - 83px); " ref="__draw_rect" v-resize="update_draw_size">
                        <e-topo-draw :main="main" :size="draw_size" @save="save_draw_data" ref="drawor" > </e-topo-draw>
                    </div>
                </v-col>
                <v-col cols=4 class="pa-0">
                    <div style="height: calc(100vh - 85px); overflow-y:auto;">
                        <e-device-mapping v-if="step==='dev'" :items="main.mapping" :devs="main.devs" @save="save_doc"> </e-device-mapping>
                        <e-device-linking v-if="step==='link'" :items="main.linking" :devs="main.devs" :mapping="main.mapping" :conns="main.conns" @save="save_linking"> </e-device-linking>
                        <e-device-binding v-if="step==='bind'" :items="main.binding" :devs="main.devs" :mapping="main.mapping" :conns="main.conns" @save="save_binding"> </e-device-binding>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
    import h from '../feature/f_topo';
    import ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_topology';
    import EEditorBar from '../components/ETopologyBar';
    import EDeviceMapping from '../components/EDeviceMapping';
    import EDeviceLinking from '../components/EDeviceLinking';
    import EDeviceBinding from '../components/EDeviceBinding';
    import ETopoDraw from '../components/ETopoDraw';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-device-mapping': EDeviceMapping,
            'e-device-linking': EDeviceLinking,
            'e-device-binding': EDeviceBinding,
            'e-topo-draw': ETopoDraw,
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
                draw_size: null,
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
            update_draw_size: function() {
                let self = this;
                let el = self.$refs.__draw_rect;
                self.draw_size = {height: el.offsetHeight, width: el.offsetWidth};
                this.redraw_topo();
            },
            redraw_topo(draw_data) {
                this.$refs.drawor.update(this.main, this.draw_size, draw_data);
            },
            load_main: async function () {
                this.main = await h.load(this.proj_id, this.doc_id);
                this.redraw_topo(this.main.draw_data);
            },
            save_linking: async function(linking) {
                this.main.linking = linking;
                this.save_doc();
            },
            save_binding: async function(binding) {
                this.main.binding = binding;
                this.save_doc();
            },
            save_draw_data: async function(draw_data) {
                this.main.draw_data = draw_data;
                this.save_doc();
            },
            save_doc: async function () {
                let doc = {
                    id: this.doc_id,
                    proj_id: this.proj_id,
                    kind: this.kind,
                    content: {mapping: this.main.mapping, linking: this.main.linking, binding: this.main.binding, draw_data: this.main.draw_data }
                };
                ipc.update({
                    kind: 'doc',
                    doc: doc
                });
            },
        }
    }
</script>