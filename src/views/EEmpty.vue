<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-row align="center" justify="center">
            <div>
                <v-row class="mb-6" justify="center">
                    <img alt="ETestDev" src="../assets/logo.svg" style="display: block;">
                </v-row>
            </div>
        </v-row>
    </v-container>
</template>

<script>
    /**
     *  空组件
     */
    import api from '../api/client';
    import proj_db from '../doc/workerdb';
    import cfg from './config';
    import ver from '../doc/version';

    export default {
        props: ['tip'],
        created: function () {
            if(this.$route.query.autoopen || this.$route.query.proj_id) {
                let self = this;
                let pid = this.$route.query.proj_id;
                api.projdb_list().then((res) => {
                    if(res && res.length > 0) {
                        let p = pid ? (res.find(it=>it.id===pid)):res[0]
                        self.open_proj(p);
                    } else {
                        self.$router.push({name: 'ListProj'});
                    }
                })

            }
        },
        methods: {
            open_proj: async function (proj) {
                if(!proj) {
                    return;
                }
                await proj_db.open(proj.id, cfg.proj_colls);
                let res = await ver.check_proj();
                if (res !== 'ok') {
                    this.$store.commit('setMsgError', res);
                    return;
                }
                this.$store.commit('setProj', proj);
                this.$router.push({
                    name: 'SrcTree'
                });
            },
        }
    }
</script>