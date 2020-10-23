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
    import main_db from '../doc/maindb';
    import proj_db from '../doc/workerdb';
    import cfg from './config';

    export default {
        props: ['tip'],
        created: function () {
            if(this.$route.query.autoopen || this.$route.query.proj_id) {
                let self = this;
                let pid = this.$route.query.proj_id;
                main_db.open().then(() => {
                    let res = main_db.list();
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
                this.$store.commit('setProj', proj);
                this.$store.commit('Editor/reset');
                if(!proj) {
                    return;
                }
                await proj_db.open(proj.id, cfg.proj_colls);
                this.$router.push({
                    name: 'SrcTree'
                });
            },
        }
    }
</script>