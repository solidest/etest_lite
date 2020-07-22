<template>
    <v-sheet :id="id" width="100%" height="100%" @keydown.stop class="pa-0 ma-0 mb-1" style="border: 1px solid grey"
        v-resize="layout">
    </v-sheet>
</template>

<script>
    import * as monaco from 'monaco-editor';

    export default {
        props: ['script', 'type', 'id', 'zero_lnumber'],
        mounted: function () {
            let self = this;
            this.editor = monaco.editor.create(document.getElementById(this.id), {
                value: this.script || '',
                language: this.type,
                automaticLayout: true,
                fontSize: "20px",
                overviewRulerBorder: false,
                lineNumbersMinChars: 3,
                lineDecorationsWidth: 0,
                contextmenu: false,
                codeLens: false,
                theme: 'vs-dark',
                lineNumbers: this.zero_lnumber ? this.getlineNumber : undefined,
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
            script: function (v) {
                if (!this.model) {
                    return;
                }
                if (this.script_ !== v) {
                    this.is_update = true;
                    this.model.setValue(v);
                }
            }
        },
        methods: {
            getlineNumber: function(originalLineNumber) {
                return (originalLineNumber - 1 ) + '';
            },
            on_change: function (value) {
                this.script_ = value;
                if (this.is_update) {
                    this.is_update = false;
                    return;
                }
                this.$emit('change', this.id, value);
            },
            layout: function () {
                let self = this;
                setTimeout(() => {
                    self.editor.layout();
                    setTimeout(() => {
                        self.editor.layout();
                        return;
                    }, 200);
                    return;
                }, 200);
            },
            select_range: function(L1, B1, L2, B2) {
                let range = {
                    startLineNumber: L1+1,                 
                    endLineNumber: L2+1,
                    startColumn: B1+1,
                    endColumn: B2+2,
                }
                this.editor.setSelection(range);
            },

        },
    }
</script>