<template>
    <v-dialog :value="dialog" max-width="660" persistent overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>{{title}}</v-card-title>
            <v-text-field @keydown.enter="ok" ref="input_component" class="px-6" v-model="input_text"
                placeholder="输入新项的名称" label="名称"></v-text-field>
            <v-text-field @keydown.enter="ok" class="px-6" v-model="memo_text" placeholder="说明" label="说明">
            </v-text-field>
            <v-sheet class="px-6" v-if="option.allow_clone">
                <v-tabs v-model="tab" dark>
                    <v-tab v-for="(item, idx) in ['从复用库拷贝', '从当前项目拷贝']" :key="idx">
                        {{ item }}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <v-card outlined>
                            <div style="height:400px; width:100%; overflow-y:scroll;">
                                <v-list-item-group v-model="clone_reused" color="primary">
                                    <v-list-item dense v-for="(item, i) in reusedlist" :key="i">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span v-text="item.name"></span>
                                                <span v-text="item.memo" class="ml-2 grey--text"></span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </div>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card outlined>
                            <div style="height:400px; width:100%; overflow-y:scroll;">
                                <v-list-item-group v-model="clone_src" color="primary">
                                    <v-list-item dense v-for="(item, i) in option.srclist" :key="i">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span v-text="item[1].name"></span>
                                                <span v-text="item[1].memo" class="ml-2 grey--text"></span>
                                                <span v-text="item[0]" class="ml-2 grey--text"></span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </div>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-sheet>
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
    // import api from '../../../api/client/client_api';
    export default {
        props: ['dialog', 'option'],

        mounted: async function () {
            this.input_text = this.option.value;
            this.memo_text = this.option.memo;
            let self = this;
            setTimeout(() => {
                self.$refs.input_component.focus();
            }, 200);
            // let res = await api.reused_list(this.option.kind);
            //TODO
            self.reusedlist = []; //res.value;
        },

        data: () => ({
            input_text: '',
            memo_text: '',
            tab: 0,
            clone_src: null,
            clone_reused: null,
            reusedlist: [],
        }),

        computed: {
            title: function () {
                return `新建 - ${cfg.dict[this.option.catalog]}`;
            },
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
                let res = {
                    result: 'ok',
                    value: this.input_text,
                    memo: this.memo_text,
                };
                if (this.tab === 1 && this.option.srclist[this.clone_src]) {
                    res.clone = {
                        type: 'src',
                        id: this.option.srclist[this.clone_src][1].id
                    }
                } else if(this.reusedlist[this.clone_reused]) {
                    res.clone = {
                        type: 'reused',
                        id: this.reusedlist[this.clone_reused].id,
                    }
                }
                this.$emit("result", res);
            }
        }
    }
</script>