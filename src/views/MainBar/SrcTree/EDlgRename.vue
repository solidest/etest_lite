<template>
    <v-dialog :value="dialog" max-width="560" persistent overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" v-model="input_text"
                placeholder="输入新项的名称" label="名称"></v-text-field>
            <v-text-field @keydown.enter="ok" class="px-6" v-model="memo_text" placeholder="说明" label="说明">
            </v-text-field>
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
    import cfg from './config';
    export default {
        props: ['dialog', 'option'],

        mounted: function () {
            this.input_text = this.option.value;
            this.memo_text = this.option.memo;
            let self = this;
            setTimeout(() => {
                self.$refs.input_component.focus();
            }, 200);
        },

        data: () => ({
            input_text: '',
            memo_text: '',
            tab: 0,
        }),

        computed: {
            title: function () {
                return `修改 - ${cfg.dict[this.option.catalog]}`;
            }
        },

        methods: {
            cancel: function () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok: function () {
                if (!this.input_text) {
                    return;
                }
                this.$emit("result", {
                    result: 'ok',
                    value: this.input_text,
                    memo: this.memo_text,
                });
            }
        }
    }
</script>