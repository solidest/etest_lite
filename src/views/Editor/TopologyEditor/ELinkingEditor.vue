<template>
    <v-card color="grey darken-2" width="100%" height="100%">
        <v-card width="300" max-height="600" id="dev1" style="position: absolute; left: 500px">
            <v-card-title class="white--text orange darken-4 jtk-drag-select" id="t1">
                User Directory
                <v-spacer></v-spacer>
                <v-btn color="white" class="text--primary" fab small>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi nobis a at voluptates culpa optio amet!
                Inventore deserunt voluptatem maxime a veniam placeat, eos impedit nulla quos? Officiis, aperiam
                ducimus.
            </v-card-text>
            <v-divider></v-divider>
            <v-virtual-scroll :items="items1" :item-height="50" height="300">
                <template v-slot="{ item }">
                    <v-list-item :id="item.id">
                        <v-list-item-avatar>
                            <div :id="item.id"  class="jtk-drag-select">
                            <v-avatar :color="item.color" size="56" class="white--text">
                                {{ item.initials }}
                            </v-avatar>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.fullName }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn depressed small>
                                View User
                                <v-icon color="orange darken-4" right>
                                    mdi-open-in-new
                                </v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-virtual-scroll>
        </v-card>
        <v-card width="300"  height="600"  id="dev2" style="position: absolute">
            <v-card-title class="white--text orange darken-4 jtk-drag-select" it="t2">
                User Directory
                <v-spacer></v-spacer>
                <v-btn color="white" class="text--primary" fab small>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pt-4">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi nobis a at voluptates culpa optio amet!
                Inventore deserunt voluptatem maxime a veniam placeat, eos impedit nulla quos? Officiis, aperiam
                ducimus.
            </v-card-text>
            <v-divider></v-divider>
            <v-virtual-scroll :items="items2" :item-height="50" height="300">
                <template v-slot="{ item }">
                    <v-list-item>
                        <v-list-item-avatar>
                            <div :id="item.id"  class="jtk-drag-select">
                            <v-avatar :color="item.color" size="56" class="white--text" >
                                {{ item.initials }}
                            </v-avatar>
                            </div>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.fullName }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn depressed small>
                                View User
                                <v-icon color="orange darken-4" right>
                                    mdi-open-in-new
                                </v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-virtual-scroll>
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
    export default {
        mounted: function() {
            let self = this;
            jsPlumb.ready(() => {self._refresh();});
        },
        data: () => {
            return {
                items1: [ {id: 'item1',color: 'grey',  fullName: 'name', initials: `initial`},{id: 'item2', color: 'red',  fullName: 'name', initials: `initial`},],
                items2: [ {id: 'itema',color: 'grey',  fullName: 'name', initials: `initial`},{id: 'itemb', color: 'red',  fullName: 'name', initials: `initial`},],
                lock: false,
            }
        },
        methods: {
            _refresh() {
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