<template>
    <v-sheet color="grey darken-2" id="__CONTAINER" width="100%" height="100%" style="position:relative">
        <v-sheet class="jtk-drag-select" :width="cfg_default.DEFAULT_WIDTH" v-for="dev in devs" :key="dev.id"
            :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}"
            @mouseup="on_dragend(dev)">
            <v-card-title :class="cfg_dev_kinds[dev.kind].css_title">
                <span>{{dev.name}}</span>
                <span class="grey--text text--lighten-1 ml-3">{{dev.memo}}</span>
                <v-spacer></v-spacer>
                <v-btn class="text--primary" icon small>
                    <v-icon small>mdi-pencil</v-icon>
                </v-btn>
            </v-card-title>
            <v-virtual-scroll :items="dev.conns" :item-height="cfg_default.ITEM_HEIGHT" :height="calc_height(dev)"
                class="my-2" bench="0">
                <template v-slot="{ item }">
                    <v-list-item :id="`${dev.id}.${item.id}`" @hook:beforeDestroy="{on_destroy(`${dev.id}.${item.id}`)}"
                        @hook:mounted="{on_mounted(`${dev.id}.${item.id}`)}">
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
        <div id="circle_bus"
            style="position:relative; width: 100px; height: 100px; border-radius: 50px; left: 200px; top: 100px; background-color: gray;" />
    </v-sheet>
</template>
<style scoped>
    .jtk-drag-select * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    ::-webkit-scrollbar {
        display: block;
        width: 3px;
        height: 1px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        border-radius: 10px;
        background: #929191;
    }

    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
    }
</style>
<script>
    import {
        jsPlumb
    } from './jsplumb.min.js';
    import topo_map from '../../../utility/topo_map';
    import cfg from './config_map';

    export default {
        props: ['map'],
        mounted() {
            topo_map.set_config(cfg.map_config);
            let self = this;
            jsPlumb.ready(() => {
                self.ready = true;
                self.redraw(self.map);
            });
        },
        beforeDestroy() {
            this.plumb = null;
        },
        data: () => {
            return {
                cfg_default: cfg.map_config,
                cfg_intf_alias: cfg.intf_alias,
                cfg_dev_kinds: cfg.dev_kinds,
                plumb: null,
                draw_map: null,
                ready: false,
                conn_ends_tyle: {
                    isSource: true,
                    isTarget: true,
                    paintStyle: {
                        fill: 'white',
                    },
                    connector: ['StateMachine'],
                    connectorStyle: {
                        outlineStroke: 'white',
                        strokeWidth: 1
                    },
                }
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
            _do_draw() {
                this.plumb.draggable('__CONTAINER');
                this.plumb.draggable('circle_bus');
                this.plumb.makeTarget('circle_bus', {
                    endpoint: "Dot",
                    anchor: "Continuous",
                    paintStyle: {
                        fill: 'white',
                    },
                });
                for (const dev of this.devs) {
                    this.plumb.draggable(dev.id);
                    for (const conn of dev.conns) {
                        let id = `${dev.id}.${conn.id}`;
                        if (document.getElementById(id)) {
                            this.plumb.addEndpoint(id, {
                                anchors: ['Left', 'Right']
                            }, this.conn_ends_tyle);
                        }
                    }
                }
            },
            redraw(map) {
                if (!map || map === this.draw_map || !this.ready) {
                    return;
                }
                this.draw_map = map;
                this.plumb = jsPlumb.getInstance({
                    Container: "__CONTAINER"
                });
                this.plumb.bind("connectionMoved", function (info) {
                    console.log("connectionMoved", info)
                    return true;
                });
                let self = this;
                this.$nextTick(() => {
                    self.plumb.batch(() => {
                        self._do_draw();
                    });
                });
                setTimeout(() => {
                    if (!self.plumb) {
                        return;
                    }
                    self.do_zoom(0.75, self.plumb);
                    console.log('ok')
                }, 3000);
            },
            calc_height(dev) {
                if (!dev || !dev.conns) {
                    return 15;
                }
                let len = dev.conns.length;
                if (len > this.cfg_default.ITEM_MAX_COUNT) {
                    len = this.cfg_default.ITEM_MAX_COUNT;
                }
                return this.cfg_default.ITEM_HEIGHT * len;
            },
            on_destroy(id) {
                if (!this.plumb) {
                    return;
                }
                this.plumb.deleteEndpoint(id);
            },
            on_mounted(id) {
                if (!this.plumb) {
                    return;
                }
                this.plumb.addEndpoint(id, {
                    anchors: ['Left', 'Right'],
                    uuid: id,
                }, this.conn_ends_tyle);
            },
            on_dragend(dev) {
                let el = document.getElementById(dev.id);
                let rec = {
                    left: el.offsetLeft,
                    top: el.offsetTop,
                    bottom: el.offsetTop + el.offsetHeight,
                    right: el.offsetLeft + el.offsetWidth,
                }
                if (rec.left === dev.pos.left && rec.top === dev.pos.top) {
                    return;
                }
                dev.pos = rec;
                console.log('moved');
            },
            do_zoom(zoom, instance, transformOrigin, el) {
                transformOrigin = transformOrigin || [0.5, 0.5];
                instance = instance || jsPlumb;
                el = el || instance.getContainer();
                var p = ["webkit"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }

                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;

                instance.setZoom(zoom);
            }
        }
    }
</script>