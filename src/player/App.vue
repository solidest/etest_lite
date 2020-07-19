<template>
  <v-app>
    <e-sys-bar header="ETestPlayer" :stop_run="true" />
    <v-snackbar top :timeout="touts" :color="tip_color" v-model="tip">
      {{ tip_msg }}
      <template v-slot:action="{ attrs }">
        <v-btn icon small @click="tip=false" v-bind="attrs">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
</style>
<script>
  import ESysBar from '../components/ESysBar';
  export default {
    name: 'App',
    components: {
      'e-sys-bar': ESysBar,
    },
    created: function () {
      let wid = this.$route.query.winid;
      this.$store.commit('setWinId', wid);
    },

    computed: {
      play_ids: function(){
        return this.$store.state.play_ids;
      },
      tip: {
        get: function () {
          return this.$store.state.last_tip.tip;
        },
        set: function (newValue) {
          if (!newValue) this.$store.commit('clearMsg');
        }
      },
      tip_msg: function () {
        return this.$store.state.last_tip.tip_msg;
      },
      tip_color: function () {
        let c = this.$store.state.last_tip.tip_type;
        if (c === 'info') {
          return 'grey darken-1';
        } else {
          return c;
        }
      },
      touts: function () {
        let t = this.tip_color;
        if (t === 'error') {
          return 4000;
        } else {
          return 2000;
        }
      },
    },

    watch: {
      play_ids: function() {
        if(this.$route.name !== 'Home') {
          this.$router.push({name: 'Home'})
        }
        let self = this;
        setTimeout(() =>{
          if(self.$store.state.panel) {
            self.$router.push({name: 'Panel'})
          } else {
            self.$router.push({name: 'Outs'})
          }
        }, 100);
      }
    }
  };
</script>