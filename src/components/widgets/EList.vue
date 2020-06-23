<template>
    <v-list shaped dense max-height="300px">
        <v-list-item-group color="primary">
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
    export default {
        props: ['items'],
        methods: {
            action: function(a) {
                console.log(a);
            }
        }
        
    }
</script>