<template>
    <v-sheet color="grey darken-2" id="__CONTAINER" width="100%" height="100%" style="position:relative"
        class="pa-0 ma-0">
        <v-sheet class="jtk-drag-select" :width="cfg_default.DEFAULT_ITEM_WIDTH" v-for="dev in devs" :key="dev.id"
            :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}"
            @mouseup="on_dragend(dev)">
            <v-list class="pa-0">
                <v-list-item :class="cfg_dev_kinds[dev.kind].css_title"
                    :style="`height:${cfg_default.DEFAULT_ITEMS_TITLEHEIGHT}px`">
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
        <e-bus-element v-for="item in buses" :key="item.id" :eid="item.id" @e_dbclick="on_dbclick_bus(item)"
            :size="item.pos.width" :left="item.pos.left" :top="item.pos.top" :title="item.name" />
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
    import EBusElement from './EBusElement';

    export default {
        props: ['map', 'line_type'],
        components: {
            'e-herizontal-bar': EHerizontalBar,
            'e-bus-element': EBusElement,
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
                comm_item: {
                    isTarget: true,
                    isSource: true,
                    createEndpoint: false,
                    allowLoopback: false,
                    maxConnections: 1,
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
        methods: {
            _create_plumb() {
                let p = jsPlumb.getInstance({
                    Container: "__CONTAINER"
                });
                                
                p.importDefaults({
                    ConnectionsDetachable: false,
                    Connector : this.line_type||"StateMachine",//"Bezier",
                    Endpoint: ["Dot", {
                        radius: 8
                    }],
                    EndpointStyle : { fill : "white" },
                    Anchor: ['Left', 'Right'],
                    PaintStyle : { strokeWidth : 3, stroke : "white" },
                });

                p.registerConnectionTypes({
                    "basic": {
                        paintStyle: {
                            stroke: "white",
                            strokeWidth: 3
                        },
                        hoverPaintStyle: {
                            stroke: "#E53935",
                            strokeWidth: 5
                        },
                        cssClass: "connector-normal"
                    },
                    "selected": {
                        paintStyle: {
                            stroke: "#E53935",
                            strokeWidth: 3
                        },
                        hoverPaintStyle: {
                            stroke: "#FFA726",
                            strokeWidth: 5
                        },
                        cssClass: "connector-selected"
                    }
                });
                let self = this;
                p.bind("connection", function (info) {
                    console.log(info)
                    if(info.targetId.indexOf('.')>0) {
                        p.unmakeSource(info.targetId);
                    }
                    p.unmakeTarget(info.sourceId);
                    self._scroll_dev_items(info.targetId.split('.')[0]);
                    let c = info.connection;
                    c.setType("basic");
                    console.log('TODO after connection');
                    c.bind("dblclick", function () {
                        p.makeTarget(c.sourceId, self.comm_item);
                        if(c.targetId.indexOf('.')>0) {
                            p.makeSource(c.targetId, self.comm_item);
                        }
                        p.deleteConnectionsForElement(c.sourceId);
                        console.log('TODO after remove connection');
                    });
                });
                return p;
            },
            _do_draw() {
                this.plumb.draggable('__CONTAINER');
                for(const bus of this.buses) {
                    
                    console.log('bus', bus.pos.width)
                    this.plumb.draggable(bus.id);
                    this.plumb.makeTarget(bus.id, {
                        endpoint: "Dot",
                        anchor: "Continuous",
                        maxConnections: -1,
                    });
                }
                
                for (const dev of this.devs) {
                    this.plumb.draggable(dev.id);
                    this.plumb.addList(document.getElementById(`l_${dev.id}`), {
                        anchor: ['TopRight', 'TopLeft', 'BottomLeft', 'BottomRight'],
                        endpoint: "Blank",
                    });
                    for (const conn of dev.conns) {
                        let id = `${dev.id}.${conn.id}`;
                        if (document.getElementById(id)) {
                            this.plumb.makeTarget(id, this.comm_item);
                            this.plumb.makeSource(id, this.comm_item);
                        }
                    }
                }
            },
            _scroll_dev_items(dev_id) {
                let el = document.getElementById(`l_${dev_id}`);
                if(el) {
                    let evt = document.createEvent("HTMLEvents");
                    evt.initEvent("scroll",true,true);
                    el.dispatchEvent(evt);
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
            },
        
            on_dragend(dev) {
                let el = document.getElementById(dev.id);
                if(dev.pos.left === el.offsetLeft && dev.pos.top === el.offsetTop) {
                    return;
                }
                dev.pos.left = el.offsetLeft;
                dev.pos.top = el.offsetTop;
                console.log('TODO after moved');
            },
            on_dbclick_bus(bus) {
                let buses = this.buses;
                let idx = buses.findIndex(it => it === bus);
                buses.splice(idx, 1);
                this.plumb.remove(bus.id);
                console.log('TODO remove bus');
            },
            on_resize(d, count) {
                if (!this.plumb) {
                    return;
                }
                let p = this.plumb;
                d.pos.show_count = count;
                d.pos.height = this.cfg_default.DEFAULT_ITEMS_TITLEHEIGHT + this.cfg_default.DEFAULT_ITEM_HEIGHT *
                    count + this.cfg_default.DEFAULT_ITEMS_TAILHEIGHT;
                this.$forceUpdate();
                setTimeout(() => {
                    let el = document.getElementById(`l_${d.id}`)
                    p.removeList(el);
                    p.addList(el, {
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
            },
            do_action: (ac) => {
                let fn = self[`action_${ac}`];
                if (fn) {
                    return fn();
                } else {
                    console.log(ac);
                }
            }
        }
    }
</script>