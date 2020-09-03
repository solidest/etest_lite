<template>
    <div style="height: 100%">
        <v-card outlined color="black" v-if="type">
            <e-title-man :items="titles" />
            <e-editor-bar :items_left="left_tools" :items_right="right_tools" class="pa-0 ma-0" />
        </v-card>
        <component v-if="type" v-bind:is="type" ref="cur_editor"></component>
        <e-empty v-else />
    </div>
</template>
<script>
    import ETitleMan from './ETitleMan';
    import ELuaEditor from './LuaEditor/ELuaEditor';
    import EEditorBar from './EEditorBar';

    export default {
        props: ['items'],
        components: {
            'e-editor-bar': EEditorBar,
            'e-title-man': ETitleMan,
            'e-run-editor': ELuaEditor,
            'e-empty': () => import( /* webpackChunkName: "e-empty" */ '../../components/EEmpty'),
        },
        mounted: function() {
            this.update(this.$store.state.Editor.active);
        },
        data () {
            return {
                left_tools: [],
                right_tools: [],
                type: null,
            }
        },
        computed: {
            titles: function () {
                return this.$store.state.Editor.items;
            },
            active: function() {
                return this.$store.state.Editor.active;
            }
        },
        watch: {
            active: function(ac) {
                this.update(ac);                
            }
        },
        methods: {
            update: function(ac) {
                if(!ac) {
                    this.left_tools = [];
                    this.right_tools = [];
                    this.type = null;
                } else {
                    this.type = `e-${ac.kind}-editor`;
                    let self = this;
                    self.$nextTick(() => {
                        let et = this.$refs.cur_editor;
                        this.right_tools = et.get_tools_right ? et.get_tools_right() : [];
                        this.left_tools = et.get_tools_left ? et.get_tools_left() : [];
                    })
                }
            }
        }

    }
</script>