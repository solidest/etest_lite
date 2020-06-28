<template>
    <v-data-table :headers="headers" :items="items" no-data-text="暂时还没有设备" disable-sort hide-default-footer
        disable-pagination>
        <template v-slot:item.dev_id="{item}">
            <span :class="item.used==='none'?'grey--text':''"> {{get_dev_name(item.dev_id)}}</span>
        </template>
        <template v-slot:item.used="{item}">
            <div style="width: 120px">
                <v-select v-model="item.used" dense :items="usedlist" @change="on_change" hide-details solo flat>
                    <template v-slot:selection="{ item }">
                        <span :class="`body-2 ${item.value==='none'?'grey--text':''}`">{{item.text}}</span>
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
        },
    }
</script>