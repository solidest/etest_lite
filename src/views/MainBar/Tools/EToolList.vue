<template>
    <v-list shaped dense>
        <v-list-item-group color="primary" v-model="selected" @change="on_change">
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
    import cfg from './config';
    export default {
        data: () => {
            return {
                items: cfg.items,
                selected: -1,
            }
        },

        methods: {
            on_change: function(e) {
                let it = this.items[e];
                if(it && it.route) {
                    this.$emit("close");
                    this.$router.push({name: it.route});
                }
            }
        }
    }
</script>