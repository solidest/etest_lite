<template>
    <v-dialog :value="dialog" max-width="660px" persistent scrollable overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>运行时绑定</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 600px;">
                <v-expansion-panels multiple flat focusable>
                    <v-expansion-panel v-for="(dev,i) in items" :key="i">
                        <v-expansion-panel-header>
                             <v-list-item-title>
                            <span class="grey--text text--lighten-3">{{dev.name}}</span>
                            <span class="grey--text ml-4" v-if="dev.memo">{{dev.memo}}</span>
                             </v-list-item-title>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list-item v-for="item in dev.conns" :key="item.id"
                                style="border-bottom: 1px solid grey">
                                <v-list-item-avatar size="38">
                                    <v-avatar color="grey darken-2" class="white--text">
                                        <span class="body-2">{{ cfg_intf_alias[item.kind] }}</span>
                                    </v-avatar>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span class="body1 grey--text text--lighten-3">{{ item.name }}</span>
                                        <span class="body1 grey--text ml-2"
                                            v-if="item.memo">{{` ${item.memo}`}}</span>
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-select style="width: 30px" class="px-3 ma-3" placeholder="请选择物理通道" outlined solo
                                    no-data-text="无可用通道" dense hide-details v-model="item.bind_id" :items="['COM1', 'COM2']" />

                            </v-list-item>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import cfg from './config_map';
    export default {
        props: ['dialog', 'binding'],
        mounted: function () {
            this.set_items(this.binding);
        },
        data: () => ({
            cfg_intf_alias: cfg.intf_alias,
            items: [],
            headers: [{
                    value: 'icon',
                    align: 'end',
                }, {
                    text: '设备',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {
                    text: '映射方式',
                    align: 'start',
                    value: 'kind',
                    sortable: false
                },
            ]
        }),

        watch: {
            binding: function (binding) {
                this.set_items(binding);
            },
        },

        methods: {
            _get_binds() {
                let res = [];
                for (const dev of this.items) {
                    for (const conn of dev.conns) {
                        if(conn.bind_id) {
                            res.push({dev: {id: dev.id, name: dev.name}, conn: {id: conn.id, name: conn.name}, bind_id: conn.bind_id})
                        }
                    }
                }
                return res;
            },
            set_items(binding) {
                let devs = JSON.parse(JSON.stringify(binding.devs));
                binding.binds.forEach(b => {
                    let dev = devs.find(d => d.id===b.dev.id || d.name===b.dev.name);
                    if(dev) {
                        let conn = dev.conns.find(c => c.id===b.conn.id || c.name===b.conn.name);
                        if(conn) {
                            conn.bind_id = b.bind_id;
                        }
                    }
                });
                this.items = devs;
            },
            cancel() {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok() {
                this.$emit("result", {
                    result: 'ok',
                    value: this._get_binds()
                });
            },
        }
    }
</script>