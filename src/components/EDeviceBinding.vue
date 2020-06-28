<template>
    <v-data-table :headers="headers" :items="binding" no-data-text="没有需要绑定的接口" disable-sort hide-default-footer
        disable-pagination hide-default-header>
        <template v-slot:item.uri="{item}">
            <v-text-field v-model="item.uri" outlined placeholder="输入测试工具接口名称" hide-details @change="on_change"
                :label="get_conn_name(item.conn_id)" class="py-3 body-2" dense>
            </v-text-field>
        </template>
    </v-data-table>
</template>

<script>
    import h from '../feature/f_topo';
    export default {
        props: ['items', 'devs', 'conns', 'mapping'],
        mounted: function () {
            this.reload();
        },
        data: () => ({
            headers: [{
                value: 'uri',
            }, ],
            binding: [],
        }),
        methods: {
            reload: function () {
                this.binding = h.get_binding(this.devs, this.mapping, this.items);
            },
            get_conn_name: function (id) {
                let conn = this.conns.find(it => it.id === id);
                if (!conn) {
                    return '';
                }
                return `${conn.dev_obj.name}.${conn.conn_obj.name} (${conn.conn_obj.kind})`;
            },
            on_change: function () {
                this.$emit('save', this.binding);
            },
        },
    }
</script>