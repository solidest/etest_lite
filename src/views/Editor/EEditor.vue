<template>
    <div style="height: 100%" v-resize="update_size" @click="on_click">
        <div v-if="editor_type">
            <v-card outlined color="black">
                <e-title-man :items="titles" ref="__title_man" />
                <e-editor-bar :items_left="left_tools" :items_right="right_tools" @action="on_action" class="pa-0 ma-0" />
            </v-card>
            <component v-bind:is="editor_type" :top_height="top_height" @active="on_active" @action_click="on_click"></component>
        </div>
        <e-empty v-else />
    </div>
</template>
<script>
    import Mousetrap from 'mousetrap';
    import ETitleMan from './ETitleMan';
    import ELuaEditor from './LuaEditor/ELuaEditor';
    import EEditorBar from './EEditorBar';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-title-man': ETitleMan,
            'e-run-editor': ELuaEditor,
            'e-device-editor': () => import(/* webpackChunkName: "e-device-editor" */ './DeviceEditor/EDeviceEditor'),
            'e-topology-editor': () => import(/* webpackChunkName: "e-topology-editor" */ './TopologyEditor/ETopologyEditor'),
            'e-empty': () => import(/* webpackChunkName: "e-empty" */ '../../views/EEmpty'),
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
                ieditor: {}
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
            editor_type: function() {
                let ac = this.$store.state.Editor.active;
                return ac ? `e-${ac.kind}-editor` : null;
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
        },
        methods: {
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
            on_click: function() {
                // console.log('click on Editor');
            },
            quick_action: function(ac) {
                let s = this.ieditor.get_state();
                if(s[ac] === false) {
                    this.ieditor.do_action(ac);
                    this.update_state();
                }
            }
        }

    }
</script>