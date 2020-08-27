<template>

    <v-list shaped dense>

            <v-menu absolute style="max-width: 200px">
                <template v-slot:activator="{on}">
                    <v-list-item v-for="(item, i) in items" :key="i" @contextmenu="e=>{ctx_item=item; on.click(e);}" @click.stop>
                        <v-list-item-icon class="mx-1">
                            <v-icon small v-text="icon"></v-icon>
                            <!-- <v-icon :color="`${error_obj[item.id]?'red':'grey'} lighten-2`" v-text="icon"></v-icon> -->
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="pa-1" v-text="item.name"></v-list-item-title>
                            <!-- <v-list-item-title class="pa-1" v-text="item.name" :class="`body-1 ${error_obj[item.id]?'red':'gerey'}--text text--lighten-2`"></v-list-item-title> -->
                        </v-list-item-content>
                    </v-list-item>
                </template>

                <v-list dense>
                    <v-list-item v-for="(item, index) in ctx_menus" :key="index">
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
    </v-list>



</template>

<script>
    // import ipc from '../../feature/ipc_render';
    // import helper from '../../helper/helper';
    // import shortid from 'shortid';

    export default {
        props: ['catalog', 'icon', 'ctx_menus'],
        mounted: function() {
            console.log(this.ctx_menus)
        },
        data: () => {
            return {
                items: [{
                    name: 'item1'
                }, {
                    name: 'item2'
                }],
                ctx_item: null,
            }
        },
        // computed: {
        //     proj: function() {
        //         return this.$store.state.proj;
        //     },
        //     error_obj: function() {
        //         if(this.errors) {
        //             return this.errors;
        //         }
        //         return {};
        //     }
        // },
        watch: {
            // catalog: function(v) {
            //     this.selected = -1;
            //     if(this.lists) {
            //         this.items = this.lists;
            //     } else {
            //         this.load(v);
            //     }
            // },
            ctx_item: function(i) {
                console.log(i)
            },
            selected: function (v) {
                let self = this;
                this.$nextTick(() => {
                    self.selected = -1;
                });
                if (v >= 0) {
                    console.log('TODO')
                }

                // let doc = null;
                // if(v>=0 && v<this.items.length) {
                //     doc = this.items[v];
                // }
                // if(!doc) {
                //     this.$store.commit('setSeleDoc', null);
                //     return;
                // }
                // let info = {
                //     kind: this.catalog,
                //     doc: doc,
                // }
                // this.$store.commit('setSeleDoc', info);
                // this.$store.commit('setEditDoc', info);
            }
        },

        // methods: {
        //     action: function(ac, v) {
        //         if(!this[ac]) {
        //             console.log('TODO action', ac, v)
        //             return;
        //         }
        //         this[ac](v);
        //     },
        //     new_file: async function(n) {
        //         let res = helper.valid_name(this.items, n);
        //         if(res !=='ok') {
        //             this.$store.commit('setMsgError', res);
        //             return;
        //         }
        //         let doc = {
        //             id: shortid.generate(),
        //             proj_id: this.proj.id,
        //             name: n.trim(),
        //         }
        //         await ipc.insert({kind: this.catalog, doc: doc});
        //         await this.load(this.catalog);
        //         this.selected = -1;
        //         let self = this;
        //         this.$nextTick(()=>{
        //             self.selected = self.items.findIndex(it => it.id === doc.id);
        //         });
        //     },

        //     re_name: async function(n) {
        //         let doc = this.items[this.selected];
        //         if(!n) {
        //             return;
        //         }
        //         n = n.trim();
        //         if(!n || n === doc.name) {
        //             return;
        //         }
        //         let res = helper.valid_name(this.items, n);
        //         if(res !=='ok') {
        //             this.$store.commit('setMsgError', res);
        //             return;
        //         }
        //         doc.name = n;
        //         await ipc.update({kind: this.catalog, doc: doc});
        //         await this.load(this.catalog);
        //         this.selected = this.items.findIndex(it => it.id === doc.id);
        //     },
        //     del_item: async function() {
        //         if(isNaN(this.selected) || this.selected<0 || this.selected>= this.items.length) {
        //             return;
        //         }
        //         let oldsel = this.selected;
        //         let doc = this.items[this.selected];
        //         await ipc.remove({kind: this.catalog, doc: doc});
        //         await this.load(this.catalog);
        //         this.$store.commit('deletedDoc', doc.id);

        //         if(oldsel===this.items.length) {
        //             oldsel = this.items.length-1;
        //         }
        //         this.selected = -1;
        //         let self = this;
        //         this.$nextTick(() => {
        //             self.selected = oldsel;
        //         });
        //     },
        //     clone_item: async function() {
        //         if(isNaN(this.selected) || this.selected<0 || this.selected>= this.items.length) {
        //             return;
        //         }
        //         let opt = {
        //             kind: this.catalog,
        //             id: this.items[this.selected].id,
        //             proj_id: this.proj.id,
        //         }
        //         let res = await ipc.clone_element(opt);
        //         if(res) {
        //             await this.load(this.catalog);
        //             this.selected = -1;
        //             let self = this;
        //             this.$nextTick(() => {
        //                 self.selected = self.items.findIndex(it => it.id === res.id);
        //             })
        //         } else {
        //             this.$store.commit('setMsgError', '执行失败');
        //         }
        //     },
        //     export_item: async function() {
        //         if(isNaN(this.selected) || this.selected<0 || this.selected>= this.items.length) {
        //             return;
        //         }
        //         let it = this.items[this.selected];
        //         let opt = {
        //             kind: this.catalog,
        //             id: it.id,
        //             proj_id: this.proj.id,
        //             name: it.name,
        //         }
        //         let res = await ipc.export_element(opt);
        //         if(res.result!=='ok') {
        //             this.$store.commit('setMsgError', res.value);
        //         }
        //     },
        //     load: async function(catalog) {
        //         if(!catalog || !this.proj) {
        //             this.items = [];
        //             return;
        //         }
        //         this.items = await ipc.list({proj_id: this.proj.id, kind: catalog});
        //     }
        // }

    }
</script>