<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-row align="center" justify="center">
            <v-card width="500">
                <v-card-title class="headline">新建项目</v-card-title>
                <v-text-field @keydown.enter="ok" class="px-6" v-model="input_text" autofocus
                    placeholder="输入项目名称"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="cancel">
                        取消
                    </v-btn>
                    <v-btn text @click="ok" :disabled="!input_text">
                        创建
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
    import helper from '../feature/r_helper';
    import ipc from '../feature/r_ipc';
    export default {
        props: ['tip'],

        data: () => ({
            input_text: ''
        }),

        methods: {
            ok: async function () {
                let res = await helper.check_proj_newname(this.input_text);
                if(res !== 'ok') {
                    this.$store.commit('setMsgError', res);
                } else {
                    let t = Date.now();
                    let doc = {id: helper.new_id(), name: this.input_text.trim(), created: t, updated: t };
                    await ipc.insert_proj(doc);
                    this.$store.commit('setProj', doc);
                    this.$router.push({ name: 'Empty'});
                }
            },
            cancel: async function() {
                this.$router.push({ name: 'Empty'});
            }
        }
    }
</script>