<template>
    <v-dialog :value="dialog" max-width="600px" persistent scrollable overlay-color="grey darken-2" internal-activator>
        <v-card class="pa-2">
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 360px;">
                <v-radio-group v-model="selected">
                    <v-row>
                        <v-col v-for="item in items" :key="item.value" cols="6">
                            <v-radio :label="`${item.value} (${item.text})`" :value="item.value">
                            </v-radio>
                        </v-col>
                    </v-row>
                </v-radio-group>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="cancel">
                    取消
                </v-btn>
                <v-btn text @click="ok" :disabled="!selected">
                    确定
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        props: ['dialog', 'title', 'items'],

        data: () => ({
            selected: null,
        }),

        methods: {
            cancel: function () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            ok: function () {
                if (!this.selected) {
                    return;
                }
                this.$emit("result", {
                    result: 'ok',
                    selected: this.selected
                });
            }
        }
    }
</script>