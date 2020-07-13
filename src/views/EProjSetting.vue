<template>
    <v-container class="pa-0 ma-0 fill-height" fluid>
        <v-row align="center" justify="center">
            <div>
                <v-row class="mb-6" justify="center">
                    <v-card width="600px" class="ma-4 pa-6" tile color="grey darken-4">
                        <v-card-title>
                            {{'项目: ' + proj.name}}
                        </v-card-title>
                        <v-card-subtitle>
                            {{'ID: ' + proj.id}}
                        </v-card-subtitle>
                        <v-row class="pa-3">
                            <v-col cols=12>
                                <v-textarea label="项目说明" v-model="setting.memo" @change="save_doc" rows="5" no-resize
                                    outlined />
                            </v-col>
                            <v-col cols=6>
                                <v-text-field label="执行器IP" v-model="setting.etestd_ip" @change="save_doc" />
                            </v-col>
                            <v-col cols=6>
                                <v-text-field label="执行器端口号" type="number" v-model="setting.etestd_port" @change="save_doc" />
                            </v-col>
                            <v-col cols="4">
                                <v-btn small @click="tcpsrv_test_" outlined>连接测试</v-btn>
                            </v-col>
                            <v-col cols="8">
                                <v-card-text :class="get_conn_color() + '--text pa-0 pt-1 pb-0'">{{test_text}}</v-card-text>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-row>
            </div>
        </v-row>

    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import tcp_test from '../helper/tcp_test';

    export default {
        mounted: function () {
            this.$store.commit('clearEditor');
            if(!this.proj) {
                return;
            }
            if (!this.proj.setting) {
                this.proj.setting = this.setting;
            } else {
                this.setting = this.proj.setting;
            }
        },
        data: () => {
            return {
                setting: {
                    memo: '',
                    etestd_ip: '127.0.0.1',
                    etestd_port: 1210
                },
                test_result: '',
            }
        },
        computed: {
            proj: function () {
                return this.$store.state.proj;
            },
            test_text: function() {
                if(!this.test_result) {
                    return ''
                }
                switch (this.test_result) {
                    case 'trying':
                        return '正在连接执行器......';
                    case 'error':
                    case 'timeout':
                        return '连接执行器失败';
                    case 'ok':
                        return '连接执行器成功';
                    default:
                        return '未知错误';
                }
            }
        },
        methods: {
            save_doc: async function () {
                this.proj.setting = this.setting;
                ipc.update_proj(this.proj);
            },
            tcpsrv_test_() {
                this.test_result = 'trying';
                let self = this;
                tcp_test(this.setting.etestd_ip, this.setting.etestd_port, (res) => {
                    self.test_result = res;
                })
            },
            get_conn_color() {
                if(this.test_result === 'trying') {
                    return 'grey';
                }
                if(this.test_result === 'ok') {
                    return 'success';
                }
                return 'error';
            }
        }
    }
</script>