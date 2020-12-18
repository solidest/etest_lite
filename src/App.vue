<template>
  <v-app>
    <e-sys-bar v-if="win_mode!=='fullscreen'" header="ETestDev" />
    <v-snackbar top :timeout="touts" :color="tip_color" v-model="tip">
      {{ tip_msg }}
      <template v-slot:action="{ attrs }">
        <v-btn icon small @click="tip=false" v-bind="attrs">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <e-mainbar> </e-mainbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
  /* * {
    -webkit-transition: none !important;
  } */
</style>
<script>
  import ESysBar from './views/Components/ESysBar';
  import EMainBar from './views/MainBar/ETopBar';

  export default {
    name: 'App',

    components: {
      'e-sys-bar': ESysBar,
      'e-mainbar': EMainBar,
    },

    computed: {
      win_mode: function() {
        return this.$store.state.win_mode; 
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
          return 5000;
        } else {
          return 1500;
        }
      },
      editor_route: function () {
        let ed = this.$store.state.edit_doc;
        if (!ed) {
          return null;
        }
        let res = {
          id: ed.doc.id,
          kind: ed.kind
        }
        switch (ed.kind) {
          case 'device':
            res.route_name = 'Device';
            break;
          case 'topology':
            res.route_name = 'Topology';
            break;
          case 'protocol':
            res.route_name = 'Protocol';
            break;
          case 'panel':
            res.route_name = 'Panel';
            break;
          case 'lua':
            res.route_name = 'Lua';
            break;
          case 'tcg':
            res.route_name = 'Tcg';
            break;
          case 'project':
            res.route_name = ed.doc.value;
            break;
          case 'tools':
            res.route_name = ed.doc.value;
            break;

          default:
            console.log('TODO editor:', ed.kind);
            return null;
        }
        return res;
      }
    },

    watch: {
      editor_route: function (vn, vo) {
        if (!vn || !this.$store.state.proj) {
          this.$router.push({
            name: 'Home'
          });
          return;
        }
        if (this.$route.name === vn.route_name) {
          if (vn.id === vo.id) {
            return;
          }
          this.$router.push({
            name: 'Home'
          });
        }
        let self = this;
        this.$nextTick(() => {
          self.$router.push({
            name: vn.route_name,
            params: {
              doc_id: vn.id,
              kind: vn.kind
            }
          });
        })
      }
    },

  };
</script>