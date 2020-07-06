<template>
    <v-edit-dialog large save-text="确定" cancel-text="取消" @cancel="doClear" @close="doClear" @open="onOpen" @save="onSave">
        <v-icon v-if="xsmall_btn_icon" small>{{xsmall_btn_icon}}</v-icon>
        <template v-slot:input>
            <div style="width: 360px; height: 500px" class="ma-2">
            <e-script-editor :script="script" type="yaml" ref="script_editor" @change="onChange">
            </e-script-editor>
        </div>
        </template>
    </v-edit-dialog>
</template>

<script>
    import EScriptEditor from '../EScriptEditor';

    export default {
        props: ['option_code', 'xsmall_btn_icon'],
        components: {
            'e-script-editor': EScriptEditor,
        },
        data: () => {
            return {
                script: '',
            }
        },
        methods: {
            doClear: function () {
                this.script = '';
            },
            onOpen: function () {
                this.script = this.option_code;
                if(!this.$refs.script_editor) {
                    return;
                }
                this.$refs.script_editor.layout();
            },
            onSave: function () {
                this.$emit('save', this.script);
            },
            onChange: function (script) {
                this.script = script;
            },
        }

    }
</script>