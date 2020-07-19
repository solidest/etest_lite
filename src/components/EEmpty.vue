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
    import ipc from '../feature/ipc_render';

    export default {
        props: ['tip'],
            created: function () {
                if(this.$route.query.autoopen || this.$route.query.proj_id) {
                    let self = this;
                    let pid = this.$route.query.proj_id;
                    ipc.list_proj().then((res) => {
                        if(res && res.length > 0) {
                            let p = pid ? (res.find(it=>it.id===pid)):res[0]
                            self.$store.commit('setProj' , p);
                        } else {
                            self.$router.push({name: 'ListProj'});
                        }
                    });
                }
            },
    }
</script>