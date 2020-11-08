<template>
    <v-dialog :value="dialog" max-width="360" persistent overlay-color="grey darken-2" internal-activator>
        <v-card>
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" v-model="input_text" :placeholder="label"></v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok" :disabled="!input_text">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'label', 'default'],

        data: () => ({
            input_text: ''
        }),

        mounted: function () {
            this.input_text = this.default;
            let self = this;
            setTimeout(() => {
                self.$refs.input_component.focus();
            }, 200);
        },

        methods: {
            cancel: function () {
                this.$emit("closed", {
                    result: 'cancel'
                });
            },
            ok: function () {
                if(!this.input_text) {
                    return;
                }
                this.$emit("closed", {
                    result: 'ok',
                    value: this.input_text
                });
            }
        }
    }
</script>