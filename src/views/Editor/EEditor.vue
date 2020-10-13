<template>
    <div style="height: 100%" v-resize="update_size">
        <div v-if="editor_type">
            <v-card outlined color="black">
                <e-title-man :items="titles" ref="__title_man" />
                <e-editor-bar :items_left="left_tools" :items_right="right_tools" @action="on_action" class="pa-0 ma-0" />
            </v-card>
            <component v-bind:is="editor_type" :top_height="top_height" @active="on_active"></component>
        </div>
        <e-empty v-else />
    </div>
</template>
<script>
    import ETitleMan from './ETitleMan';
    import ELuaEditor from './LuaEditor/ELuaEditor';
    import EEditorBar from './EEditorBar';

    export default {
        components: {
            'e-editor-bar': EEditorBar,
            'e-title-man': ETitleMan,
            'e-run-editor': ELuaEditor,
            'e-device-editor': () => import(/* webpackChunkName: "e-device-editor" */ './DeviceEditor/EDeviceEditor'),
            'e-empty': () => import(/* webpackChunkName: "e-empty" */ '../../views/EEmpty'),
        },
        mounted: function () {
            this.update_size();
        },
        data() {
            return {
                titleman_height: 0,
                left_tools:[],
                right_tools: [],
                do_action: null
            }
        },
        computed: {
            titles: function () {
                return this.$store.state.Editor.items;
            },
            top_height: function() {
                return 75 + this.titleman_height;
            },
            editor_type: function() {
                let ac = this.$store.state.Editor.active;
                return ac ? `e-${ac.kind}-editor` : null;
            }
        },
        watch: {
            titles: function() {
                this.update_size();
            }
        },
        methods: {
            update_size: function() {
                let self = this;
                this.$nextTick(() => {
                    let r = self.$refs.__title_man;
                    self.titleman_height = r ? r.$el.offsetHeight : 0;
                });
            },
            on_active: function(ieditor) {
                this.left_tools = ieditor.left_tools;
                this.right_tools = ieditor.right_tools;
                this.do_action = ieditor.do_action;
            },
            on_action: function(ac) {
                this.do_action(ac);
            }
        }

    }
</script>