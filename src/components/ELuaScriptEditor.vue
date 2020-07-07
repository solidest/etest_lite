<template>
    <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop class="pa-1 ma-0" v-resize="layout">
    </v-sheet>
</template>

<script>
    import * as monaco from 'monaco-editor';

    export default {
        props: ['script'],
        data: () => {
            return {
                initialVersion: 0,
                currentVersion: 0,
                lastVersion: 0,
                allow_undo: false,
                allow_redo: false,
            }
        },
        mounted: function () {
            let self = this;
            this.editor = monaco.editor.create(document.getElementById('main_monaco_id'), {
                value: this.script || '',
                language: 'lua',
                automaticLayout: true,
                fontSize: "18px",
                theme: 'vs-dark',
                minimap: {
                    enabled: true,
                    scale: 2,
                    showSlider: 'always',
                    side: 'right'
                },
            });
            this.model = this.editor.getModel();
            this.model.onDidChangeContent(function () {
                self.update_version();
                self.on_change(self.model.getValue());
            });
            this.reset_version();
        },
        watch: {
            script: function (v) {
                if (this.script_ !== v) {
                    this.model.setValue(v);
                    this.reset_version();
                    this.is_update = true;
                }
            }
        },
        methods: {
            reset_version: function () {
                this.initialVersion = this.model.getAlternativeVersionId();
                this.currentVersion = this.initialVersion;
                this.lastVersion = this.initialVersion;
                this.allow_undo = false;
                this.allow_redo = false;
            },
            update_version: function () {
                const versionId = this.model.getAlternativeVersionId();
                if (versionId < this.currentVersion) {
                    this.allow_redo = true;
                    if (versionId === this.initialVersion) {
                        this.allow_undo = false;
                    }
                } else {
                    if (versionId <= this.lastVersion) {
                        if (versionId == this.lastVersion) {
                            this.allow_redo = false;
                        }
                    } else {
                        this.allow_redo = false;
                        if (this.currentVersion > this.lastVersion) {
                            this.lastVersion = this.currentVersion;
                        }
                    }
                    this.allow_undo = true;
                }
                this.currentVersion = versionId;
            },
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
            get_action_handler: function () {
                let self = this;
                return {
                    disabled_undo: function () {
                        return self.currentVersion <= self.initialVersion;
                    },
                    disabled_redo: function () {
                        return self.currentVersion >= self.lastVersion;
                    },
                    undo: function () {
                        self.editor.trigger('a', 'undo', 'a');
                        self.editor.focus();
                    },
                    redo: function () {
                        self.editor.trigger('a', 'redo', 'a');
                        self.editor.focus();
                    }
                }
            }

        },
    }
</script>