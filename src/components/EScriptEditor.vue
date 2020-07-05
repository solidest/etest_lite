<template>
    <v-sheet id="monaco_id" width="100%" height="100%" @keydown.stop
        class="pa-0 ma-0 mb-1" style="border: 1px solid grey" v-resize="layout">
    </v-sheet>
</template>

<script>
    import * as monaco from 'monaco-editor';

    export default {
        props: ['script', 'type'],
        mounted: function () {
            let self = this;
            this.editor = monaco.editor.create(document.getElementById('monaco_id'), {
                value: this.script || '',
                language: this.type,
                automaticLayout: true,
                overviewRulerBorder: false,
                lineNumbersMinChars: 3,
                lineDecorationsWidth: 0,
                contextmenu: false,
                codeLens: false,
                theme: 'vs-dark',
                minimap: {
                    enabled: false
                },
            });
            this.model = this.editor.getModel();
            this.model.onDidChangeContent(function () {
                self.on_change(self.model.getValue());
            });
        },
        watch: {
            script: function(v) {
                if(this.script_ !== v) {
                    this.model.setValue(v);
                }
            }
        },
        methods: {
            on_change: function (value) {
                this.script_ = value;
                this.$emit('change', value);
            },
            layout: function() {
                let self = this;
                setTimeout(() => {
                    self.editor.layout();
                    return;
                }, 400);
            }
        },
    }
</script>