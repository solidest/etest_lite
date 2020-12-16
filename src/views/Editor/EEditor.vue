<template>
    <div style="height: 100%" v-resize="update_size">
        <div v-if="editor_type">
            <v-card outlined color="black">
                <e-title-man :items="titles" ref="__title_man" />
                <e-editor-bar :items_left="left_tools" :items_right="right_tools" @action="on_action" class="pa-0 ma-0" />
            </v-card>
            <component v-bind:is="editor_type" :top_height="top_height" :doc="doc" @active="on_active" @change_editor="on_change_editor"></component>
        </div>
        <e-empty v-else />
    </div>
</template>
<style scoped>
    
</style>
<script>
    import shortid from 'shortid';
    import Mousetrap from 'mousetrap';
    import ETitleMan from './ETitleMan';
    import EEditorBar from './EEditorBar';
    import ETopologyEditor from './TopologyEditor/ETopologyEditor';
    import EEtlEditor from './ScriptEditor/EEtlEditor';
    import EProtocolEditor from './ProtocolEditor/EProtocolEditor';
    import EEmpty from '../../views/EEmpty';
    import cfg from './config';
    import db from '../../doc/workerdb';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-title-man': ETitleMan,
            'e-script-editor': EEtlEditor,
            'e-topology-editor': ETopologyEditor,
            'e-protocol-editor': EProtocolEditor,
            'e-device-editor': () => import(/* webpackChunkName: "e-device-editor" */ './DeviceEditor/EDeviceEditor'),
            'e-simu-editor': () => import(/* webpackChunkName: "e-simu-editor" */ './SimuEditor/EEmpty'),
            'e-etl-editor': () => import(/* webpackChunkName: "e-etl-editor" */ './EtlEditor/EEtlEditor'),
            'e-empty': EEmpty, //() => import(/* webpackChunkName: "e-empty" */ '../../views/EEmpty'),
        },
        mounted: function () {
            this.update_size();
            let self = this;
            Mousetrap.bind('ctrl+x', () => {if(self.is_normal) self.quick_action('cut')});
            Mousetrap.bind('ctrl+c', () => {if(self.is_normal) self.quick_action('copy')});
            Mousetrap.bind('ctrl+v', () => {if(self.is_normal) self.quick_action('paste')});
            Mousetrap.bind('ctrl+z', () => {if(self.is_normal) self.quick_action('undo')});
            Mousetrap.bind('ctrl+y', () => {if(self.is_normal) self.quick_action('redo')});
            Mousetrap.bind('del', () => {if(self.is_normal) self.quick_action('remove')});
            this.reset_doc(this.active_doc)
        },
        beforeDestroy: function() {
            Mousetrap.bind('ctrl+x', ()=>{});
            Mousetrap.bind('ctrl+c', ()=>{});
            Mousetrap.bind('ctrl+v', ()=>{});
            Mousetrap.bind('ctrl+z', ()=>{});
            Mousetrap.bind('ctrl+y', ()=>{});
            Mousetrap.bind('del', ()=>{});
        },
        data() {
            return {
                titleman_height: 0,
                left_tools:[],
                right_tools: [],
                ieditor: {},
                editor_type: 'e-empty',
                doc: null,
            }
        },
        computed: {
            is_normal: function() {
                return this.$store.state.win_mode === 'normal'; 
            },
            titles: function () {
                return this.$store.state.Editor.items;
            },
            top_height: function() {
                return 75 + this.titleman_height;
            },
            active_doc: function () {
                return this.$store.state.Editor.active;
            },
            allow_paste: function() {
                let ac = this.$store.state.Editor.active;
                if(!ac) {
                    return false;
                }
                return this.$store.state.copyed === ac.kind;
            }
        },
        watch: {
            titles: function() {
                this.update_size();
            },
            allow_paste: function() {
                this.update_state();
            },
            active_doc: function(active) {
                this.reset_doc(active);
            }
        },
        methods: {
            reset_doc: async function (active_doc) {
                if(!active_doc) {
                    this.editor_type = 'e-empty';
                    return;
                }
                let id = active_doc.id;
                let kind = active_doc.kind;
                let doc = await db.get('src', id);
                let kcfg = cfg[kind];
                if (!doc) {
                    let doc = JSON.parse(JSON.stringify(kcfg.default));
                    doc.id = shortid.generate();
                    doc.kind = kind;
                    await db.insert('src', doc);
                    doc = await db.get('src', id);
                }
                this.doc = doc;
                this.editor_type = doc.coding ? kcfg.code_editor : kcfg.visual_editor;
            },
            update_size: function() {
                let self = this;
                this.$nextTick(() => {
                    let r = self.$refs.__title_man;
                    self.titleman_height = r ? r.$el.offsetHeight : 0;
                });
            },
            update_state: function() {
                let s = this.ieditor.get_state();
                this.$store.commit('Editor/set_state_disbar', s);
            },
            on_active: function(ieditor) {
                this.left_tools = ieditor.left_tools;
                this.right_tools = ieditor.right_tools;
                this.ieditor = ieditor;
                this.update_state();
            },
            on_action: function(ac) {
                this.ieditor.do_action(ac);
                this.update_state();
            },
            quick_action: function(ac) {
                let s = this.ieditor.get_state();
                if(s[ac] === false) {
                    this.ieditor.do_action(ac);
                    this.update_state();
                }
            },
            on_change_editor: function() {
                console.log("aaa")
                this.reset_doc(this.active_doc);
            }
        }

    }
</script>