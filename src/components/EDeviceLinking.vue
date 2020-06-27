<template>
    <v-data-table :headers="headers" :items="linking" no-data-text="空" disable-sort hide-default-footer
        disable-pagination hide-default-header dense>
        <template v-slot:item.conns="{item}">
            <v-select v-model="item.conns" dense full-width :items="get_conn_list(item)" multiple class="body-2 py-1" hide-details
                @change="on_change" no-data-text="无可用的设备接口" :menu-props="{ maxHeight: 600}" chips flat solo 
                :placeholder="conn_list.length>0 ?'选择连接接口':'无可用设备接口'">
                <template v-slot:selection="{ item }">
                    <v-chip small>
                        <span>{{ conn_short_name(item.value) }}</span>
                    </v-chip>
                </template>
                <template v-slot:append>
                    <v-icon v-if="item!==linking[linking.length-1]" small @click="remove(item)">mdi-close</v-icon>
                </template>
            </v-select>
        </template>
    </v-data-table>
</template>

<script>
    import h from '../feature/h_topo';
    import shortid from 'shortid';
    export default {
        props: ['items', 'devs', 'conns', 'mapping'],
        mounted: function () {
            this.reload();
        },
        data: () => ({
            headers: [{
                value: 'conns'
            }, ],
            conn_list: [],
            linking: [],
        }),
        methods: {
            reload: function() {
                this.conn_list = h.get_conn_list(this.devs, this.mapping);
                this.linking = h.get_linking(this.devs, this.mapping, this.conn_list, this.items);
                this.try_append_emtpy();
            },
            try_append_emtpy: function () {
                if (this.linking.length === 0) {
                    this.linking = [{
                        id: shortid.generate(),
                        conns: []
                    }];
                } else if (this.linking[this.linking.length - 1].conns.length > 0) {
                    this.linking.push({
                        id: shortid.generate(),
                        conns: []
                    });
                }
            },
            get_conn_list: function(item) {
                let used = [];
                for(let it of this.linking) {
                    if(it===item || !it.conns) {
                        continue;
                    }
                    for(let cid of it.conns) {
                        used.push(cid);
                    }
                }
                let res = [];
                for(let it of this.conn_list) {
                    if(!used.includes(it.value)) {
                        res.push(it);
                    }
                }
                return res;
            },
            on_change: function () {
                this.$emit('save', this.linking);
                this.try_append_emtpy();
            },
            conn_short_name: function(conn_id) {
                let conn = this.conns.find(it => it.id === conn_id);
                if(!conn) {
                    return '已删除';
                }
                return `${conn.dev_obj.name}.${conn.conn_obj.name}`
            },
            remove: function(item) {
                let idx = this.linking.findIndex(it => it.id === item.id);
                if(idx>=0){
                    this.linking.splice(idx, 1);
                }
                this.on_change();
            }
        },
    }
</script>