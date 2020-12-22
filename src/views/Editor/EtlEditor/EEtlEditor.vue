<template>
    <div :style="{height: `calc(100vh - ${top_height}px)`, width: '100%'}" class="pa-0 ma-0">
        <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop class="pa-0 ma-0" v-resize="layout">
        </v-sheet>
    </div>
</template>
<script>
    import * as monaco from 'monaco-editor';
    import cfg from './config.js';
    import db from '../../../doc/workerdb';
    import {sdk} from '../../../../sdk/sdk'
    export default {
        props: ['top_height', 'doc'],
        mounted() {
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
            this._load_docstate(this.doc);
            this.$emit('active', this._get_ieditor());
            this._update_state();
        },
        beforeDestroy: function() {
            this._save_docstate();
        },
        data() {
            return {
                $doc: null,
                code: '',
                editor: null,
                model: null,
                initialVersion: 0,
                currentVersion: 0,
                lastVersion: 0,
            }
        },
        watch: {
            doc: function (new_d) {
                if (!new_d) {
                    return;
                }
                this._save_docstate();
                this._load_docstate(new_d);
                this.$emit('active', this._get_ieditor());
                this._update_state();
            }
        },
        methods: {
            _save_docstate() {
                if(!this.editor || !this.$doc) {
                    return;
                }
                let model = this.model;
                let viewState = this.editor.saveViewState();
                let s = {
                    model,
                    viewState, 
                    is_etl: true,
                    code: this.code,
                    initialVersion: this.initialVersion, 
                    currentVersion: this.currentVersion, 
                    lastVersion: this.lastVersion
                };
                this.$store.commit('Editor/put_doc_state', {id: this.$doc.id, doc_state: s });
            },
            _load_docstate(doc) {
                if(!doc || !this.editor) {
                    return;
                }
                this.$doc = doc;
                this.code = doc.code;
                let s = this.$store.getters['Editor/get_doc_state'](doc.id);

                if(s && s.is_etl && s.code === doc.code) {
                    this.model = s.model;
                    this.editor.setModel(this.model);
                    this.editor.restoreViewState(s.viewState);
                    this.currentVersion = s.currentVersion;
                    this.lastVersion = s.lastVersion;
                    this.initialVersion = s.initialVersion;
                } else {
                    this.model = monaco.editor.createModel(doc.code, 'etl');
                    this.editor.setModel(this.model);
                    this.reset_version();
                }
                this.editor.focus();

                let self = this;
                self.model.onDidChangeContent(function () {
                    self.update_version();
                    self.on_change(self.model.getValue());
                });
            },
            _get_ieditor() {
                let self = this;
                return {
                    left_tools: cfg.left_tools,
                    right_tools: cfg.right_tools[this.doc.kind],
                    get_state: () => {
                        return self._get_state();
                    },
                    do_action: (ac) => {
                        return self[`action_${ac}`]();
                    }
                }
            },
            _get_state() {
                return {
                    undo: this.currentVersion <= this.initialVersion,
                    redo: this.currentVersion >= this.lastVersion
                }
            },
            _update_state() {
                this.$store.commit('Editor/set_state_disbar', this._get_state());
            },
            reset_version: function () {
                this.initialVersion = this.model.getAlternativeVersionId();
                this.currentVersion = this.initialVersion;
                this.lastVersion = this.initialVersion;
            },
            update_version: function () {
                const versionId = this.model.getAlternativeVersionId();
                if (this.currentVersion > this.lastVersion) {
                    this.lastVersion = this.currentVersion;
                }
                this.currentVersion = versionId;
            },
            on_change: function (value) {
                this.code = value;
                this.$doc.code = value;
                this._update_state();
                db.update('src', this.$doc);
            },
            layout: function () {
                if (this.editor) {
                    this.editor.layout();
                }
            },
            action_find: function () {
                this.editor.trigger('', 'actions.find');
            },
            action_comment: function () {
                this.editor.trigger('a', 'editor.action.commentLine', 'a');
                this.editor.focus();
            },
            action_cut: function () {
                this.editor.trigger('a', 'editor.action.clipboardCutAction', 'a');
                this.editor.focus();
            },
            action_copy: function () {
                this.editor.trigger('a', 'editor.action.clipboardCopyAction', 'a');
                this.editor.focus();
            },
            action_paste: function () {
                this.editor.focus();
                document.execCommand('paste')
            },
            action_undo: function () {
                this.editor.trigger('a', 'undo', 'a');
                this.editor.focus();
            },
            action_redo: function () {
                this.editor.trigger('a', 'redo', 'a');
                this.editor.focus();
            },
            action_goto_line: function () {
                this.editor.trigger('a', 'editor.action.gotoLine');
            },
            action_visual_edit: async function () {
                try {
                    console.log('parse_etl')
                    let ast = sdk.parser.parse_etl(this.code);
                    if(!ast || ast.length!==1 || ast[0].kind !==this.$doc.kind) {
                        throw new Error('ETL代码错误');
                    }
                    this.$doc.coding = false;
                    switch (this.doc.kind) {
                        case 'device':
                            this.$doc.content = sdk.converter.device_etl2dev(ast[0]).content;
                            break;
                        case 'topology':
                            this.$doc.content = sdk.converter.topology_etl2dev(ast[0]).content;
                            break;
                        default:
                            break;
                    }
                    await db.update('src', this.$doc);
                    this.$emit('change_editor');
                } catch (error) {
                    this.$store.commit('setMsgError', `ETL代码错误, ${error.message}`);
                }
            },
            action_prot_test() {
                console.log('TODO prot test');
            },
            set_err(line, msg) {
                monaco.editor.setModelMarkers(this.model, 'eslint', line > 0 ? [{
                    startLineNumber: line,
                    endLineNumber: line,
                    message: msg,
                }] : []);
            }
        }
    }
</script>