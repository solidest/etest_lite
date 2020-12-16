<template>
     <div :style="{height: `calc(100vh - ${top_height}px)`, width: '100%'}" class="pa-0 ma-0">
         <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop class="pa-0 ma-0" v-resize="layout">
        </v-sheet>
    </div>
</template>
<script>
    import * as monaco from 'monaco-editor';
    import cfg from './config.js';
    export default {
        props: ['top_height', 'doc'],
        mounted() {
            this.$doc = this.doc;
            this.code = this.doc.code;
            this.$emit('active', this._get_ieditor());

            let self = this;
            
            this.editor = monaco.editor.create(document.getElementById('main_monaco_id'), {
                value: this.code || '',
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
                self.update_version();
                self.on_change(self.model.getValue());
            });
            this.reset_version();
        },
        data() {
            return {
                code: '',
                editor: null,
                model: null,
                initialVersion: 0,
                currentVersion: 0,
                lastVersion: 0,
                allow_undo: false,
                allow_redo: false,
            }
        },
        watch: {
            doc: function (d) {
                this.$doc = this.doc;
                let v = d.code;
                if (this.code !== v) {
                    this.is_update = true;
                    this.model.setValue(v);
                    this.reset_version();
                }
            }
        },
        methods: {
            _get_ieditor() {
                let self = this;
                return {
                    right_tools: cfg.right_tools,
                    left_tools: cfg.left_tools,
                    get_state: () => {
                        return self._get_state();
                    },
                    do_action: (ac) => {
                        return self[`action_${ac}`]();
                    }
                }
            },
            _get_state() {
                return {}
            },
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
                    },
                    copy: function () {
                        self.editor.trigger('a', 'editor.action.clipboardCopyAction', 'a');
                        self.editor.focus();
                    },
                    paste: function () {
                        self.editor.focus();
                        document.execCommand('paste')
                    },
                    cut: function () {
                        self.editor.trigger('a', 'editor.action.clipboardCutAction', 'a');
                        self.editor.focus();
                    },
                    comment: function () {
                        self.editor.trigger('a', 'editor.action.commentLine', 'a');
                        self.editor.focus();
                    },
                    find: function () {
                        self.editor.trigger('', 'actions.find');
                    },
                    goto_line: function(line) {
                        self.editor.revealLine(line);
                        self.editor.focus();
                    },
                    set_err: function(line, msg) {
                        monaco.editor.setModelMarkers(self.model, 'eslint', line>0?[
                            {
                                startLineNumber: line,
                                endLineNumber: line,
                                message: msg,
                            }
                        ]:[]);
                        self.err = true;
                    }
                }
            }
        }
    }
</script>