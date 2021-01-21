<template>
    <v-sheet class="d-flex flex-column" color="grey">
        <v-card-text class="ml-2 body-2 py-3">{{title}}</v-card-text>
        <v-divider />
        <div style="min-height: 100px; width: 100%">
            <v-row v-if="item && schema" class="ma-3">
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
            'e-combobox-widget': () => import( /* webpackChunkName: "ecomboboxwidget" */ './widgets/EComboboxWidget'),
            'e-select-widget': () => import( /* webpackChunkName: "eselectwidget" */ './widgets/ESelectWidget'),
            'e-checkbox-widget': () => import( /* webpackChunkName: "echeckboxwidget" */ './widgets/ECheckboxWidget'),
        },
        methods: {
            on_changed: function(k, v) {
                this.item[k] = v;
                this.$emit('changed', this.item);
            }
        }
    }
</script>