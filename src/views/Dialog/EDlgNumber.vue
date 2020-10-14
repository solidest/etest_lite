<template>
    <v-dialog :value="dialog" max-width="560" persistent overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" type="number" v-model="input_value" :label="label" :placeholder="placeholder">
            </v-text-field>
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
        props: ['dialog', 'title', 'label', 'placeholder', 'value'],

        data: () => ({
            input_value: '',
        }),

        mounted: function () {
            this.input_value = this.value||'';
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
                });
            }
        }
    }
</script>