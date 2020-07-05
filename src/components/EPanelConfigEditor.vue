<template>
    <v-card class="ma-0 pa-1" flat>
        <v-text-field label="子面板标题" dense v-model="weds.title" hide-details class="py-0 px-3 mt-0 mb-4" @change="on_change">
        </v-text-field>
        <v-menu v-if="weds.items.length===0">
            <template v-slot:activator="{ on }">
                <v-btn depressed small color="grey darken-3" class="my-0 mx-1" v-on="on">
                    添加
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item dense v-for="mitem in new_types" :key="mitem.value" @click="on_new(mitem.value)">
                    <v-list-item-title>{{ mitem.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <e-config-editor class="pa-3 my-2" v-for="(item, idx) in weds.items" :key="idx" :data="item.config" :title="idx"
            :widgets="config_editor[item.type]" @change="on_change" :is_first="idx===0" :is_last="idx===weds.items.length-1"
            :items_default="items_default[item.type]">
        </e-config-editor>
    </v-card>
</template>
<script>
    import EConfigSheet from './widgets/EConfigSheet';
    import cfg from '../helper/cfg_panel';

    export default {
        props: ['weds'],
        components: {
            'e-config-editor': EConfigSheet,
        },
        computed: {
            new_types: function () {
                return cfg.new_types;
            },
            items_default: function() {
                return cfg.items_default;
            },
            config_editor: function() {
                return cfg.config_editor;
            }

        },
        methods: {
            on_change: function () {
                this.$emit('change');
            },
        }
    }
</script>