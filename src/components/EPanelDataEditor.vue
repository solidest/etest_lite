<template>
    <v-sheet width="100%" height="calc(100vh - 205px)" class="pa-0 ma-0" style="position:relative">
        <div style="position:absolute; left:-28px; top:-2px; z-index:100">
            <v-tooltip left open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" color="grey lighten-1" class="pa-0 ma-1" style="cursor:pointer"
                        @click="on_sync">
                        mdi-sync
                    </v-icon>
                </template>
                <span>更新数据</span>
            </v-tooltip>
        </div>
        <div style="position:absolute; left:-28px; top:25px; z-index:100">
            <v-tooltip left open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" color="grey lighten-1" class="pa-0 ma-1" style="cursor:pointer"
                        @click="on_reset">
                        mdi-refresh
                    </v-icon>
                </template>
                <span>重置数据</span>
            </v-tooltip>
        </div>
        <e-script-editor :script="panel_data.script" type="yaml" ref="script_editor" @change="on_change">
        </e-script-editor>
    </v-sheet>
</template>
<script>
    import EScriptEditor from './EMiniScriptEditor';
    import yaml from 'js-yaml';
    import {
        debounce
    } from 'throttle-debounce';

    export default {
        props: ['panel_data'],
        components: {
            'e-script-editor': EScriptEditor,
        },
        mounted: function () {
            this.emit_update = debounce(200, this.emit_update_);
        },
        methods: {
            on_change: function (script) {
                this.panel_data.script = script;
                this.emit_update();
            },
            emit_update_: function () {
                this.$emit('change', 'script changed');
            },
            initial_data: function () {
                this.$emit('init_data');
            },
            on_sync: function () {
                if (!this.panel_data.script || !this.panel_data.script.trim()) {
                    this.initial_data();
                    return;
                }
                try {
                    let doc = yaml.safeLoad(this.panel_data.script, 'utf8');
                    this.panel_data.update(doc);
                } catch (error) {
                    this.$store.commit('setMsgError', error.message);
                }
            },
            on_reset: function () {
                this.initial_data();
            },
        }
    }
</script>