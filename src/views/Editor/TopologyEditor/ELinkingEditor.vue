<template>
    <v-card color="grey darken-2" width="100%" height="100%">
        <v-card :width="cfg_default.DEFAULT_WIDTH" :max-height="cfg_default.MAX_HEIGHT"
            v-for="dev in devs" :key="dev.id" :id="dev.id" :style="{position: 'absolute', left: `${dev.pos.left}px`, top: `${dev.pos.top}px`}">
            <v-card-title  class="white--text orange darken-4 jtk-drag-select py-1">
                {{dev.name}}
                <v-spacer></v-spacer>
                <v-btn class="text--primary" icon small>
                    <v-icon small>mdi-pencil</v-icon>
                </v-btn>
            </v-card-title>
            <span> {{JSON.stringify(dev)}}</span>
            <!-- <v-virtual-scroll :items="dev.conns" :item-height="50" height="300">
                <template v-slot="{ item }">
                    <v-list-item :id="item.id">
                        <v-list-item-avatar>
                            <v-avatar :color="item.color" size="56" class="white--text">
                                {{ item.kind }}
                            </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-virtual-scroll> -->
        </v-card>
       
    </v-card>

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
    import {jsPlumb} from 'jsplumb';
    import topo_map from '../../../utility/topo_map';
    export default {
        props: ['map'],
        mounted: function() {
            let self = this;
            jsPlumb.ready(() => {self._refresh();});
        },
        data: () => {
            return {
                cfg_default: topo_map.cfg_default,
            }
        },
        computed: {
            devs () {
                return this.map ? this.map.devs : [];
            },
            buses () {
                return this.map ? this.map.links.filter(l => l.is_bus) : [];
            },
        },
        methods: {
            _refresh() {
                // this.devs.forEach(d => {
                //     jsPlumb.draggable(d.id);
                // })
            },
            _refresh1() {
                jsPlumb.draggable("dev1");
                jsPlumb.draggable("dev2");
                // jsPlumb.importDefaults({
                //     Anchors : [ "Left", "BottomRight" ]
                // });
                // jsPlumb.makeSource("item1", {
                //     anchor:"Continuous",
                //     endpoint:["Rectangle", { width:40, height:20 }],
                //     maxConnections:3
                // });    
                // jsPlumb.makeTarget("itema", {
                //     anchor:"Continuous",
                //     endpoint:["Rectangle", { width:40, height:20 }],
                //     maxConnections:3
                // });    
                // let endpointOptions1 = { isSource:true };
                // jsPlumb.addEndpoint('item1', endpointOptions1);
                // jsPlumb.addEndpoint('item2', endpointOptions1);
                // let endpointOptions2 = { isTarget:true };
                // jsPlumb.addEndpoint('itema', endpointOptions2);
                // jsPlumb.addEndpoint('itemb', endpointOptions2);
                console.log('test')
                jsPlumb.connect({ 
                    source:"dev1", 
                    target:"dev2", 
                    endpoint: 'Dot'
                });
                jsPlumb.connect({ 
                    source:"item1", 
                    target:"itema", 
                    endpoint: 'Dot'
                });
            }
        }
    }
</script>