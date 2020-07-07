<template>
    <v-toolbar dense>
        <v-icon color="grey lighten-1" class="ml-3 mr-2">{{icon}}</v-icon>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-for="(item, idx) in items" :key="idx" open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-divider v-if="!item.value" vertical class="mx-2" inset> </v-divider>
                <v-btn v-else-if="item.value.startsWith('d_')" icon small v-on="on" class="mx-1" @click="emit(item)" >
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
                <v-btn v-else icon small v-on="on" class="mx-1" @click="emit(item)" :disabled="disabled(item)">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>

    export default {
        props: ['title', 'items', 'icon', 'editor'],

        methods: {
            emit: function (item) {
                let fn = this.editor[item.value];
                if(fn) {
                    fn();
                    return;
                }
                this.$emit('action', item.value);
            },
            disabled: function (item) {
                let fn = this.editor['disabled_' + item.value];
                if(fn) {
                    return fn();
                }
            }
        }
    }
</script>