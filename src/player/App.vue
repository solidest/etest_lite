<template>
  <v-app>
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


  export default {
    name: 'App',

    computed: {
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
          return 100000;
        } else {
          return 10000;
        }
      },
    },
  };
</script>