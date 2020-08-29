<template>
    <v-navigation-drawer permanent :width="width" app clipped>
        <v-row class="fill-height" no-gutters>
            <v-navigation-drawer mini-variant mini-variant-width="80" permanent>
                <v-list dense nav>
                    <v-list-item v-for="item in proj_modules" :key="item.catalog" @click="on_module(item)">
                        <v-list-item-action>
                            <v-tooltip right open-delay="300">
                                <template v-slot:activator="{ on }">
                                    <v-icon large v-on="on" :color="active===item ? 'white':'grey'">
                                        {{ item.icon }}
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
                <v-list dense nav>
                    <v-list-item v-for="(item, idx) in pub_modules" :key="item.catalog" @click="on_module(item)"
                        :style="{position: 'absolute', left: '10px', bottom: `${idx*70+10}px`}">
                        <v-list-item-action>
                            <v-tooltip right open-delay="300">
                                <template v-slot:activator="{ on }">
                                    <v-icon large v-on="on" :color="active===item ? 'white':'grey'">
                                        {{ item.icon }}
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
            </v-navigation-drawer>
            <div v-if="show_subbar" style="display: flex;">
                <v-card tile color="grey darken-3" :width="`${width-80-6}px`" style="height: calc(100vh - 34px); overflow-y:auto">
                    <e-tool-list v-if="subbar_type==='tools'" @close="on_close"> </e-tool-list>
                    <e-src-man v-else-if="subbar_type==='program'"> </e-src-man>
                </v-card>
                <e-vertical-bar :width="width" :min="200" :max="800" @resize="on_resize" />
            </div>
        </v-row>
    </v-navigation-drawer>
</template>

<script>
    import cfg from './config';
    import EVerticalBar from '../Utility/EVerticalBar';
    import EToolList from './Tools/EToolList';
    import ESrcTree from './SrcTree/ESrcTree';

    const mini_width = 80;

    export default {

        components: {
            'e-vertical-bar': EVerticalBar,
            'e-tool-list': EToolList,
            'e-src-man': ESrcTree,
        },

        data: () => ({
            proj_modules: cfg.proj_modules,
            pub_modules: cfg.pub_modules,
            width: mini_width,
            saved_width: 500,
            active: null,
        }),


        computed: {
            show_subbar: function () {
                return this.width > mini_width && this.active && this.active.subbar;
            },
            subbar_type: function () {
                if (this.active && this.active.subbar) {
                    return this.active.catalog;
                }
                return '';
            },
            page_route: function () {
                return this.$route.name;
            },
        },

        
        watch: {
            page_route: function (v) {
                if (v === 'SrcTree') {
                    if(this.width === mini_width) {
                        this.toggle_subbar();
                    }
                    if (this.active !== this.proj_modules[0]) {
                        this.on_module(this.proj_modules[0]);
                    }
                }
            }
        },

        methods: {
            toggle_subbar: function () {
                if (this.width > mini_width) {
                    this.width = mini_width;
                } else if (this.active && this.active.subbar) {
                    this.width = this.saved_width;
                }
            },

            on_close: function() {
                this.width = mini_width;
            },

            on_module: function (item) {
                if (this.active === item) {
                    return this.toggle_subbar();
                }

                this.active = item;
                if (item.subbar) {
                    this.width = this.saved_width;
                } else {
                    this.width = mini_width;
                }

                if (item.route && this.$route.name !== item.route) {
                    this.$router.push({
                        name: item.route
                    });
                }
            },

            on_resize: function (width) {
                this.width = width;
                this.saved_width = width;
            },
        }


    }
</script>