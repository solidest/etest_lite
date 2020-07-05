<template>
    <v-sheet shaped class="ma-0 pa-0" color="grey darken-3">
        <v-row class="ma-0 pa-0">
            <v-col v-for="(wed, idx) in widgets" :key="idx" :cols="wed.cols" class="pa-1">
                <v-text-field v-if="wed.type==='number'||wed.type==='text' &&(!wed.visual || wed.visual(data))"
                    :label="wed.label" v-model="data[wed.name]" :disabled="wed.disabled && wed.disabled(data)"
                    class="ma-1" dense hide-details :type="wed.type" @change="on_change">
                </v-text-field>
                <v-select v-else-if="wed.type==='select'" :label="wed.label" v-model="data[wed.name]" :items="wed.items"
                    class="ma-1" dense hide-details filled :menu-props="{ maxHeight: 700}" @change="on_change">
                </v-select>
                <v-combobox v-else-if="wed.type==='combobox'" :label="wed.label" v-model="data[wed.name]"
                    :items="wed.items" class="ma-1" dense hide-details filled :menu-props="{ maxHeight: 700}"
                    @change="on_change"></v-combobox>
                <v-checkbox v-else-if="wed.type==='checkbox'" :label="wed.label" v-model="data[wed.name]" class="ma-1"
                    dense hide-details @change="on_change">
                </v-checkbox>
            </v-col>
        </v-row>
        <v-row class="ma-0 pa-0">
            <v-btn depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3">删除</v-btn>
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn depressed x-small class="my-0 mx-1 pa-0" v-on="on" color="grey darken-3">
                        添加
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item dense v-for="mitem in new_types" :key="mitem.value" @click="on_new(mitem.value)">
                        <v-list-item-title>{{ mitem.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn v-if="!is_last" depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3">下移</v-btn>
            <v-btn v-if="!is_first" depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3">上移</v-btn>
            <v-btn v-if="items_default" depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3">选项</v-btn>
        </v-row>
    </v-sheet>
</template>
<script>
    import cfg from '../../helper/cfg_panel';
    export default {
        props: ['data', 'widgets', 'title', 'is_last', 'is_first', 'items_default'],
        computed: {
            new_types: function() {
                return cfg.new_types;
            },
        },
        methods: {
            on_change: function () {
                this.$emit('change');
            },
            on_new: function(type) {
                this.$emit('new_item', type);
            }
        }
    }
</script>