<template>
    <v-dialog :value="dialog" max-width="560" persistent overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" v-model="input_text"
                placeholder="输入新项的名称" label="名称"></v-text-field>
            <v-text-field @keydown.enter="ok" class="px-6" v-model="memo_text" placeholder="说明" label="说明">
            </v-text-field>
            <v-sheet outlined class="ma-4">
                <v-card-subtitle class="px-2 mx-0">已有复用项 (共{{reusedlist.length}}项) : </v-card-subtitle>
                <div style="height:200px; width:100%; overflow-y:scroll;">
                    <v-chip class="ma-2" v-for="(item, i) in reusedlist" :key="i">
                        {{item.name}}
                    </v-chip>
                </div>
            </v-sheet>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok" :disabled="!allow_ok">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import cfg from './config';
    import api from '../../../api/client_api';
    import helper from '../../../utility/helper';

    export default {
        props: ['dialog', 'option'],

        mounted: async function () {
            this.input_text = this.option.value;
            this.memo_text = this.option.memo;
            let self = this;
            setTimeout(() => {
                self.$refs.input_component.focus();
            }, 200);
            let res = await api.reused_list(this.option.kind);
            self.reusedlist = res.value;
        },

        data: () => ({
            input_text: '',
            memo_text: '',
            tab: 0,
            reusedlist: [],
        }),

        computed: {
            title: function () {
                return `添加至复用库 - ${cfg.dict[this.option.catalog]}`;
            },
            allow_ok: function() {
                return helper.valid_name(this.reusedlist, this.input_text)==='ok';
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