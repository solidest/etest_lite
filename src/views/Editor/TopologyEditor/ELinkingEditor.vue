<template>
    <v-sheet color="grey darken-2" width="100%" height="100%" id="__CONTAINER" style="position:relative">
        <v-sheet class="jtk-drag-select" :width="cfg_default.DEFAULT_WIDTH" v-for="dev in devs" :key="dev.id"
            :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}">
            <v-card-title :class="cfg_dev_kinds[dev.kind].css_title" >
                <span>{{dev.name}}</span>
                <span class="grey--text text--lighten-1 ml-3">{{dev.memo}}</span>
                <v-spacer></v-spacer>
                <v-btn class="text--primary" icon small>
                    <v-icon small>mdi-pencil</v-icon>
                </v-btn>
            </v-card-title>
            <v-virtual-scroll :items="dev.conns" :item-height="cfg_default.ITEM_HEIGHT" :height="calc_height(dev)"
                class="my-2">
                <template v-slot="{ item }">
                    <v-list-item :id="item.id">
                        <v-list-item-avatar size="38">
                            <v-avatar color="grey darken-2" class="white--text">
                                <span class="body-2">{{ cfg_intf_alias[item.kind] }}</span>
                            </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>
                                <span class="text-lg-h6 grey--text text--lighten-3">{{ item.name }}</span>
                                <span class="grey--text text-lg-h6  ml-2" v-if="item.memo">{{ ` ${item.memo}` }}</span>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-virtual-scroll>
        </v-sheet>
    </v-sheet>
</template>
<style scoped>
    .jtk-drag-select * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
<script>
    import {
        jsPlumb
    } from 'jsplumb';
    import topo_map from '../../../utility/topo_map';
    import cfg from './config_map';

    export default {
        props: ['map'],
        mounted: function () {
            topo_map.set_config(cfg.map_config);
            let self = this;
            jsPlumb.ready(() => {
                self.ready = true;
                self.redraw(self.map);
            });
        },
        data: () => {
            return {
                cfg_default: cfg.map_config,
                cfg_intf_alias: cfg.intf_alias,
                cfg_dev_kinds: cfg.dev_kinds,
                plumb: null,
                draw_map: null,
                ready: false,
            }
        },
        computed: {
            devs() {
                return this.map ? this.map.devs : [];
            },
            buses() {
                return this.map ? this.map.links.filter(l => l.is_bus) : [];
            },
        },
        watch: {
            map: function (m) {
                this.redraw(m);
            }
        },
        methods: {
            _set_conn(conn) {
                console.log(conn);
                let common = {
                    isSource: true,
                    isTarget: true,
                    connector: ['Straight']
                }

                this.plumb.addEndpoint(conn.id, {
                    anchors: ['Left']
                }, common)
            },
            _do_draw() {
                let self = this;
                this.plumb.draggable('__CONTAINER');
                this.devs.forEach(dev => {
                    self.plumb.draggable(dev.id);
                    dev.conns.forEach(conn => {self._set_conn(conn)});
                });
            },
            redraw(map) {
                if (!map || map === this.draw_map || !this.ready) {
                    return;
                }
                this.draw_map = map;
                this.plumb = jsPlumb.getInstance({
                    Container:"__CONTAINER"
                });
                let self = this;
                self.plumb.setSuspendDrawing(true);
                this.$nextTick(() => {
                    self._do_draw();
                    self.plumb.setSuspendDrawing(false, true);
                });
            },
            calc_height(dev) {
                if (!dev || !dev.conns) {
                    return 15;
                }
                let all_h = this.cfg_default.ITEM_HEIGHT * dev.conns.length;
                let res = all_h > this.cfg_default.ITEMS_MAX_HEIGHT ? this.cfg_default.ITEMS_MAX_HEIGHT : all_h;
                return res + this.cfg_default.ITEM_HEIGHT / 2;
            },

            
        }
    }
</script>