<template>
    <v-navigation-drawer permanent :width="width" app clipped>
        <v-row class="fill-height" no-gutters>
            <v-navigation-drawer mini-variant mini-variant-width="80" permanent>
                <v-list dense nav>
                    <v-list-item v-for="item in pages" :key="item.catalog" @click="changePage(item)" :disabled="!proj">
                        <v-list-item-action>
                            <v-tooltip right open-delay="1500">
                                <template v-slot:activator="{ on }">
                                    <v-badge :content="check_result[item.catalog]?check_result[item.catalog].$count:''"
                                        :value="!!check_result[item.catalog]" color="red" overlap bottom offset-y="20" offset-x="20">
                                        <v-icon large v-on="on" :color="proj && page===item ? 'white':'grey'">
                                            {{ item.icon }}
                                        </v-icon>
                                    </v-badge>
                                </template>
                                <span>{{item.title}}</span>
                            </v-tooltip>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list-item style="position: absolute; left: 6px; bottom: 80px;" @click="listPublic()">
                    <v-list-item-action>
                        <v-tooltip right open-delay="1500">
                            <template v-slot:activator="{ on }">
                                <v-icon large v-on="on" :color="isListPublic ? 'white':'grey'">
                                    mdi-view-dashboard-outline</v-icon>
                            </template>
                            <span>资源库</span>
                        </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>资源库</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item style="position: absolute; left: 6px; bottom: 10px;" @click="listProj()">
                    <v-list-item-action>
                        <v-tooltip right open-delay="1500">
                            <template v-slot:activator="{ on }">
                                <v-icon large v-on="on" :color="isListProj ? 'white':'grey'">mdi-view-sequential
                                </v-icon>
                            </template>
                            <span>项目库</span>
                        </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>项目库</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-navigation-drawer>
            <div v-if="page && width-80>10">
                <v-card :width="width-80" height="100%" tile>
                    <e-mini-bar :items="bar_items" :title="page.title" @edit_item="onMiniBar" />
                    <div style="height: calc(100vh - 90px);  overflow-y:auto">
                        <e-tree-editor v-if="page.type==='tree'" ref="tree_editor" :catalog="page.catalog"
                            :icons="page.icons"> </e-tree-editor>
                        <e-list-editor v-else-if="page.type==='list'" ref="list_editor" :catalog="page.catalog" :errors="check_result[page.catalog]"
                            :icon="page.file_icon"> </e-list-editor>
                        <e-list-editor v-else-if="page.type==='items'" :catalog="page.catalog" :icon="page.file_icon"
                            :lists="page.items"> </e-list-editor>
                    </div>
                </v-card>
            </div>
        </v-row>
    </v-navigation-drawer>
</template>

<script>
    import EMiniBar from './widgets/EMiniToolBar';
    import EListEditor from './widgets/EListEditor';
    import ETreeEditor from './widgets/ETreeEditor';
    import r_ipc from '../feature/r_ipc';
    import cfg from '../helper/cfg_topbar';

    const show_ = cfg.width;
    const hide_ = 80;

    export default {

        components: {
            'e-mini-bar': EMiniBar,
            'e-list-editor': EListEditor,
            'e-tree-editor': ETreeEditor,
        },

        mounted: function () {
            if (this.$route.query.autoopen || this.$route.query.proj_id) {
                let self = this;
                setTimeout(() => {
                    if (self.proj) {
                        self.width = show_;
                    } else {
                        self.page = null;
                    }
                }, 600);
            }
        },

        data: () => ({
            pages: cfg.pages,
            page: cfg.pages[0],
            width: hide_,
            items: [],
            bar_items: cfg[cfg.pages[0].type + '_bars'],
        }),

        computed: {
            isListPublic: function () {
                return this.$route.name === 'ListPublic';
            },
            isListProj: function () {
                return this.$route.name === 'ListProj';
            },
            proj: function () {
                return this.$store.state.proj;
            },
            page_route: function () {
                return this.$route.name;
            },
            check_result: function () {
                let res = this.$store.getters.check_result || {};
                return res;
            }
        },

        watch: {
            page_route: function (v) {
                if (v === 'TestCase') {
                    this.width = show_;
                    if (this.page !== cfg.pages[0]) {
                        this.changePage(cfg.pages[0]);
                    }
                }
            }
        },

        methods: {
            listProj: function () {
                if (this.$route.name === 'ListProj') {
                    this.$router.push({
                        name: 'Home'
                    })
                    return;
                }
                this.width = hide_;
                this.$router.push({
                    name: 'ListProj'
                });
                this.page = null;
            },
            listPublic: function () {
                if (this.$route.name === 'ListPublic') {
                    this.$router.push({
                        name: 'Home'
                    })
                    return;
                }
                this.width = hide_;
                this.$router.push({
                    name: 'ListPublic'
                });
                this.page = null;
            },
            changePage: function (page) {
                this.$store.commit('setSeleDoc', null);
                if (this.page === page) {
                    this.width = this.width === show_ ? hide_ : show_;
                } else {
                    this.page = page;
                    this.updateBarItems();
                    this.width = show_;
                    if (this.$route.name === 'ListProj' || this.$route.name === 'ListPublic') {
                        this.$router.push({
                            name: 'Home'
                        });
                    }
                }
            },
            updateBarItems: async function () {
                this.bar_items = cfg[this.page.type + '_bars'];
                if (this.page.catalog === 'tools') {
                    this.items = [];
                } else if (this.page.catalog === 'project') {
                    this.items = [];
                } else {
                    this.items = await r_ipc.list({
                        kind: this.page.catalog,
                        proj_id: this.proj.id
                    });
                }
            },
            onMiniBar: function (action, value) {
                if (this.page.type === 'tree') {
                    this.$refs.tree_editor.action(action, value);
                } else if (this.page.type === 'list') {
                    this.$refs.list_editor.action(action, value);
                }
            },
            onOutClick: function () {
                if (this.page.type === 'tree') {
                    // this.$refs.tree_editor.action(action, value);
                    console.log('out click')
                }
            },
        }
    }
</script>