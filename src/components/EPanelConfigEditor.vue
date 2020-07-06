<template>
    <v-card class="ma-0 pa-1" flat>
        <v-text-field label="子面板标题" dense v-model="widcharts.title" hide-details class="py-0 px-3 mt-0 mb-4" @change="on_change">
        </v-text-field>
        <v-menu v-if="widcharts.items.length===0">
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
        <e-config-editor class="pa-3 my-2" v-for="(item, idx) in widcharts.items" :key="idx" :data="item.config" :idx="idx"
            :widgets="config_editor[item.type]" :is_first="idx===0" :is_last="idx===widcharts.items.length-1"
            :type="item.type" :kind="widcharts.kind" @action="on_action" @change="on_change">
        </e-config-editor>
    </v-card>
</template>
<script>
    import EConfigSheet from './widgets/EConfigSheet';
    import cfg from '../helper/cfg_panel';
    import yaml from 'js-yaml';

    export default {
        props: ['widcharts'],
        components: {
            'e-config-editor': EConfigSheet,
        },
        computed: {
            new_types: function () {
                return cfg.new_types.filter(it => it.kind === this.widcharts.kind);
            },
            
            config_editor: function() {
                return cfg.config_editor;
            }

        },
        methods: {
            on_change: function () {
                this.$emit('change');
                if(this.widcharts.kind === 'charts') {
                    let self = this;
                    this.$nextTick(() => {
                        self.$emit('redraw');
                    })
                }
            },
            on_action: function(idx, ac, opt) {
                switch (ac) {
                    case 'del_item':
                        this.widcharts.items.splice(idx, 1);
                        break;
                    case 'move_down':{
                            let it = this.widcharts.items[idx];
                            this.widcharts.items.splice(idx, 1);
                            this.widcharts.items.splice(idx+1, 0, it);
                        }
                        break;
                    case 'move_up': {
                            let it = this.widcharts.items[idx];
                            this.widcharts.items.splice(idx, 1);
                            this.widcharts.items.splice(idx-1, 0, it);
                        }
                        break;
                    case 'new_item': 
                        this.new_item(idx, opt);
                        break;
                    default:
                        console.log('action', idx, ac, opt);
                        break;
                }
                this.on_change();
            },
            on_new: function(type) {
                this.new_item(-1, type, true);
                this.on_change();
                if(this.widcharts.kind === 'charts') {
                    let self = this;
                    this.$nextTick(() => {
                        self.$emit('redraw');
                    })
                }
            },
            new_item: function(idx, type, is_first) {
                let it = {type: type, config: JSON.parse(JSON.stringify(cfg.default_item[type]))};
                if(cfg.items_default[type]) {
                    let its = JSON.parse(JSON.stringify(cfg.items_default[type]));
                    if(!is_first && this.widcharts.kind === 'charts') {
                        its = {series: its.series};
                    }
                    it.config.items = its;
                    it.config.option_code = yaml.safeDump(it.config.items, {
                        styles: {
                            '!!null': 'lowercase'
                        },
                    });
                }
                this.widcharts.items.splice(idx+1, 0, it);
            }
        }
    }
</script>