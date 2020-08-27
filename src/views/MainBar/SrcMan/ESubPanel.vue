<template>
    <v-expansion-panel aria-expanded>
        <v-expansion-panel-header color="grey darken-3" class="py-0" >
            <template v-slot:default="{open}">
                <v-list-item class="pa-0">
                    <v-list-item-icon>
                        <v-icon>{{ctx.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ctx.title}}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action v-if="open">
                        <e-simple-bar :items="ctx.simplebar||[]" @action="on_action" />
                    </v-list-item-action>
                </v-list-item>
            </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="grey darken-3">
            <v-sheet class="pa-0 ma-0" color="grey darken-3" >
                <e-subpanel-list v-if="ctx.widget==='list'" :catalog="ctx.catalog" :icon="ctx.icon" :ctx_menus="ctx.ctx_menus">
                </e-subpanel-list>
            </v-sheet>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import ESimpleBar from '../../Utility/ESimpleBar';
    import ESubPanelList from './ESubPanelList';
    export default {
        props: ['ctx'],
        components: {
            'e-simple-bar': ESimpleBar,
            'e-subpanel-list': ESubPanelList,
        },
        methods: {
            on_action: function(ac) {
                if(!ac) {
                    return;
                }
                if(ac.to_parent) {
                    return this.$emit('action', ac, this.ctx);
                } else {
                    console.log('TODO')
                }
            }
        }
    }
</script>