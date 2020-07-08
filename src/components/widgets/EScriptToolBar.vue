<template>
    <v-toolbar dense>
        <v-icon color="grey lighten-1" class="ml-3 mr-2">{{icon}}</v-icon>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-for="(item, idx) in items" :key="idx" open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-divider v-if="!item.value" vertical class="mx-2" inset> </v-divider>
                <v-edit-dialog v-else-if="item.widgets" large save-text="确定" cancel-text="取消"
                     @open="onOpen" @save="emit(item, option_data)">
                    <v-btn icon small v-on="on" class="mx-1">
                        <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                    </v-btn>
                    <template v-slot:input>
                        <e-config-sheet width="600" :data="option_data" :widgets="item.widgets" :title="item.text" :hide_name="true">
                        </e-config-sheet>
                    </template>
                </v-edit-dialog>
                <v-btn v-else icon small v-on="on" class="mx-1" @click="emit(item)" :disabled="disabled(item)">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>
    import EConfigSheed from './EEditorSheet';

    export default {
        props: ['title', 'items', 'icon', 'editor', 'option'],
        components: {
            'e-config-sheet': EConfigSheed,
        },
        data: () => {
            return {
                option_data: {},
            }
        },

        methods: {
            emit: function (item, value) {
                let fn = this.editor[item.value];
                if(fn) {
                    fn();
                    return;
                }
                this.$emit('action', item.value, value);
            },
            disabled: function (item) {
                let fn = this.editor['disabled_' + item.value];
                if(fn) {
                    return fn();
                }
            },
            onOpen: function() {
                this.option_data = JSON.parse(JSON.stringify(this.option));
            },
        }
    }
</script>