<template>
    <v-sheet color="grey darken-2" id="__CONTAINER" width="100%" height="100%" class="pa-0 ma-0"
        @mouseup="on_dragedcanvas" :style="{position: 'absolute', left: `${canv_pos.left}px`, top: `${canv_pos.top}px`}">
        <v-sheet class="jtk-drag-select" :width="cfg_default.DEFAULT_ITEM_WIDTH" v-for="dev in devs" :key="dev.id"
            :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}"
            @mouseup="on_drageddev(dev)">
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
                        <v-btn icon @click="on_open_dev(dev.id)">
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
                @resize="(count) => {on_items_resize(dev, count)}" />
        </v-sheet>
        <e-bus-element v-for="item in buses" :key="item.id" :eid="item.id" @e_dbclick="on_remove_bus(item)"
            :size="item.pos.width" :left="item.pos.left" :top="item.pos.top" :title="item.name" @moved="p=>{on_dragedbus(item, p)}" />
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
    import tman from '../../../utility/tree_man';
    import db from '../../../doc/workerdb';
    import EBusElement from './EBusElement';
    import link_check from '../../../utility/link_check';

    export default {
        props: ['map', 'line_type', 'scale', 'left', 'top'],
        components: {
            'e-herizontal-bar': EHerizontalBar,
            'e-bus-element': EBusElement,
        },
        mounted() {
            this.canv_pos = {
                top: this.top||0,
                left: this.left||0
            };
            let self = this;
            jsPlumb.ready(() => {
                self.ready = true;
                self.redraw(self.map);
            });
        },
        data: () => {
            return {
                cfg_default: topo_map.map_default,
                cfg_intf_alias: cfg.intf_alias,
                cfg_dev_kinds: cfg.dev_kinds,
                selected_links: [],
                plumb: null,
                ready: false,
                comm_item: {
                    isTarget: true,
                    isSource: true,
                    createEndpoint: false,
                    allowLoopback: false,
                    maxConnections: 1,
                },
                loading: false,
                canv_pos: {
                    left: 0,
                    top: 0,
                }
            }
        },
        computed: {
            devs() {
                return this.map ? this.map.devs : [];
            },
            buses() {
                return this.map ? this.map.buses : [];
            },
            links() {
                return this.map ? this.map.links : [];
            },
        },
        watch: {
            scale(v) {
                this.do_zoom(v);
            }
        },
        methods: {
            _create_plumb() {
                let p = jsPlumb.getInstance({
                    Container: "__CONTAINER"
                });
                                
                p.importDefaults({
                    ConnectionsDetachable: false,
                    Connector : this.line_type,
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
                            stroke: "#FFA726",
                            strokeWidth: 5
                        },
                        cssClass: "connector-normal"
                    },
                    "errored": {
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
                p.bind("beforeDrop", function(info) {
                    if(info.sourceId.indexOf('.')<0) {
                        return false;
                    }
                    if(info.targetId.indexOf('.')>0) {
                        let fromids = info.sourceId.split('.');
                        let toids = info.targetId.split('.');
                        return link_check.allow_link(self.map.getKind(fromids[0], fromids[1]), self.map.getKind(toids[0], toids[1]));
                    }
                    if(self.buses.find(b => b.id === info.targetId)) {
                        let fromids = info.sourceId.split('.');
                        let bus_kinds = self.map.getBusKinds(info.targetId);
                        let res = link_check.allow_bus(self.map.getKind(fromids[0], fromids[1]), bus_kinds);
                        return res;
                    }
                    return false;
                });
                p.bind("connection", function (info) {
                    let c = info.connection;
                    if(self.loading) {
                        return;
                    }
                    c.setType("basic");
                    p.unmakeTarget(info.sourceId);
                    self._scroll_dev_items(info.targetId.split('.')[0]);
                    if(info.targetId.indexOf('.')>0) {
                        p.unmakeSource(info.targetId);
                        self._set_arraow(c);
                    }
                    if(!self._add_linkdata(c.id, c.sourceId, c.targetId)) {
                        setTimeout(()=>{p.deleteConnection(c)}, 0);
                        return;
                    }
                    self.$emit('changed');
                    c.bind("dblclick", ()=>{self._remove_link(c)});
                });
                return p;
            },
            _remove_link(c) {
                if(c.sourceId.indexOf('.')<0) {
                    return;
                }
                this.plumb.makeTarget(c.sourceId, this.comm_item);
                if(c.targetId.indexOf('.')>0) {
                    this.plumb.makeSource(c.targetId, this.comm_item);
                }
                this.plumb.deleteConnectionsForElement(c.sourceId);
                this._remove_linkdata(c.sourceId);
                this.$emit('changed');
            },
            _do_draw() {
                this.loading = true;
                this.plumb.draggable('__CONTAINER');
                let buses = this.buses;
                for(const bus of buses) {
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
                        if(conn.link) {
                            continue;
                        }
                        let id = `${dev.id}.${conn.id}`;
                        this.plumb.makeTarget(id, this.comm_item);
                        this.plumb.makeSource(id, this.comm_item);
                    }
                }

                let self = this;
                for(const link of this.links) {
                    let c
                    if(link.bus_id) {
                        let conn_id = `${link.dc.dev.id}.${link.dc.conn.id}`;
                        this.plumb.makeSource(conn_id, this.comm_item);
                        c = this.plumb.connect({source: conn_id, target: link.bus_id});
                        c.setType("basic");
                    } else {
                        let from_id =  `${link.dc1.dev.id}.${link.dc1.conn.id}`;
                        let to_id =  `${link.dc2.dev.id}.${link.dc2.conn.id}`;
                        this.plumb.makeSource(from_id, this.comm_item);
                        this.plumb.makeTarget(to_id, this.comm_item);
                        c = this.plumb.connect({source: from_id, target: to_id});
                        c.setType("basic");
                        this._set_arraow(c);
                    }
                    c.bind("dblclick", ()=>{self._remove_link(c)});
                    this.plumb.setIdChanged(c.id, link.id);
                }
                if(this.scale!==1) {
                    this.do_zoom(this.scale);
                }
                this.loading = false;
            },
            _scroll_dev_items(dev_id) {
                let el = document.getElementById(`l_${dev_id}`);
                if(el) {
                    let evt = document.createEvent("HTMLEvents");
                    evt.initEvent("scroll",true,true);
                    el.dispatchEvent(evt);
                }
            },
            _add_linkdata(link_id, from_id, to_id) {
                let r;
                if(to_id.indexOf('.')>0) {
                    let ids1 = from_id.split('.');
                    let ids2 = to_id.split('.');
                    r = this.map.pushPLink(link_id, link_id, {dev:{id:ids1[0]}, conn:{id:ids1[1]}}, {dev:{id:ids2[0]}, conn:{id:ids2[1]}})
                } else {
                    let ids = from_id.split('.');
                    r = this.map.pushBLink(link_id, link_id, to_id, {dev: {id: ids[0]}, conn: {id: ids[1]}});
                }
                if(!r) {
                    console.error('ERROR')
                }
                return r;
            },
            _remove_linkdata(source_id) {
                let ids = source_id.split('.');
                let r = this.map.removeLink(ids[0], ids[1]);
                if(!r) {
                    console.error('remove link error', source_id);
                }
            },
            _set_arraow(c) {
                let fromids = c.sourceId.split('.');
                let toids = c.targetId.split('.');
                if(fromids.length!==2 || toids.length!==2) {
                    return;
                }
                let direct = link_check.calc_arrow(this.map.getKind(fromids[0], fromids[1]), this.map.getKind(toids[0], toids[1]));
                if(direct!==0) {
                    c.addOverlay([ "Arrow", { width:15, height:15, direction: direct, location: (direct>0 ? 0.7:0.3)}]);
                }
            },

            redraw(map) {
                if (!map || !this.ready) {
                    return;
                }
                this.plumb = this._create_plumb();
                let self = this;
                this.$nextTick(() => {
                    self.plumb.batch(() => {
                        self._do_draw();
                    });
                });
            },
            on_open_dev: async function(dev_id) {
                let tree = await db.get('config', 'tree');
                let dev = tman.findItem(tree.value, dev_id)
                this.$store.commit('Editor/open', dev);
            },
            on_drageddev(dev) {
                let el = document.getElementById(dev.id);
                if(dev.pos.left === el.offsetLeft && dev.pos.top === el.offsetTop) {
                    return;
                }
                dev.pos.left = el.offsetLeft;
                dev.pos.top = el.offsetTop;
                this.$emit('changed');
            },
            on_dragedbus(bus, pos) {
                bus.pos.left = pos.left;
                bus.pos.top = pos.top;
                this.$emit('changed');
            },
            on_dragedcanvas() {
                let el = document.getElementById('__CONTAINER');
                if(this.canv_pos.left === el.offsetLeft && this.canv_pos.top === el.offsetTop) {
                    return;
                }
                this.canv_pos = {
                    left: el.offsetLeft,
                    top: el.offsetTop
                }
                this.$emit('moved', this.canv_pos);
            },
            on_remove_bus(bus) {
                let links = this.map.linksOfbus(bus.id);
                links.forEach(l=>{
                    this.plumb.makeSource(`${l.dc.dev.id}.${l.dc.conn.id}`, this.comm_item);
                });
                this.plumb.remove(bus.id);
                this.map.removeBus(bus.id);
                this.$emit('changed');
            },
            on_items_resize(d, count) {
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
                this.$emit('changed');
            },
            do_zoom(scale) {
                let transformOrigin = [0.5, 0.5];
                let el = this.plumb.getContainer();
                let p = ["webkit"],
                    s = "scale(" + scale + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (let i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }
                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;
                this.plumb.setZoom(scale);
            },
        }
    }
</script>