<template>
    <v-data-table :headers="headers" :items="items" no-data-text="暂时还没有设备" disable-sort hide-default-footer
        disable-pagination>
        <template v-slot:item.dev_id="{item}">
            <span :class="get_text_css1(item)"> {{get_dev_name(item.dev_id)}}</span>
        </template>
        <template v-slot:item.used="{item}">
            <div style="width: 120px">
                <v-select v-model="item.used" dense :items="usedlist" @change="on_change" hide-details solo flat>
                    <template v-slot:selection="{ item }">
                        <span :class="`body-2 ${get_text_css2(item)}`">{{item.text}}</span>
                    </template>
                </v-select>
            </div>
        </template>
    </v-data-table>
</template>

<script>
    import h from '../feature/f_topo';
    export default {
        props: ['items', 'devs'],
        data: () => ({
            headers: [{
                    text: '设备',
                    align: 'end',
                    sortable: false,
                    value: 'dev_id',
                },
                {
                    text: '映射方式',
                    align: 'start',
                    value: 'used',
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
            get_dev_name: function (id) {
                return h.get_dev_name(this.devs, id);
            },
            on_change: function () {
                this.$emit('save');
            },
            get_text_css1: function(item) {
                if(item.used === 'none') {
                    return 'grey--text text--darken-2';
                }
                if(item.used === 'etest') {
                    return 'blue--text text--lighten-3';
                }
                return 'brown--text text--lighten-3';
            },
            get_text_css2: function(item) {
                if(item.value === 'none') {
                    return 'grey--text text--darken-2';
                }
                if(item.value === 'etest') {
                    return 'blue--text text--lighten-3';
                }
                return 'brown--text text--lighten-3';
            }
        },
    }
</script>