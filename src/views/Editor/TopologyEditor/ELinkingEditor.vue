<template>
    <v-sheet color="grey darken-2" id="__CONTAINER" width="100%" height="100%" style="position:relative" class="pa-0 ma-0">
        <v-sheet class="jtk-drag-select" :width="cfg_default.DEFAULT_ITEM_WIDTH" v-for="dev in devs" :key="dev.id"
            :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}"
            @mouseup="on_dragend(dev)">
            <v-list class="pa-0">
                <v-list-item :class="cfg_dev_kinds[dev.kind].css_title" :style="`height:${cfg_default.DEFAULT_ITEMS_TITLEHEIGHT}px`">
                    <v-list-item-icon class="mr-3">
                        <v-icon>mdi-network-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="text-lg-h6"> {{dev.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{dev.memo}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon>
                            <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <div :id="`l_${dev.id}`" class="d-flex flex-column pa-0 ma-0"
                :style="{position:'relative', overflow:`${dev.conns.length>cfg_default.DEFAULT_ITEMS_MINCOUNT?'auto':'hidden'}`, height:`${dev.pos.show_count*cfg_default.DEFAULT_ITEM_HEIGHT}px`}">
                <v-list-item :id="`${dev.id}.${item.id}`" v-for="item in dev.conns" :key="item.id"
                    style="border-bottom: 1px solid grey">
                    <v-list-item-avatar size="38">
                        <v-avatar color="grey darken-2" class="white--text">
                            <span class="body-2">{{ cfg_intf_alias[item.kind] }}</span>
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="body1 grey--text text--lighten-3">{{ item.name }}</span>
                            <span class="body1 grey--text ml-2" v-if="item.memo">{{ ` ${item.memo}` }}</span>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </div>
            <e-herizontal-bar v-if="dev.conns.length>cfg_default.DEFAULT_ITEMS_MINCOUNT" :count="dev.pos.show_count"
                :step="cfg_default.DEFAULT_ITEM_HEIGHT" :min="cfg_default.DEFAULT_ITEMS_MINCOUNT" 
                :max="Math.min(dev.conns.length, cfg_default.DEFAULT_ITEMS_MAXCOUNT)"
                @resize="(count) => {on_resize(dev, count)}" />
        </v-sheet>
        <!-- <div id="circle_bus"
            style="position:relative; width: 160px; height: 160px; border-radius: 80px; left: 200px; top: 100px; background-color: #BDBDBD;" /> -->
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
        width: 6px;
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
    import EHerizontalBar from '../../Components/EHorizontalBar';

    export default {
        props: ['map'],
        components: {
            'e-herizontal-bar': EHerizontalBar,
        },
        mounted() {
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
                cfg_default: topo_map.map_default,
                cfg_intf_alias: cfg.intf_alias,
                cfg_dev_kinds: cfg.dev_kinds,
                selected_links: [],
                plumb: null,
                draw_map: null,
                ready: false,
                conn_ends_tyle: {
                    isSource: true,
                    isTarget: true,
                    endpoint: ["Dot", {
                        radius: 6
                    }],
                    paintStyle: {
                        fill: 'white',
                        strokeWidth: 2
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
            },
        },
        methods: {
            _create_plumb() {
                let p = jsPlumb.getInstance({
                    Container: "__CONTAINER"
                });
                let self = this;
                p.importDefaults({ 
                    ConnectionsDetachable: false,
                });
                p.bind("connection", function(info) {
                    p.unmakeTarget(info.sourceId);
                    p.unmakeSource(info.targetId);
                    let c = info.connection;
                    c.setType("basic")
                    c.bind("click", function() {
                        console.log('c',c)
                        if(self.selected_links.includes(c.id)) {
                            c.toggleType("basic");
                            let idx = self.selected_links.findIndex(it => it === c.id);
                            self.selected_links.splice(idx, 1);
                        } else {
                            c.toggleType("selected");
                            self.selected_links.push(c.id);
                        }
                    }); 
                });
                p.bind("connectionMoved", function (info) {
                    console.log("connectionMoved", info)
                    return true;
                });
                // p.bind("beforeDrop", function (info) {
                //     console.log('beforeDrop', info);
                //     // self.plumb.repaintEverything();
                //     return true;
                // });
                p.registerConnectionTypes({
                    "basic": {
                        paintStyle:{ stroke:"white", strokeWidth:5  },
                        // hoverPaintStyle:{ stroke:"red", strokeWidth:7 },
                        cssClass:"connector-normal"
                    },
                    "selected":{
                        paintStyle:{ stroke:"#2979FF", strokeWidth:5 },
                        // hoverPaintStyle:{ strokeWidth: 17, stroke:"red" },
                        cssClass:"connector-selected"
                    } 
                });
                return p;
            },
            _do_draw() {
                this.plumb.draggable('__CONTAINER');
                // this.plumb.draggable('circle_bus');
                // this.plumb.makeTarget('circle_bus', {
                //     endpoint: "Dot",
                //     anchor: "Continuous",
                //     paintStyle: {
                //         fill: 'white',
                //     },
                // });
                for (const dev of this.devs) {
                    this.plumb.draggable(dev.id);
                    this.plumb.addList(document.getElementById(`l_${dev.id}`), {
                        anchor: ['TopRight', 'TopLeft', 'BottomLeft', 'BottomRight'],
                        endpoint: "Blank",
                    });
                    for (const conn of dev.conns) {
                        let id = `${dev.id}.${conn.id}`;
                        if (document.getElementById(id)) {
                            this.plumb.makeTarget(id, {
                                anchor: ['Left', 'Right'],
                                isTarget: true,
                                isSource: true,
                                createEndpoint: false,
                                allowLoopback: false,
                                maxConnections: 1,
                            }, this.conn_ends_tyle);
                            this.plumb.makeSource(id, {
                                anchor: ['Left', 'Right'],
                                isTarget: true,
                                isSource: true,
                                createEndpoint: false,
                                allowLoopback: false,
                                maxConnections: 1,
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
                this.plumb = this._create_plumb();
                let self = this;
                this.$nextTick(() => {
                    self.plumb.batch(() => {
                        self._do_draw();
                    });
                });
                // setTimeout(() => {
                //     if (!self.plumb) {
                //         return;
                //     }
                //     self.do_zoom(0.75, self.plumb);
                //     console.log('ok')
                // }, 3000);
            },
            calc_min_h(dev) {
                let len = dev.conns.length;
                if (len > 8) {
                    len = 8;
                }
                return len * this.cfg_default.DEFAULT_ITEM_HEIGHT;
            },
            calc_max_h(dev) {
                let len = dev.conns.length;
                if (len > 20) {
                    len = 20;
                }
                return len * this.cfg_default.DEFAULT_ITEM_HEIGHT;
            },
            has_scroll(dev) {
                let len = dev.conns.length;
                return len > 8;
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
            on_resize(d, count) {
                if (!this.plumb) {
                    return;
                }
                let p = this.plumb;
                d.pos.show_count = count;
                d.pos.height = this.cfg_default.DEFAULT_ITEMS_TITLEHEIGHT + this.cfg_default.DEFAULT_ITEM_HEIGHT*count + this.cfg_default.DEFAULT_ITEMS_TAILHEIGHT;
                this.$forceUpdate();
                setTimeout(() => {
                    p.removeList(document.getElementById(`l_${d.id}`));
                    p.addList(document.getElementById(`l_${d.id}`), {
                        anchor: ['TopRight', 'TopLeft', 'BottomLeft', 'BottomRight'],
                        endpoint: "Blank",
                    });
                }, 200);
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