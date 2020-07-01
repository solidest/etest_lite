<template>
    <v-data-table :headers="headers" :items="linking" no-data-text="空" disable-sort hide-default-footer
        disable-pagination hide-default-header dense>
        <template v-slot:item.conns="{item}">
            <v-select transition="none" v-model="item.conns" dense full-width :items="get_conn_list(item)" multiple
                class="body-2 py-1" hide-details @blur="on_changed" no-data-text="无可用的设备接口"
                :menu-props="{ maxHeight: 600}" chips flat solo :placeholder="conn_list.length>0 ?'选择连接接口':'无可用设备接口'">
                <template v-slot:selection="{ item }">
                    <v-chip small>
                        {{ conn_short_name(item.value) }}
                    </v-chip>
                </template>
                <template v-slot:append>
                    <v-icon v-if="item!==linking[linking.length-1]" small @click="remove(item)">mdi-close</v-icon>
                </template>
                <template v-if="error_obj[item.id]" v-slot:prepend>
                    <v-tooltip left color='red lighten-1'>
                        <template v-slot:activator="{ on }">
                            <v-icon color="red lighten-1" v-on="on">mdi-alert</v-icon>
                        </template>
                        <span>{{errtip_fmt(error_obj[item.id])}}</span>
                    </v-tooltip>
                </template>
            </v-select>
        </template>
    </v-data-table>
</template>

<script>
    import h from '../feature/f_topo';
    import shortid from 'shortid';
    export default {
        props: ['doc_id', 'items', 'devs', 'conns', 'mapping'],
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
        computed: {
            error_obj: function () {
                let res = this.$store.getters.check_result;
                if (!res) {
                    return {}
                }
                res = res.topology;
                if (!res) {
                    return {}
                }
                return res[this.doc_id] || {};
            }
        },
        methods: {
            errtip_fmt: function (errs) {
                if (!errs) {
                    return '';
                }
                let res = errs.map(it => it.msg);
                return res.join('\n');
            },
            reload: function () {
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
            get_conn_list: function (item) {
                if (this.$last_conn_list_byid === item.id) {
                    return this.$last_conn_list;
                }
                let used = [];
                for (let it of this.linking) {
                    if (it === item || !it.conns) {
                        continue;
                    }
                    for (let cid of it.conns) {
                        used.push(cid);
                    }
                }
                let res = [];
                for (let it of this.conn_list) {
                    if (!used.includes(it.value)) {
                        res.push(it);
                    }
                }
                this.$last_conn_list_byid = item.id;
                this.$last_conn_list = res;
                return res;
            },
            on_changed: function () {
                this.$emit('save', this.linking);
                this.try_append_emtpy();
            },
            conn_short_name: function (conn_id) {
                let conn = this.conns.find(it => it.id === conn_id);
                if (!conn) {
                    return '已删除';
                }
                return `${conn.dev_obj.name}.${conn.conn_obj.name}`
            },
            remove: function (item) {
                let idx = this.linking.findIndex(it => it.id === item.id);
                if (idx >= 0) {
                    this.linking.splice(idx, 1);
                }
                this.on_changed();
            }
        },
    }
</script>