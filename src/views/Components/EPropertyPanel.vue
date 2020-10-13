<template>
    <v-sheet class="d-flex flex-column" color="grey darken-3">
        <v-card-text class="ml-2 h6 py-3 grey--text text--lighten-1">{{title}}</v-card-text>
        <v-divider />
        <div style="min-height: 100px; width: 100%">
            <v-row v-if="item && schema" class="pa-4">
                <v-col v-for="(cfg, idx) in schema" :key="idx" :cols="cfg.cols||12">
                    <component v-bind:is="`e-${cfg.type}-widget`" :config="cfg" :model="item" @changed="on_changed"></component>
                </v-col>
            </v-row>
        </div>
    </v-sheet>
</template>

<script>
    export default {
        props: ['title', 'item', 'schema'],
        components: {
            'e-text-widget': () => import( /* webpackChunkName: "etextwidget" */ './widgets/ETextWidget'),
            'e-number-widget': () => import( /* webpackChunkName: "enumberwidget" */ './widgets/ENumberWidget'),
        },
        methods: {
            on_changed: function(k, v) {
                this.item[k] = v;
                this.$emit('changed', this.item);
            }
        }
    }
</script>