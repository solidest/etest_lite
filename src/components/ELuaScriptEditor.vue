<template>
    <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop
        class="pa-1 ma-0"  v-resize="layout">
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
                language: 'lua',
                automaticLayout: true,
                theme: 'vs-dark',
            });
            let model = this.editor.getModel();
            model.onDidChangeContent(function () {
                self.on_change(self.model.getValue());
            });
        },
        watch: {
            script: function(v) {
                if(!this.editor) {
                    return;
                }
                if(this.script_ !== v) {
                    let model = this.editor.getModel();
                    model.setValue(v);
                    this.is_update = true;
                }
            }
        },
        methods: {
            on_change: function (value) {
                this.script_ = value;
                if(this.is_update) {
                    this.is_update = false;
                    return;
                }
                this.$emit('change', value);
            },
            layout: function() {
                if(this.editor) {
                    this.editor.layout();
                }
            }
        },
    }
</script>