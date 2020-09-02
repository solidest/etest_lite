<template>
    <v-card class="mx-auto" color="grey darken-3" flat v-if="proj">
        <v-toolbar dense >
            <span class="text--secondary">{{title}}</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom open-delay="300">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" class="mx-2" @click="on_packup">
                        <v-icon small color="grey lighten-1">mdi-arrow-up-down</v-icon>
                    </v-btn>
                </template>
                <span>展开/收起</span>
            </v-tooltip>
        </v-toolbar>
        <v-menu absolute>
            <template v-slot:activator="{on}">
                <div style="height: calc(100vh - 84px); overflow-y:auto">
                <v-treeview activatable dense open-on-click return-object ref="__tree" :items="tree"
                    :active.sync="active"  :open.sync="open">
                    <template v-slot:label="{ item, open }">
                        <div @contextmenu="e=>{on_ctxmenu(item); on.click(e);}" style="display: flex">
                            <v-icon v-if="item.kind==='dir'">
                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else>
                                {{ file_icons[item.kind] }}
                            </v-icon>
                            <span class="ml-2"> {{item.name}} </span>
                            <span class="ml-2 grey--text" v-if="item.memo"> {{item.memo}} </span>
                        </div>
                    </template>
                </v-treeview>
                </div>
            </template>
            <v-list dense>
                <v-list-item v-for="(item, index) in ctx_menus" :key="index" @click="on_domenu(item.action)"
                    :disabled="!allow_dos.includes(item.action)" >
                    <v-list-item-icon class="mr-2 ml-1">
                        <v-icon small color="grey lighten-1">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="pr-3">{{ item.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <div v-if='dlg_type'>
            <e-dlg-create v-if="dlg_type==='create'" :dialog="true" :option="dlg_option" @result="do_new_item" />
            <e-dlg-rename v-else-if="dlg_type==='rename'" :dialog="true" :option="dlg_option" @result="do_rename" />
            <e-dlg-confirm v-else-if="dlg_type==='remove'" :dialog="true" :title="dlg_option.title" :text="dlg_option.text" @result="do_remove" />
            <e-dlg-reused v-else-if="dlg_type==='reused'" :dialog="true" :option="dlg_option" @result="do_reused" />
        </div>
    </v-card>
</template>
<script>
    import shortid from 'shortid';
    import cfg from './config';
    import api from '../../../api/client_api';
    import tman from '../../../utility/tree_man';
    import helper from '../../../utility/helper';

    export default {
        components: {
            'e-dlg-create': () => import( /* webpackChunkName: "e-dlg-create" */ './EDlgCreate'),
            'e-dlg-rename': () => import( /* webpackChunkName: "e-dlg-rename" */ './EDlgRename'),
            'e-dlg-reused': () => import( /* webpackChunkName: "e-dlg-reused" */ './EDlgReused'),
            'e-dlg-confirm': () => import( /* webpackChunkName: "e-dlg-confirm" */ '../../Dialog/EDlgConfirm'),
        },
        mounted: function (){
            this.tree = this.proj ? this.proj.tree : [];
        },
        data: () => ({
            active: [],
            open_all: false,
            file_icons: cfg.file_icons,
            tree: [],
            open: [],
            ctx_menus: cfg.ctx_menus,
            dlg_type: null,
            dlg_option: {},
            is_rename: false
        }),

        computed: {
            proj: function() {
                return this.$store.state.proj;
            },
            title: function() {
                return this.proj ? this.proj.name : '<空>';
            },
            allow_dos: function() {
                let cur = this.active[0];
                if(!cur) {
                    return [];
                }
                if(cur.fixed) {
                    return cur.actions;
                }
                let acs = ['new_item', 'rename', 'remove'];
                if(cur.catalog === 'run') {
                    acs.push('new_dir');
                }
                if(cur.kind !== 'dir') {
                    acs.push('reused');
                }
                return acs;
            }
        },

        methods: {
            _valid_name: function (items, n) {
                let res = helper.valid_name(items, n);
                if (res !== 'ok') {
                    this.$store.commit('setMsgError', res);
                    return false;
                }
                return true;
            },
            _expand_sel: function() {
                if(this.active.length>0) {
                    let a = this.active[0];
                    if(a.kind!=='dir') {
                        return;
                    }
                    let t = this.open.find(it => it===a);
                    if(!t) {
                        this.open.push(a);
                    }
                }
            },
            _save_tree: async function() {
                let res = await api.tree_save({
                    tree: this.tree,
                    proj_id: this.proj.id,
                });
                if(res.result!=='ok') {
                    console.error(res);
                }
            },
            _open_doc: function(it) {
                console.log('TODO OPEN', it);
            },
            _del_doc: async function(it) {
                let res = await api.doc_del(it.id);
                if(res.result!=='ok') {
                    console.error(res);
                }
            },
            _reused_doc: async function(it, name, memo) {
                let res = await api.doc_reused({id:it.id, name: name, memo: memo});
                if(res.result!=='ok') {
                    console.error(res);
                }
            },
            _get_srclist: function(kind) {
                let res = [];
                tman.getFileList('', this.tree, kind, res);
                return res;
            },
            on_packup: function () {
                this.open_all = !this.open_all;
                this.$refs.__tree.updateAll(this.open_all);
            },
            on_ctxmenu: function (it) {
                this.active = [it];
            },
            on_domenu: function(ac) {
                this[`action_${ac}`]();
            },

            action_reused: function() {
                this.dlg_type = 'reused';
                let at = this.active[0];
                this.dlg_option = {
                    catalog: at.catalog,
                    value: at.name,
                    memo: at.memo,
                    kind: at.kind,
                }
            },
            do_reused: function(res) {
                this.dlg_type = null;
                if(res.result!=='ok') {
                    return;
                }
                let at = this.active[0];
                this._reused_doc(at, res.value, res.memo);
            },

            action_rename: function() {
                this.dlg_type = 'rename';
                let at = this.active[0];
                this.dlg_option = {
                    catalog: this.active[0].catalog,
                    value: at.name,
                    memo: at.memo,
                }
            },
            do_rename: async function(res) {
                this.dlg_type = null;
                if(res.result!=='ok') {
                    return;
                }
                let n = res.value;
                let it = this.active[0];
                let its = tman.findParentChildren(this.tree, it.id);
                if(this._valid_name(its.filter(i => i!==it), n)) {
                    tman.rename(this.tree, it.id, n.trim());
                    it.memo = res.memo;
                    await this._save_tree();
                }
            },

            action_remove: function() {
                this.dlg_type = 'remove';
                let at = this.active[0];
                this.dlg_option = {
                    title: `删除-${cfg.dict[at.catalog]}`,
                    text: `确定要删除【${at.name}】吗?  删除后将不可恢复!`,
                }
            },
            do_remove: function(res) {
                this.dlg_type = null;
                if(res.result!=='ok') {
                    return;
                }
                let at = this.active[0];
                let its = tman.findParentChildren(this.tree, at.id);
                if(at.kind !== 'dir') {
                    this._del_doc(at);
                } else {
                    let del_its = [];
                    tman.getLeafs(at, del_its);
                    del_its.forEach(it => {
                        this._del_doc(it);
                    })
                }
                tman.remove(its, at.id);
                this._save_tree();
            },

            action_new_dir: function() {
                this.dlg_type = 'create';
                this.dlg_option = {
                    catalog: 'dir',
                    value: '',
                    new_dir: true,
                    allow_clone: false,
                }
            },
            action_new_item: async function() {
                this.dlg_type = 'create';
                let ac = this.active[0];
                let kind = ac.kind==='dir'? ac.catalog : ac.kind;
                this.dlg_option = {
                    catalog: ac.catalog,
                    value: '',
                    new_dir: false,
                    allow_clone: true,
                    kind: kind,
                    srclist: this._get_srclist(kind),
                }
            },
            do_new_item: async function(res) {
                console.log('res', res)
                this.dlg_type = null;
                if(res.result !== 'ok') {
                    return;
                }
                let pit = this.active[0];
                if(pit.kind!=='dir') {
                    pit = tman.findParent({children: this.tree}, pit.id);
                }
                if (!this._valid_name(pit.children, res.value)) {
                    return;
                }

                let it = {
                    id: shortid.generate(),
                    name: res.value,
                    memo: res.memo,
                    catalog: pit.catalog,
                }
                if(this.dlg_option.new_dir) {
                    it.kind = 'dir';
                    it.children = [];
                } else {
                    it.kind = pit.catalog;
                }

                tman.insert(pit.children, it);
                this._expand_sel();
                this.active = [it];
                await this._save_tree();
                if(it.kind!=='dir') {
                    this._open_doc(it);
                }
            },
        }
    }
</script>