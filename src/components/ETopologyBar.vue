<template>
    <v-toolbar dense>
        <v-icon color="grey lighten-1" class="ml-3 mr-2">{{icon}}</v-icon>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="step" borderless dense mandatory tile rounded>
            <v-tooltip bottom v-for="item in items" :key="item.value" open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" :value="item.value">
                        <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                    </v-btn>
                </template>
                <span>{{item.text}}</span>
            </v-tooltip>
        </v-btn-toggle>
    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'items', 'icon', 'value'],
        mounted: function () {
            if(this.value) {
                this.step = this.value;
                return;
            }
            if (this.items && this.items.length > 0) {
                this.step = this.items[0].value;
            }
        },
        data: () => {
            return {
                step: ''
            }
        },
        watch: {
            step: function (nv, ov) {
                if (nv && nv !== ov) {
                    this.$emit('step', nv);
                }
            },
            value: function(v) {
                if(v) {
                    this.step = v;
                }
            }
        }
    }
</script>