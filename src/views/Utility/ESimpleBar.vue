<template>
    <div style="diplay: flex" class="pr-4">
        <v-tooltip bottom v-for="(item, idx) in items" :key="idx" bottomopen-delay="300">
            <template v-slot:activator="{ on }">
                <v-menu v-if="item.children" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn icon small class="mx-1" v-on="on" >
                            <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-item v-for="(it, idx) in item.children" :key="idx" @click.stop>
                            <v-list-item-icon class="mx-1"><v-icon small>{{ it.icon }}</v-icon></v-list-item-icon>
                            <v-list-item-title>{{ it.text }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn v-else icon small class="mx-1" v-on="on" @click.stop="on_action(item)">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.tip}}</span>
        </v-tooltip>
    </div>
</template>

<script>
    export default {
        props: ['items'],
        methods: {
            on_action: function (ac) {
                this.$emit('action', ac)
            }
        }
    }
</script>