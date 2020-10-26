<template>
    <v-dialog :value="dialog" max-width="600px" persistent scrollable overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title>选择设备</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 560px;">
                <v-data-table :headers="headers" :items="items" no-data-text="暂时还没有设备" disable-sort hide-default-footer
                    disable-pagination>
                    <template v-slot:item.used_="{item}">
                        <v-icon v-if="item.used==='uut'" :color="get_color(item)"> mdi-checkbox-blank-circle-outline
                        </v-icon>
                        <v-icon v-else-if="item.used==='etest'" :color="get_color(item)"> mdi-checkbox-marked-circle
                        </v-icon>
                    </template>
                    <template v-slot:item.name="{item}">
                        <span :class="get_text_css1(item)"> {{item.name}}</span>
                    </template>
                    <template v-slot:item.kind="{item}">
                        <div style="width: 120px">
                            <v-select v-model="item.used" dense :items="usedlist" @change="on_change" hide-details solo
                                flat>
                                <template v-slot:selection="{ item }">
                                    <span :class="`body-2 ${get_text_css2(item)}`">{{item.text}}</span>
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
    export default {
        props: ['dialog', 'items'],

        data: () => ({
            headers: [{value: 'used_', align: 'end',},{
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
            usedlist: [{
                    text: '不使用',
                    value: 'none'
                }, {
                    text: '仿真设备',
                    value: 'etest'
                },
                {
                    text: '实物设备',
                    value: 'uut'
                }
            ]
        }),

        methods: {
            cancel () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok () {
                if (!this.selected) {
                    return;
                }
                this.$emit("result", {
                    result: 'ok',
                    selected: this.selected
                });
            },
            get_color(item) {
                if(item.used === 'none') {
                    return 'grey darken-2';
                }
                if(item.used === 'etest') {
                    return 'blue lighten-3';
                }
                return 'brown lighten-3';
            },
            get_text_css1(item) {
                if(item.used === 'none') {
                    return 'grey--text text--darken-2';
                }
                if(item.used === 'etest') {
                    return 'blue--text text--lighten-3';
                }
                return 'brown--text text--lighten-3';
            },
            get_text_css2(item) {
                if(item.value === 'none') {
                    return 'grey--text text--darken-2';
                }
                if(item.value === 'etest') {
                    return 'blue--text text--lighten-3';
                }
                return 'brown--text text--lighten-3';
            },
            on_change() {

            }
        }
    }
</script>