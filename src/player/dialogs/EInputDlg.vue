<template>
    <v-dialog :value="dialog" max-width="560" persistent>
        <v-card>
            <v-card-title class="font-weight-bold">{{title}}</v-card-title>
            <v-card-text class="font-weight-bold ma-3" >{{text}}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="ok" color="blue font-weight-bold">
                    确定
                </v-btn>
                <!-- <v-btn text @click="stop" color="blue font-weight-bold">
                    停止检测
                </v-btn> -->
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'text'],

        methods: {
            ok: function () {
                this.$emit("closed", {
                    result: 'ok'
                });
            },
            // stop: function() {
            //     this.$emit("closed", {
            //         result: 'stop'
            //     });
            // }
        }
    }
</script>