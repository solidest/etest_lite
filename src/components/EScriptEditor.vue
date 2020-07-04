<template>
    <v-sheet id="monaco_id" width="100%" height="100%" class="pa-0 ma-0 mb-1" style="border: 1px solid grey" v-resize="layout">
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
                // occurrencesHighlight: false,
                overviewRulerBorder: false,
                lineNumbersMinChars: 3,
                // overviewRulerBorder: false,
                // overviewRulerLanes: 1,
                lineDecorationsWidth: 0,
                contextmenu: false,
                // lineNumbers: 'off',
                codeLens: false,
                theme: 'vs-dark',
                minimap: {
                    enabled: false
                },
            });
            let model = this.editor.getModel();
            model.onDidChangeContent(function () {
                self.on_change(model.getValue());
            });
        },
        methods: {
            on_change: function (value) {
                return value;
                //console.log('changed', value);
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