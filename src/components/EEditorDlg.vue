<template>
    <v-edit-dialog large save-text="确定" cancel-text="取消"
    @cancel="doClear" @close="doClear" @open="onOpen" @save="onSave">
        <span :class="cls" @click="onClick">{{text}}</span>
        <span class="ml-2 grey--text" @click="onClick"> {{memo}}</span>
        <template v-slot:input>
            <e-editor-sheet :data="value" :widgets="widgets" :title="title" :hide_name="hide_name" />
        </template>
    </v-edit-dialog>
</template>

<script>
    export default {
        props: ['text', 'memo', 'data', 'id', 'widgets', 'title', 'hide_name', 'cls'],
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
            },
            onClick: function() {
                this.$emit('_click');
            }
        }

    }
</script>