<template>
    <v-list shaped dense max-height="300px">
        <v-list-item-group color="primary" v-model="selected">
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                    <v-icon color="grey lighten-2" v-text="icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.name" class="body-1 grey--text text--lighten-2"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
    import ipc from '../../feature/r_ipc';
    import helper from '../../helper/helper';
    import shortid from 'shortid';

    export default {
        props: ['catalog', 'icon', 'lists'],
        mounted: function() {
            if(this.lists) {
                this.items = this.lists;
            } else {
                this.load(this.catalog);
            }
        },
        data: () => {
            return {
                items: [],
                selected: -1,
            }
        },
        computed: {
            proj: function() {
                return this.$store.state.proj;
            },
        },
        watch: {
            catalog: function(v) {
                this.selected = -1;
                if(this.lists) {
                    this.items = this.lists;
                } else {
                    this.load(v);
                }
            },
            selected: function(v) {
                let doc = null;
                if(v>=0 && v<this.items.length) {
                    doc = this.items[v];
                }
                if(!doc) {
                    this.$store.commit('setSeleDoc', null);
                    return;
                }
                let info = {
                    kind: this.catalog,
                    doc: doc,
                }
                this.$store.commit('setSeleDoc', info);
                this.$store.commit('setEditDoc', info);
            }
        },
        methods: {
            action: function(ac, v) {
                switch (ac) {
                    case 'new_file':
                        this.new_file(v);
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
            new_file: async function(n) {
                let res = helper.valid_name(this.items, n);
                if(res !=='ok') {
                    this.$store.commit('setMsgError', res);
                    return;
                }
                let doc = {
                    id: shortid.generate(),
                    proj_id: this.proj.id,
                    name: n.trim(),
                }
                await ipc.insert({kind: this.catalog, doc: doc});
                await this.load(this.catalog);
                this.selected = -1;
                let self = this;
                this.$nextTick(()=>{
                    self.selected = self.items.findIndex(it => it.id === doc.id);
                });
            },

            re_name: async function(n) {
                let doc = this.items[this.selected];
                if(!n) {
                    return;
                }
                n = n.trim();
                if(!n || n === doc.name) {
                    return;
                }
                let res = helper.valid_name(this.items, n);
                if(res !=='ok') {
                    this.$store.commit('setMsgError', res);
                    return;
                }
                doc.name = n;
                await ipc.update({kind: this.catalog, doc: doc});
                await this.load(this.catalog);
                this.selected = this.items.findIndex(it => it.id === doc.id);
            },
            del_item: async function() {
                if(isNaN(this.selected) || this.selected<0 || this.selected>= this.items.length) {
                    return;
                }
                let doc = this.items[this.selected];
                await ipc.remove({kind: this.catalog, doc: doc});
                await this.load(this.catalog);
                this.$store.commit('deletedDoc', doc.id);
            },
            load: async function(catalog) {
                if(!catalog || !this.proj) {
                    this.items = [];
                    return;
                }
                this.items = await ipc.list({proj_id: this.proj.id, kind: catalog});
            }
        }
        
    }
</script>