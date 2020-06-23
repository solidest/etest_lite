<template>
    <v-toolbar dense>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip v-for="(item, idx) in items" :key="idx" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit(item)" class="mx-1" :disabled="item.disabled">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'items'],
        methods: {
            emit: function (item) {
                this.$emit('click_item', item.value);
            }
        }
    }
</script>