<template>
    <div>
        <div id="monaco_id" style="width: 300px; height: 800px ">
        </div>
    </div>
</template>

<script>
    import * as monaco from 'monaco-editor';

    export default {
        props: ['script', 'type'],
        mounted: function () {
            let self = this;
            let editor = monaco.editor.create(document.getElementById('monaco_id'), {
                value: this.script || '',
                language: this.type,
                automaticLayout: true,
                minimap: {
                    enabled: false
                },
            });
            let model = editor.getModel();
            model.onDidChangeContent(function () {
                self.on_change(model.getValue());
            });
        },
        methods: {
            on_change: function (value) {
                console.log('changed', value);
            }
        },
    }
</script>