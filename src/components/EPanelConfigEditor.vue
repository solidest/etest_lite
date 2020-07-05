<template>
    <v-card class="ma-0 pa-1" flat>
        <v-text-field label="子面板标题" dense v-model="wids.title" hide-details class="py-0 px-3 mt-0 mb-4" @change="on_change">
        </v-text-field>
        <v-menu v-if="wids.items.length===0">
            <template v-slot:activator="{ on }">
                <v-btn depressed small color="grey darken-3" class="my-0 mx-1" v-on="on">
                    添加
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item dense v-for="mitem in new_types" :key="mitem.value" @click="new_item(-1, mitem.value)">
                    <v-list-item-title>{{ mitem.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <e-config-editor class="pa-3 my-2" v-for="(item, idx) in wids.items" :key="idx" :data="item.config" :idx="idx"
            :widgets="config_editor[item.type]" @change="on_change" :is_first="idx===0" :is_last="idx===wids.items.length-1"
            :type="item.type" @action="on_action" >
        </e-config-editor>
    </v-card>
</template>
<script>
    import EConfigSheet from './widgets/EConfigSheet';
    import cfg from '../helper/cfg_panel';
    import yaml from 'js-yaml';

    export default {
        props: ['wids'],
        components: {
            'e-config-editor': EConfigSheet,
        },
        computed: {
            new_types: function () {
                return cfg.new_types;
            },
            
            config_editor: function() {
                return cfg.config_editor;
            }

        },
        methods: {
            on_change: function () {
                this.$emit('change');
            },
            on_action: function(idx, ac, opt) {
                switch (ac) {
                    case 'del_item':
                        this.wids.items.splice(idx, 1);
                        break;
                    case 'move_down':{
                            let it = this.wids.items[idx];
                            this.wids.items.splice(idx, 1);
                            this.wids.items.splice(idx+1, 0, it);
                        }
                        break;
                    case 'move_up': {
                            let it = this.wids.items[idx];
                            this.wids.items.splice(idx, 1);
                            this.wids.items.splice(idx-1, 0, it);
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
            new_item: function(idx, type) {
                console.log(type)
                let it = {type: type, config: JSON.parse(JSON.stringify(cfg.default_item[type]))};
                if(cfg.items_default[type]) {
                    it.config.items = JSON.parse(JSON.stringify(cfg.items_default[type]));
                    it.config.option_code = yaml.safeDump(it.config.items, {
                        styles: {
                            '!!null': 'lowercase'
                        },
                    });
                }
                this.wids.items.splice(idx+1, 0, it);
            }
        }
    }
</script>