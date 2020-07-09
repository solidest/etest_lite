<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-row align="center" justify="center">
            <div>
                <v-card class="mb-4" width="600">
                    <v-card-title class="headline">新建项目</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="8">
                                <v-text-field @keydown.enter="ok" class="px-6" v-model="input_text" autofocus
                                    placeholder="输入项目名称">
                                </v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-select v-model="type" :items="types" label="创建方式"></v-select>
                            </v-col>
                            <v-col v-if="type==='clone'" cols="12">
                                <v-card-subtitle>选择要克隆的项目</v-card-subtitle>
                                <v-list dense>
                                    <v-list-item-group v-model="src_clone">
                                        <v-list-item v-for="(item, i) in projs" :key="i">
                                            <v-list-item-icon>
                                                <v-icon>mdi-drag-horizontal</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item"></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-col>
                            <v-col v-else-if="type==='copy'" cols="12">
                                <v-stepper v-model="step">
                                    <v-stepper-header>
                                        <template v-for="(n, idx) in copy_steps">
                                            <v-stepper-step :key="idx" :complete="step > copy_steps.length" :step="idx"
                                                editable>
                                                {{ n }}
                                            </v-stepper-step>
                                            <v-divider v-if="n !== steps" :key="n"></v-divider>
                                        </template>
                                    </v-stepper-header>
                                    <v-stepper-items>
                                        <v-stepper-content v-for="(s, idx) in copy_steps" :key="s" :step="idx">
                                            <v-card class="mb-12" height="280">
                                                <v-row>
                                                    <v-col cols="5">
                                                        <v-row>
                                                            <v-list width="220" dense>
                                                                <v-list-item-group>
                                                                    <v-list-item v-for="(item, i) in projs" :key="i">
                                                                        <v-list-item-icon>
                                                                            <v-icon>mdi-drag-horizontal</v-icon>
                                                                        </v-list-item-icon>
                                                                        <v-list-item-content>
                                                                            <v-list-item-title v-text="item">
                                                                            </v-list-item-title>
                                                                        </v-list-item-content>
                                                                    </v-list-item>
                                                                </v-list-item-group>
                                                            </v-list>
                                                            <v-spacer />
                                                            <v-divider vertical class="grey"></v-divider>
                                                        </v-row>
                                                    </v-col>
                                                    <v-col cols="7">
                                                        <v-list>
                                                            <v-list-item-group>
                                                                <v-list-item v-for="(item, i) in items[step]" :key="i"
                                                                    multiple>
                                                                    <v-list-item-content>
                                                                        <v-list-item-title v-text="item">
                                                                        </v-list-item-title>
                                                                    </v-list-item-content>
                                                                    <v-list-item-action>
                                                                        <v-checkbox></v-checkbox>
                                                                    </v-list-item-action>
                                                                </v-list-item>
                                                            </v-list-item-group>
                                                        </v-list>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-stepper-content>
                                    </v-stepper-items>
                                </v-stepper>
                            </v-col>

                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text v-if="type === 'copy'" @click="nextStep" :disabled="step+1>=copy_steps.length">
                            下一步
                        </v-btn>
                        <v-btn text @click="ok" :disabled="!input_text">
                            {{type==='copy'?'完成':'确定'}}
                        </v-btn>
                        <v-btn text :to="{name: 'ListProj'}">
                            取消
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </div>
        </v-row>
    </v-container>
</template>

<script>
    import ipc from '../feature/r_ipc';
    import h from '../feature/f_project'
    import shortid from 'shortid'
    export default {
        data() {
            return {
                input_text: '',
                src_clone: null,
                src_copy: {},
                steps: null,
                step: null,
                type: null,
                types: [{
                    text: '空项目',
                    value: null
                }, {
                    text: '复制历史项目',
                    value: 'clone'
                }, {
                    text: '从文件导入',
                    value: 'import'
                }],
                copy_steps: [
                    '设备接口',
                    '通信协议',
                    '执行用例',
                    '脚本模块',
                    '仿真模型'
                ],
                projs: ['某惯导模型验证项目', 'ABC灭火盒测试项目', '综电系统测试', '三防系统测试', 'XYZ毒气检测项目', 'GG导航测试'],
                items: [
                    ['dev1', 'dev2', 'dev3', 'dev4', ],
                    ['prot1', 'prot2', 'prot3', 'prot4', 'prot5', ],
                    ['testcase1', 'testcase2', 'testcase3', 'testcase4', 'testcase5', ],
                    ['module1', 'module2', 'module3', 'module4', 'module5', ],
                    ['sim1', 'sim2', 'sim3', 'sim4'],
                ]
            }
        },

        watch: {
            steps_(val) {
                if (this.e1 > val) {
                    this.e1 = val
                }
            },
        },

        methods: {
            nextStep() {
                this.step++;
            },
            
            ok: async function () {
                let res = await h.check_proj_newname(this.input_text);
                if (res !== 'ok') {
                    this.$store.commit('setMsgError', res);
                } else {
                    let t = Date.now();
                    let doc = {
                        id: shortid.generate(),
                        name: this.input_text.trim(),
                        xtra: {},
                        setting: {},
                        created: t,
                        updated: t
                    };
                    await ipc.insert_proj(doc);
                    this.$store.commit('setProj', doc);
                    this.$router.push({ name: 'ListPublic'});
                }
            },
        },
    }
</script>