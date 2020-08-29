<template>
    <v-dialog :value="dialog" max-width="360" persistent hide-overlay>
        <v-card color="grey darken-3">
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-card-text class="px-6">{{text}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'text'],

        methods: {
            cancel: function () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok: function () {
                this.$emit("result", {
                    result: 'ok'
                });
            }
        }
    }
</script>