<template>
    <v-dialog :value="dialog" max-width="600px" persistent scrollable overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>选择设备</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 560px;">
                <v-data-table :headers="headers" :items="items_" no-data-text="暂时还没有设备" disable-sort hide-default-footer
                    disable-pagination hide-default-header>
                    <template v-slot:item.icon="{item}">
                        <v-icon :color="kinds[item.kind||'none'].color">
                            {{kinds[item.kind||'none'].icon}}
                        </v-icon>
                    </template>
                    <template v-slot:item.name="{item}">
                        <span :class="kinds[item.kind].css"> {{item.name}}</span>
                    </template>
                    <template v-slot:item.kind="{item}">
                        <div style="width: 120px">
                            <v-select v-model="item.kind" dense :items="kindlist" hide-details solo flat>
                                <template v-slot:selection="{ item }">
                                    <span :class="`body-2 ${kinds[item.value].css}`">{{item.text}}</span>
                                </template>
                            </v-select>
                        </div>
                    </template>
                </v-data-table>
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
        props: ['dialog', 'items'],
        mounted: function () {
            this._set_items(this.items);
        },
        data: () => ({
            items_: [],
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
            ],
            kinds: cfg.dev_kinds,
            kindlist: [{
                    text: '不使用',
                    value: 'none',
                }, {
                    text: '测试设备',
                    value: 'etest',
                },
                {
                    text: '实物设备',
                    value: 'uut',
                },
                {
                    text: '仿真设备',
                    value: 'simu',
                },
            ]
        }),

        watch: {
            items: function (its) {
                this._set_items(its);
            }
        },

        methods: {
            _set_items(its) {
                its = its || [];
                let its_ = [];
                its.forEach(it => {
                    its_.push({
                        id: it.id,
                        name: it.name,
                        kind: it.kind,
                    });
                });
                this.items_ = its;
            },
            cancel() {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok() {
                this.$emit("result", {
                    result: 'ok',
                    value: this.items_
                });
            },
        }
    }
</script>