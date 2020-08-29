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
                <v-treeview activatable dense open-on-click return-object ref="__tree" :items="items"
                    :active.sync="active">
                    <template v-slot:label="{ item, open }">
                        <div @contextmenu="e=>{on_ctxmenu(item); on.click(e);}" style="display: flex">
                            <v-icon v-if="item.kind==='dir'">
                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else>
                                {{ file_icons[item.kind] }}
                            </v-icon>
                            <span class="ml-2"> {{item.name}} </span>
                        </div>
                    </template>
                </v-treeview>
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
            <e-dlg-create-normal v-if="dlg_type==='create-normal'" :dialog="true" :option="dlg_option" @result="on_result" />
        </div>
    </v-card>
</template>
<script>
    import cfg from './config';
    export default {
        components: {
            'e-dlg-create-normal': () => import( /* webpackChunkName: "e-dlg-create-normal" */ './EDlgCreateNormal'),
        },
        data: () => ({
            active: [],
            open_all: false,
            file_icons: cfg.file_icons,
            items: cfg.default_src,
            ctx_menus: cfg.ctx_menus,
            dlg_type: null,
            dlg_option: {},
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
                    acs.push('resued');
                }
                return acs;
            }
        },

        methods: {
            on_packup: function () {
                this.open_all = !this.open_all;
                this.$refs.__tree.updateAll(this.open_all);
            },
            on_ctxmenu: function (it) {
                this.active = [it];
            },
            on_domenu: function(ac) {
                this[`do_${ac}`]();
            },
            on_result: function(res) {
                this.dlg_type = null;
                if(res.result === 'ok') {
                    console.log(res)
                }
            },
            do_new_item: function() {
                this.dlg_type = 'create-normal';
                this.dlg_option = {
                    catalog: this.active[0].catalog,
                    value: ''
                }
            }
        }
    }
</script>