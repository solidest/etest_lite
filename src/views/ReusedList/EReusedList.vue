<template>
    <v-container fluid>
        <v-toolbar class="mb-1">
            <v-select class="mx-2" v-model="kind" flat solo-inverted hide-details :items="kind_keys"
                prepend-inner-icon="mdi-view-dashboard-outline" title="复用项类型"></v-select>
            <span class="grey--text">{{`共: ${items.length}项`}}</span>
        </v-toolbar>
        <div style="height: calc(100vh - 126px);  overflow-y:auto">
            <v-tooltip bottom right v-for="item in items" :key="item.id">
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2" v-on="on" color="grey lighten-1" outlined close
                        close-icon="mdi-trash-can-outline" @click="onEdit(item)" @click:close="onRemove(item)">
                        <v-icon left small>mdi-pencil</v-icon>
                        {{item.name}}
                    </v-chip>
                </template>
                <span>{{`${item.memo||'无备注'}`}}</span>
            </v-tooltip>
        </div>
        <e-dlg-input v-if="dlg==='rename'" :dialog="dlg" title="重命名复用信息" label="名称" :value="update_item.name"
            :memo="update_item.memo" placeholder="请输入新名称" :need_memo="true" :readonly_text="update_item.code"
            @result="doChanged" />
    </v-container>
</template>

<script>
    import cfg from './config';
    import api from '../../api/client/';

    export default {
        components: {
            'e-dlg-input': () => import( /* webpackChunkName: "e-dlg-input" */ '../Dialog/EDlgInput'),
        },
        mounted: async function () {
            this._load_data(this.kind);
        },

        data: () => ({
            kind: 'device',
            kind_keys: cfg.kind_keys,
            items: [],
            dlg: '',
            update_item: null,
        }),

        watch: {
            kind: function (k) {
                this._load_data(k);
            }
        },

        methods: {
            _load_data: async function (kind) {
                this.items = await api.tpl_list(kind);
            },
            onEdit: function (item) {
                this.update_item = item;
                this.dlg = 'rename';
            },
            doChanged: async function (res) {
                this.dlg = null;
                if (res.result !== 'ok') {
                    return;
                }
                if (this.update_item.name === res.value || !this.items.find(it => it.name === res.value)) {
                    await api.tpl_del(this.update_item.id);
                    await api.tpl_add({
                        name: res.value,
                        memo: res.memo,
                        kind: this.update_item.kind,
                        code: this.update_item.code,
                    });
                    this._load_data(this.kind);
                } else {
                    this.$store.commit('setMsgError', '名称重复');
                }
            },
            onRemove: async function (item) {
                await api.tpl_del(item.id);
                this._load_data(this.kind);
            },
        }

    }
</script>