<template>
    <div style="width: 100%; height: 100%">
        <v-sheet id="main_monaco_id" width="100%" height="100%" @keydown.stop class="pa-0 ma-0" v-resize="layout"
            @contextmenu="show">
        </v-sheet>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense color="grey darken-3">
                <v-list-item v-for="(item, index) in items" :key="index" @click="on_menu" dense>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import * as monaco from 'monaco-editor';
    import Env from '../feature/f_env';
    import complition from '../language/complition';

    export default {
        props: ['script'],
        data: () => {
            return {
                initialVersion: 0,
                currentVersion: 0,
                lastVersion: 0,
                allow_undo: false,
                allow_redo: false,

                showMenu: false,
                x: 0,
                y: 0,
                items: [{
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me 2'
                    }, {
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me'
                    },
                    {
                        title: 'Click Me 2'
                    },
                ],
            }
        },
        computed: {
            proj_id: function () {
                return this.$store.state.proj.id;
            }
        },
        mounted: function () {
            if (!this.proj_id) {
                return;
            }
            let self = this;
            this.env = new Env();
            this.env.open(this.proj_id).then(() => {
                complition.set_env(this.env.get_dev_list(), this.env.get_proto_list());

            });
            this.editor = monaco.editor.create(document.getElementById('main_monaco_id'), {
                value: this.script || '',
                language: 'etlua',
                automaticLayout: true,
                fontSize: "16px",
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
        watch: {
            script: function (v) {
                if (this.script_ !== v) {
                    this.is_update = true;
                    this.model.setValue(v);
                    this.reset_version();
                }
            }
        },
        methods: {
            show(e) {
                e.preventDefault()
                this.showMenu = false
                this.x = e.clientX
                this.y = e.clientY
                this.$nextTick(() => {
                    this.showMenu = true
                })
            },
            on_menu: function () {

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
                    }
                }
            }

        },
    }
</script>