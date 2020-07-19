<template>
    <v-treeview dense :items="items" :active.sync="active" activatable item-key="id" hoverable
        @update:active="selected" :open.sync="open" return-object selection-type="independent"
        v-click-outside="onClickOutside" @drop.native="on_drop">
        <template v-slot:prepend="{ item, open }">
            <v-icon draggable v-if="item.kind==='dir'" color="grey lighten-2" 
                @drop.native="(ev) => on_drop(ev, item)" @dragover.native="(ev) => on_dragover(ev, item)" 
                @dragstart.native="(ev) => on_dragstart(ev, item)" @dragend="by_drag=null" >
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon draggable v-else :color="`${error_obj[item.id]?'red':'grey'} lighten-2`" 
                @drop.native="(ev) => on_drop(ev, item)" @dragover.native="(ev) => on_dragover(ev, item)" 
                @dragstart.native="(ev) => on_dragstart(ev, item)"  @dragend="by_drag=null" >
                {{ icons[item.kind] }}
            </v-icon>
        </template>
        <template v-slot:label="{ item }">
            <span style="cursor:pointer;" class="body-1 grey--text text--lighten-2" > {{item.name}}</span>
        </template>
    </v-treeview>
</template>
<script>
    import ipc from '../../feature/ipc_render';
    import tman from '../../helper/tree_man';
    import helper from '../../helper/helper';
    import shortid from 'shortid';

    export default {
        props: ['catalog', 'icons', 'errors'],

        mounted: function () {
            this.load(this.catalog);
        },
        data: () => {
            return {
                items: [],
                active: [],
                open: [],
                by_drag: null,
            }
        },
        computed: {
            proj: function () {
                return this.$store.state.proj;
            },
            error_obj: function() {
                if(this.errors) {
                    return this.errors;
                }
                return {};
            }
        },
        watch: {
            proj: function () {
                this.load(this.catalog);
            }
        },

        methods: {
            on_dragstart: function(ev, item) {
                this.by_drag = item;
                ev.dataTransfer.setData("Text", item.id);
                ev.dataTransfer.effectAllowed = 'move';
            },
            on_dragover: function(ev, item) {
                ev.preventDefault();
                if(!this.by_drag) {
                    return;
                }
                let root = {id: 'root', children: this.items};
                if(tman.allowMove(root, this.by_drag.id, item)) {
                    ev.dataTransfer.dropEffect = 'move';
                } else {
                    ev.dataTransfer.dropEffect = 'none';
                }
            },
            on_drop: function(ev, item) {
                this.by_drag = null;
                let from_id = ev.dataTransfer.getData("Text");
                let root = {id: 'root', children: this.items};
                if(tman.moveItem(root, from_id, item)) {
                    this.save_all();
                }
            },
            new_item: async function(its, name, kind, children) {
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
            on_new_item: async function (name, type) {
                let its = this.current_items();
                if (this.valid_name(its, name)) {
                    await this.new_item(its, name.trim(), type, type==='dir'?[]: undefined );
                }
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
            action: function (ac, v, t) {
                switch (ac) {
                    case 'new_file': 
                        this.on_new_item(v, t);
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
            re_name: async function (n) {
                if(this.active.length===0) {
                    return;
                }
                let it = this.active[0];
                if(n && n.trim()===it.name) {
                    return;
                }
                let its = tman.findParentChildren(this.items, it.id);
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
                        let res = tman.findParentChildren(this.items, it.id);
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