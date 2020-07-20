<template>
    <v-dialog :value="dialog" max-width="560" persistent>
        <v-card>
            <v-card-title class="font-weight-bold">{{title}}</v-card-title>
            <v-card-text class="font-weight-bold ma-3" >{{text}}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="onYes" color="blue font-weight-bold">
                    是
                </v-btn>
                <v-btn text @click="onNo" color="blue font-weight-bold">
                    否
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'text', 'option'],

        methods: {
            onYes: function () {
                this.$emit("closed", {
                    result: true
                });
            },
            onNo: function () {
                this.$emit("closed", {
                    result: false
                });
            }
        }
    }
</script>