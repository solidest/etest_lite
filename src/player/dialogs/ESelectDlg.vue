<template>
    <v-dialog :value="dialog" max-width="560" persistent>
        <v-card>
            <v-card-title class="font-weight-bold">{{title}}</v-card-title>
            <v-card-text class="font-weight-bold">
                {{text}}
                <v-radio-group v-model="selected" :mandatory="false">
                    <v-radio v-for="it in items" :key="it" :label="it" :value="it"></v-radio>
                </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="ok" color="blue font-weight-bold" :disabled="!selected">
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

        data: () => {
            return {
                selected: null,
            }
        },

        mounted: function() {
            this.selected = this.value || this.items[0];
        },

        watch: {
            dialog: function(v) {
                if(v) {
                    this.selected = this.value || this.items[0];
                }
            }
        },

        methods: {
            ok: function () {
                this.$emit("closed", {
                    result: this.selected,
                });
            }
        }
    }
</script>