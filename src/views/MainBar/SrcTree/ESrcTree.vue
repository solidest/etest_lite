<template>
    <v-sheet class="mx-auto" color="grey darken-3" flat v-if="proj">
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
                    :active.sync="active"  :open.sync="open" @update:active="on_active">
                    <template v-slot:label="{ item, open }">
                        <div @contextmenu="e=>{on_ctxmenu(item); on.click(e);}" style="display: flex; height: 40px;" >
                            <v-icon v-if="item.kind!=='dir'">
                                {{ file_icons[item.kind] }}
                            </v-icon>
                            <template v-else>
                                <v-icon v-if="file_icons[item.id]">
                                    {{ file_icons[item.id] }}
                                </v-icon>                            
                                <v-icon v-else>
                                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                                </v-icon>                                
                            </template>
                            <span class="ml-2 align-self-center"> {{item.name}} </span>
                            <span class="ml-2 grey--text align-self-center" v-if="item.memo"> {{item.memo}} </span>
                            
                        </div>
                    </template>
                    <template v-slot:append="{ item }">
                        <v-btn small icon @click.stop="on_default(item)" v-if="item.default_action">
                        <v-icon small  color="grey lighten-1">
                            mdi-plus-thick
                        </v-icon>
                        </v-btn>
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
    </v-sheet>
</template>
<script>
    import shortid from 'shortid';
    import cfg from './config';
    import tman from '../../../utility/tree_man';
    import helper from '../../../utility/helper';
    import db from '../../../doc/workerdb';
    import api from '../../../api/client';
    import reused from '../../../utility/reused';

    export default {
        components: {
            'e-dlg-create': () => import( /* webpackChunkName: "e-dlg-create" */ './EDlgCreate'),
            'e-dlg-rename': () => import( /* webpackChunkName: "e-dlg-rename" */ './EDlgRename'),
            'e-dlg-reused': () => import( /* webpackChunkName: "e-dlg-reused" */ './EDlgReused'),
            'e-dlg-confirm': () => import( /* webpackChunkName: "e-dlg-confirm" */ '../../Dialog/EDlgConfirm'),
        },
        mounted: async function (){
            if(this.proj) {
                this.tree = await this._load_tree();
                this._active_editing();
                let self = this;
                this.$nextTick(() => {
                    self.on_packup();
                })
            }
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
                if(['run', 'script', 'panel'].includes(cur.catalog)) {
                    acs.push('new_dir');
                }
                if(cur.kind !== 'dir') {
                    acs.push('reused');
                }
                return acs;
            },
            editing_id: function() {
                let ac = this.$store.state.Editor.active;
                return ac ? ac.id : null;
            },
        },

        watch: {
            editing_id: function() {
                this._active_editing();
            },
            dlg_type: function(d) {
                let mode = d ? 'dialog' : 'normal';
                this.$store.commit('setWinMode', mode);
            },
        },

        methods: {
            _load_tree: async function() {
                let t = await db.get('config', 'tree');
                if(!t) {
                    await db.insert('config', {id: 'tree', value: cfg.default_tree});
                    t = await db.get('config', 'tree');
                    api.projdb_changed(this.proj.id);
                }
                return t.value;
            },
            _save_tree: async function() {
                await db.update('config', {id: 'tree', value: this.tree});
                api.projdb_changed(this.proj.id);
            },
            _active_editing: function() {
                let it = tman.findItem(this.tree, this.editing_id);
                if(it) {
                    this.active = [it];
                } else {
                    this.active = [];
                }
            },
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
            _open_doc: function(it) {
                if(!['device', 'topology', 'script', 'simu', 'protocol'].includes(it.kind)) return;
                this.$store.commit('Editor/open', it);                
                if(this.$route.name !== 'Editor') {
                    this.$router.push({name: 'Editor'});
                }
            },
            _get_srclist: function(kind) {
                let res = [];
                tman.getFileList('', this.tree, kind, res);
                return res;
            },
            _clone_doc: async function(item, info) {
                let doc;
                if(info.type === 'src') {
                    doc = await db.get('src', info.id);
                } else if(info.type === 'reused') {
                    doc = reused.get_devobj(item.kind, info.code);
                }
                await db.insert('src', {
                    id: item.id,
                    kind: item.kind,
                    content: doc.content
                });
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
            on_active: function(its) {
                if(!its || its.length===0) {
                    return;
                }
                let it = its[0];
                if(it.kind === 'dir') {
                    return;
                }
               this._open_doc(it);
            },
            on_default: function(it) {
                this.active = [it];
                this.on_domenu(it.default_action);                    
            },

            action_reused: async function() {
                let at = this.active[0];
                let obj = await reused.get_reused(at.id, at.kind, at.name, at.memo);
                if(!obj) {
                    this.$store.commit('setMsgError', '复用内容内部存在错误，请更正');
                    return;
                }
                this.dlg_type = 'reused';
                this.dlg_option = {
                    value: at.name,
                    memo: at.memo,
                    kind: at.kind,
                    obj,
                }
            },
            do_reused: async function(res) {
                this.dlg_type = null;
                if(res.result!=='ok') {
                    return;
                }
                let obj = this.dlg_option.obj;
                obj.name = res.value;
                obj.memo = res.memo;
                await api.tpl_add(obj);
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
            do_rename: function(res) {
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
                    this.$store.commit('Editor/update', it);                
                    this._save_tree();
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
                if(at.kind === 'dir') {
                    let del_its = [];
                    tman.getLeafs(at, del_its);
                    del_its.forEach(it => {
                        db.remove('src', it.id);
                    })
                }
                tman.remove(its, at.id);
                this._save_tree();
                this.$store.commit('Editor/close', at);
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
                if(res.clone) {
                    await this._clone_doc(it, res.clone)
                }

                tman.insert(pit.children, it);
                this._expand_sel();
                this.active = [it];
                this._save_tree();
                if(it.kind!=='dir') {
                    this._open_doc(it);
                }
            },
        }
    }
</script>