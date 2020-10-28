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
            <div :id="`l_${dev.id}`" class="d-flex flex-column"
                :style="{position:'relative', overflow:'auto', height: `${dev.pos.bottom-dev.pos.top}px`, }">
                <v-list-item :id="`${dev.id}.${item.id}`" v-for="item in dev.conns" :key="item.id"
                    style=" border-bottom: 1px solid grey">
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
            </div>
            <e-herizontal-bar :height="100" :min="100" :max="600" @resize="(e) => {on_resize(dev, e)}" />
        </v-sheet>
        <div id="circle_bus"
            style="position:relative; width: 160px; height: 160px; border-radius: 80px; left: 200px; top: 100px; background-color: #BDBDBD;" />
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
    } from 'jsplumb';
    import topo_map from '../../../utility/topo_map';
    import cfg from './config_map';
    import EHerizontalBar from '../../Components/EHorizontalBar';

    export default {
        props: ['map'],
        components: {
            'e-herizontal-bar': EHerizontalBar,
        },
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
                    this.plumb.addList(document.getElementById(`l_${dev.id}`), {
                        anchor: ['TopRight', 'TopLeft', 'BottomLeft', 'BottomRight'],
                        endpoint: "Blank",
                    });
                    for (const conn of dev.conns) {
                        let id = `${dev.id}.${conn.id}`;
                        if (document.getElementById(id)) {
                            this.plumb.makeTarget(id, {
                                anchor: ['Left', 'Right'],
                                isTarget:true,
                                isSource:true, 
                                createEndpoint:false,
                                allowLoopback:false,
                                maxConnections:1,
                            }, this.conn_ends_tyle);
                            this.plumb.makeSource(id, {
                                anchor: ['Left', 'Right'],
                                isTarget:true, 
                                isSource:true, 
                                createEndpoint:false,
                                allowLoopback:false,
                                maxConnections:1,
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
                // setTimeout(() => {
                //     if (!self.plumb) {
                //         return;
                //     }
                //     self.do_zoom(0.75, self.plumb);
                //     console.log('ok')
                // }, 3000);
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
            on_resize(d, e) {
                d.pos.bottom = d.pos.top+e;
                if(!this.plumb) {
                    return;
                }
                let p = this.plumb;

               
                setTimeout(() =>{
                    p.removeList(document.getElementById(`l_${d.id}`));
                    p.addList(document.getElementById(`l_${d.id}`), {
                        anchor: ['TopRight', 'TopLeft', 'BottomLeft', 'BottomRight'],
                        endpoint: "Blank",
                    });
                }, 300);
                // p.batch(() => {
                //         p.revalidate(d.id);
                //         p.revalidate(`l_${d.id}`);
                //         d.conns.forEach(conn => {
                //             p.revalidate(`${d.id}.${conn.id}`)
                //         });
                //     });
                console.log('resize', e);
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