<template>
    <v-navigation-drawer permanent :width="width" app clipped>
        <v-row class="fill-height" no-gutters>
            <v-navigation-drawer mini-variant mini-variant-width="80" permanent>
                <v-list dense nav>
                    <v-list-item v-for="item in pages" :key="item.key" @click="onClick(item)">
                        <v-list-item-action>
                            <v-tooltip right open-delay="1500">
                                <template v-slot:activator="{ on }">
                                    <v-icon large v-on="on" :color="page===item ? 'white':'grey'">{{ item.icon }}
                                    </v-icon>
                                </template>
                                <span>{{item.title}}</span>
                            </v-tooltip>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list-item style="position: absolute; left: 6px; bottom: 80px;" @click="newProj()">
                    <v-list-item-action>
                        <v-tooltip right open-delay="1500">
                            <template v-slot:activator="{ on }">
                                <v-icon large v-on="on" :color="is_newproj ? 'white':'grey'">mdi-plus-thick</v-icon>
                            </template>
                            <span>新建项目</span>
                        </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>新建项目</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item style="position: absolute; left: 6px; bottom: 10px;" @click="openProj()">
                    <v-list-item-action>
                        <v-tooltip right open-delay="1500">
                            <template v-slot:activator="{ on }">
                                <v-icon large v-on="on" :color="is_listproj ? 'white':'grey'">mdi-view-list</v-icon>
                            </template>
                            <span>全部项目</span>
                        </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>全部项目</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-navigation-drawer>
            <e-file-editor v-if="width-80>10" :page="page" :width="width-80" />
        </v-row>
    </v-navigation-drawer>
</template>

<script>
    import EFileEditor from './EFileEditor';

    const show_ = 420;
    const hide_ = 80;

    const pages_ = [{
        icon: 'mdi-file-multiple-outline',
        title: '测试用例',
        key: 'testcase',
        kind: 'tree',
    }, {
        icon: 'mdi-chart-bell-curve',
        title: '监控页面',
        key: 'page',
        kind: 'list',
    }, {
        icon: 'mdi-comment-processing-outline',
        title: '通信协议',
        key: 'protocol',
        kind: 'list',
    }, {
        icon: 'mdi-developer-board',
        title: '设备接口',
        key: 'device',
        kind: 'list',
    }, {
        icon: 'mdi-link-variant',
        title: '连接拓扑',
        key: 'topology',
        kind: 'list',
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        key: 'tools',
        kind: 'items'
    }, {
        icon: 'mdi-cog-outline',
        title: '项目设置',
        key: 'project',
        kind: 'items'
    }];

    export default {

        components: {
            'e-file-editor': EFileEditor,
        },

        data: () => ({
            pages: pages_,
            page: pages_[0],
            width: hide_,
        }),

        computed: {
            is_newproj: function() {
                return this.$route.name === 'NewProj';
            },
            is_listproj: function() {
                return this.$route.name === 'ListProj';
            }
        },

        methods: {
            openProj: function () {
                if (this.$route.name === 'ListProj') {
                    return;
                }
                this.width = hide_;
                this.$router.push({
                    name: 'ListProj'
                });
                this.page = null;
            },
            newProj: function () {
                if (this.$route.name === 'NewProj') {
                    return;
                }
                this.width = hide_;
                this.$router.push({
                    name: 'NewProj'
                });
                this.page = null;
            },
            onClick: function (page) {

                if (this.page === page) {
                    this.width = this.width === show_ ? hide_ : show_;
                } else {
                    this.page = page;
                    if (this.width === hide_) {
                        this.width = show_;
                    }
                }
                if (this.$route.name === 'Empty') {
                    return;
                }
                this.$router.push({
                    name: 'Empty'
                });
            }
        }
    }
</script>