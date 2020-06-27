<template>
  <v-app>
    <e-sys-bar />
    <v-snackbar top :timeout="touts" :color="tip_color" v-model="tip">
      {{ tip_msg }}
      <template v-slot:action="{ attrs }">
        <v-btn icon small @click="tip=false" v-bind="attrs">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <e-toolbar> </e-toolbar>
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
  import ESysBar from './components/ESysBar';
  import EToolBar from './components/ETopBar';

  export default {
    name: 'App',

    components: {
      'e-sys-bar': ESysBar,
      'e-toolbar': EToolBar,
    },

    created: function() {
      this.$store.commit('setWinId', this.$route.query.winid);
    },

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
      editor_route: function() {
        let ed = this.$store.state.edit_doc;
        if(!ed){
          return null;
        }
        let res = { id: ed.doc.id, kind: ed.kind }
        switch (ed.kind) {
          case 'device':
            res.route_name = 'Device';
            break;
          case 'topology':
            res.route_name = 'Topology';
            break;
          default:
            console.log('editor route', ed);
            return null;
        }
        return res;
      }
    },

    watch: {
      editor_route: function(vn, vo) {
        if(!vn || !this.$store.state.proj) {
          this.$router.push({name: 'Home'});
          return;
        }
        if(this.$route.name === vn.route_name) {
          if(vn.id === vo.id) {
            return;
          }
          this.$router.push({name: 'Home'});
        }
        let self = this;
        this.$nextTick(()=>{
          self.$router.push({name: vn.route_name, params: {doc_id: vn.id, kind: vn.kind}});
        })
      }
    },

  };
</script>