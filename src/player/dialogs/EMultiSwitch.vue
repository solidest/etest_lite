<template>
    <v-dialog :value="dialog" max-width="560" persistent>
        <v-card>
            <v-card-title class="font-weight-bold">{{title}}</v-card-title>
            <v-card-text class="font-weight-bold">
                {{text}}
                <v-sheet class="pa-5">
                    <v-switch v-for="(it, idx) in items" :key="idx" v-model="it.on" :label="it.name" :readonly="it.readonly" color="red" inset></v-switch>
                </v-sheet>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="ok" color="blue font-weight-bold">
                    确定
                </v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'text', 'items', 'value'],

        methods: {
            ok: function () {
                let res = [];
                for(let it of this.items) {
                    if(it.on) {
                        res.push(it.value);
                    }
                }
                this.$emit("closed", {
                    result: res,
                });
            }
        }
    }
</script>