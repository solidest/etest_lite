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
            <v-menu v-if="kind==='widgets'">
                <template v-slot:activator="{ on }">
                    <v-btn depressed x-small class="my-0 mx-1 pa-0" v-on="on" color="grey darken-3">
                        添加
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item dense v-for="mitem in new_types" :key="mitem.value" @click="on_action('new_item', mitem.value)">
                        <v-list-item-title>{{ mitem.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn v-else depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3" @click="on_action('new_item', type)">
                添加
            </v-btn>
            <v-btn v-if="!is_last" depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3" @click="on_action('move_down')">下移</v-btn>
            <v-btn v-if="!is_first" depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3" @click="on_action('move_up')">上移</v-btn>
            <v-btn depressed x-small class="my-0 mx-1 pa-0" color="grey darken-3" @click="on_action('del_item')">删除</v-btn>
            <v-spacer />
            <e-option-dlg v-if="option_code" :option_code="option_code" xsmall_btn_icon="mdi-cog-outline"
                class="pa-0 ma-0" @save="on_save">
            </e-option-dlg>
        </v-row>
    </v-sheet>
</template>
<script>
    import cfg from '../../helper/cfg_panel';
    import EOptionEditor from './EEditorOptionDlg';
    import yaml from 'js-yaml';

    export default {
        props: ['idx', 'type', 'data', 'widgets', 'kind', 'is_last', 'is_first', ],
        components: {
            'e-option-dlg': EOptionEditor,
        },
        computed: {
            new_types: function () {
                return cfg.new_types.filter(it => it.kind === this.kind);
            },
            items_default: function () {
                return cfg.items_default;
            },
            option_code: function () {
                return this.data.option_code;
            }
        },
        methods: {
            on_change: function () {
                this.$emit('change', 'config');

            },
            on_action: function (ac, opt) {
                this.$emit('action', this.idx, ac, opt);
            },
            on_save: function (script) {
                this.data.option_code = script;
                try {
                    this.data.items = yaml.safeLoad(script, 'utf8');
                } catch (error) {
                    this.$store.commit('setMsgError', error.message);
                }
                this.$emit('change', 'script changed');
            }
        }
    }
</script>