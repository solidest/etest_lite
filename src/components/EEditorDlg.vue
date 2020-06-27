<template>
    <v-edit-dialog large save-text="确定" cancel-text="取消"
    @cancel="doClear" @close="doClear" @open="onOpen" @save="onSave">
        {{text}}
        <template v-slot:input>
            <e-editor-sheet :data="value" :widgets="widgets" :max_width="520" :title="title" />
        </template>
    </v-edit-dialog>
</template>

<script>
    export default {
        props: ['text', 'data', 'id', 'widgets', 'title'],
        components: {
            'e-editor-sheet': () => import( /* webpackChunkName: "eeditorsheet" */ './widgets/EEditorSheet'),
        },
        data: () => {
            return {
                value: {},
            }
        },
        methods: {
            doClear: function () {
                this.value = {};
            },
            onOpen: function () {
                this.value = JSON.parse(JSON.stringify(this.data));
            },
            onSave: function () {
                this.$emit('save', this.id, this.value);
            }
        }

    }
</script>