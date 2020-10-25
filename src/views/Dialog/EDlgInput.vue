<template>
    <v-dialog :value="dialog" max-width="560" persistent overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" v-model="input_value" :label="label" :placeholder="placeholder">
            </v-text-field>
            <v-textarea v-if="need_memo" v-model="input_memo" class="px-6" rows="3" no-resize outlined label="备注">
            </v-textarea>
            <v-textarea v-if="readonly_text" :value="readonly_text" class="px-6" rows="10" no-resize outlined readonly>
            </v-textarea>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok" :disabled="!input_value">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'label', 'placeholder', 'value', 'memo', 'need_memo', 'readonly_text'],

        data: () => ({
            input_value: '',
            input_memo: '',
        }),

        mounted: function () {
            this.input_value = this.value||'';
            this.input_memo = this.memo||'';
            let self = this;
            setTimeout(() => {
                self.$refs.input_component.focus();
            }, 200);
        },

        methods: {
            cancel: function () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok: function () {
                if(!this.input_value) {
                    return;
                }
                this.$emit("result", {
                    result: 'ok',
                    value: this.input_value,
                    memo: this.input_memo,
                });
            }
        }
    }
</script>