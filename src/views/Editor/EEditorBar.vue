<template>
    <v-toolbar dense color="grey darken-4" height="40">
        <v-tooltip bottom v-for="item in items_left" :key="item.id" open-delay="300">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" class="mx-1" @click="emit(item)"
                    :disabled="state_disbar[item.value]" >
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-for="item in items_right" :key="item.id" open-delay="300">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" class="mx-1" @click="emit(item)"
                    :disabled="state_disbar[item.value]" >
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>
    export default {
        props: ['items_left', 'items_right'],
        computed: {
            state_disbar: function() {
                return this.$store.state.Editor.state_disbar;
            }
        },
        methods: {
            emit: function (item) {
                this.$emit('action', item.value);
            },
        }
    }
</script>