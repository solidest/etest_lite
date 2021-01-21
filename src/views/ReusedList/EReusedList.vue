<template>
    <v-container fluid>
        <v-toolbar dense class="mb-1">
            <v-select dense class="mx-2" v-model="kind" flat solo-inverted hide-details :items="kind_keys"
                prepend-inner-icon="mdi-view-dashboard-outline" title="复用项类型"></v-select>
            <v-spacer />
            <span class="grey--text">{{`共: ${items.length}项`}}</span>
            <v-spacer />
            <v-btn @click="onExport">
                <v-icon left>mdi-export</v-icon>导出
            </v-btn>
            <v-btn  class="ml-2" color='primary' @click="onImport">
                <v-icon left>mdi-import</v-icon>导入
            </v-btn>
        </v-toolbar>
        <div style="height: calc(100vh - 126px);  overflow-y:auto">
            <v-tooltip bottom right v-for="item in items" :key="item.id">
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2" v-on="on" color="primary" outlined close
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
    import wf from '../../utility/web_file'
import reused from '../../utility/reused';

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
            onExport: async function() {
                let docs = [];
                for(let k of this.kind_keys) {
                    let its = await api.tpl_list(k.value);
                    if(its && its.length>0) {
                        docs.push(...its);
                    } 
                }
                wf.save_json(docs, 'template');
            },
            onImport: async function() {
                let res = await wf.open_json();
                if(res.result === 'ok') {
                    try {
                        for(let r of res.value) {
                            if(reused.valid_code(r.code, r.kind)) {
                                api.tpl_add({
                                    name: r.name,
                                    memo: r.memo,
                                    kind: r.kind,
                                    code: r.code,
                                });
                            }
                        }
                        this._load_data(this.kind);
                        return;
                    } catch (error) {
                        res.result = 'error';
                        res.value = '遇到无效的内容';
                    }
                }
                if(res.result==='error') {
                    this.$store.commit('setMsgError', '导入失败,' + res.value);
                    return;
                }
            },
        }

    }
</script>