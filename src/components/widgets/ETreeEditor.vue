<template>
    <v-treeview dense :items="items" :active.sync="active" activatable item-key="id" hoverable
        @update:active="selected" :open.sync="open" return-object selection-type="independent"
        v-click-outside="onClickOutside">
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.kind==='dir'" color="grey lighten-2">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else color="grey lighten-2">
                {{ icons[item.kind] }}
            </v-icon>
        </template>
        <template v-slot:label="{ item }">
            <span style="cursor:pointer;" class="body-1 grey--text text--lighten-2"> {{item.name}}</span>
        </template>
    </v-treeview>
</template>
<script>
    import ipc from '../../feature/r_ipc';
    import tman from '../../helper/tree_man';
    import helper from '../../helper/helper';
    import shortid from 'shortid';

    export default {
        props: ['catalog', 'icons'],

        mounted: function () {
            this.load(this.catalog);
        },
        data: () => {
            return {
                items: [],
                active: [],
                open: [],
            }
        },
        computed: {
            proj: function () {
                return this.$store.state.proj;
            },
        },
        watch: {
            proj: function () {
                this.load(this.catalog);
            }
        },

        methods: {
            new_item: async function (its, name, kind, children) {
                let it = {
                    id: shortid.generate(),
                    name: name,
                    kind: kind,
                    children: children,
                }
                tman.insert(its, it);
                await this.save_all();
                this.expand_sele();
                this.active = [it];
            },
            valid_name: function (items, n) {
                let res = helper.valid_name(items, n);
                if (res !== 'ok') {
                    this.$store.commit('setMsgError', res);
                    return false;
                }
                return true;
            },
            expand_sele: function() {
                if(this.active.length>0) {
                    let a = this.active[0];
                    let t = this.open.find(it => it===a);
                    if(!t) {
                        this.open.push(a);
                    }
                }
            },
            expand_all: function(items) {
                for(let it of items) {
                    if(it.kind === 'dir') {
                        this.open.push(it);
                        this.expand_all(it.children);
                    }
                }
            },
            save_all: async function() {
                await ipc.update({
                    kind: this.catalog,
                    doc: {
                        id: this.proj.id,
                        items: this.items,
                        proj_id: this.proj.id
                    }
                });
            },
            action: function (ac, v) {
                switch (ac) {
                    case 'new_dir':
                        this.new_dir(v);
                        break;
                    case 'new_model':
                        this.new_model(v);
                        break;
                    case 'new_actions':
                        this.new_actions(v);
                        break;
                    case 're_name':
                        this.re_name(v);
                        break;
                    case 'del_item':
                        this.del_item();
                        break;

                    default:
                        console.log(ac, v)
                        break;
                }
            },
            new_dir: async function (n) {
                let its = this.current_items();
                if (this.valid_name(its, n)) {
                    await this.new_item(its, n.trim(), 'dir', [] );
                }
            },
            new_model: async function (n) {
                let its = this.current_items();
                if (this.valid_name(its, n)) {
                    await this.new_item(its, n.trim(),'model' );
                }
            },
            new_actions: async function (n) {
                let its = this.current_items();
                if (this.valid_name(its, n)) {
                    await this.new_item(its, n.trim(), 'actions' );
                }
            },
            re_name: async function (n) {
                if(this.active.length===0) {
                    return;
                }
                let it = this.active[0];
                if(n && n.trim()===it.name) {
                    return;
                }
                let its = tman.findParent(this.items, it.id);
                if(this.valid_name(its, n)) {
                    tman.rename(this.items, it.id, n.trim())
                    await this.save_all();
                }
            },
            del_item: async function () {
                if(this.active.length===0) {
                    return;
                }
                let leafs = [];
                let it = this.active[0];
                tman.getLeafs(it, leafs);
                tman.remove(this.items, it.id);
                await this.save_all();
                this.active = [];
                this.selected(this.active);
                for(let l of leafs) {
                    ipc.remove({kind: 'doc', doc: {id: l.id, proj_id: this.proj.id}})
                    this.$store.commit('deletedDoc', l.id);
                }
            },
            load: async function (catalog) {
                if (!catalog || !this.proj) {
                    this.items = [];
                    return;
                }
                let doc = await ipc.load({
                    id: this.proj.id,
                    kind: catalog
                });
                this.items = doc ? doc.items : [];
                this.open = [];
                this.expand_all(this.items);
            },
            selected: function (item) {
                if (item && item.length > 0) {
                    let it = item[0];
                    let ited = {
                        kind: it.kind,
                        doc: it,
                    }
                    this.$store.commit('setSeleDoc', ited);
                    if (it.kind !== 'dir') {
                        this.$store.commit('setEditDoc', ited);
                    }
                } else {
                    this.$store.commit('setSeleDoc', null);
                }
            },
            current_items: function () {
                if (!this.items) {
                    this.items = [];
                }
                if (this.active.length === 0) {
                    return this.items;
                } else {
                    let it = this.active[0];
                    if (it.kind === 'dir') {
                        return it.children;
                    } else {
                        let res = tman.findParent(this.items, it.id);
                        return res;
                    }
                }
            },
            onClickOutside: function() {
                //this.active = [];
            }

        },

    }
</script>