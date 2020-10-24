<template>
    <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop class="pa-0 ma-0" v-resize="layout">
    </v-sheet>
</template>

<script>
    import * as monaco from 'monaco-editor';
    export default {
        props: ['script'],
        mounted: function () {
            let self = this;
            this.editor = monaco.editor.create(document.getElementById('main_monaco_id'), {
                value: this.script || '',
                language: 'etl',
                automaticLayout: true,
                fontSize: "18px",
                theme: 'vs-dark',
                contextmenu: false,
                minimap: {
                    enabled: true,
                    scale: 2,
                    showSlider: 'always',
                    side: 'right'
                },
            });
            this.model = this.editor.getModel();
            this.model.onDidChangeContent(function () {
                self.on_change(self.model.getValue());
            });
        },
        data: () => {
            return {
               script_: '',
               is_update: false,
            }
        },
        watch: {
            script: function (v) {
                if (this.script_ !== v) {
                    this.is_update = true;
                    this.model.setValue(v);
                }
            }
        },
        methods: {
            on_change: function (value) {
                this.script_ = value;
                if (this.is_update) {
                    this.is_update = false;
                    return;
                }
                this.$emit('change', value);
            },
            layout: function () {
                if (this.editor) {
                    this.editor.layout();
                }
            },
        },
    }
</script>