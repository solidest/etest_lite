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
    <div v-if="ask">
      <e-confirm-dlg v-if="ask.kind==='ok'" @closed="onAnswer" :dialog="ask" :title="ask.value.title" :text="ask.value.msg" />
      <e-yesno-dlg v-else-if="ask.kind==='yesno'" @closed="onAnswer" :dialog="ask" :title="ask.title" :text="ask.msg" :option="ask" />
      <e-input-dlg v-else-if="ask.kind==='text'" @closed="onAnswer" :dialog="ask" :tip="ask.msg" :value="ask.default" :persistent="true" />
      <e-select-dlg v-else-if="ask.kind==='select'" @closed="onAnswer" :dialog="ask" :title="ask.title" :text="ask.msg" :value="ask.default" :items="ask.items" />
      <e-number-dlg v-else-if="ask.kind==='number'" @closed="onAnswer" :dialog="ask" :title="ask.title" :text="ask.msg" :value="ask.default" :min="ask.min" :max="ask.max" :fixed="ask.fixed" :option="ask.option||{}" />
      <e-multiswitch-dlg v-else-if="ask.kind==='multiswitch'" @closed="onAnswer" :dialog="ask" :title="ask.title" :text="ask.msg" :items="ask.items" />
    </div>
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
      'e-confirm-dlg': () => import( /* webpackChunkName: "econfirmdlg" */ './dialogs/EConfirmDlg'),
      'e-yesno-dlg': () => import( /* webpackChunkName: "eyesnodlg" */ './dialogs/EYesNoDlg'),
      'e-input-dlg': () => import( /* webpackChunkName: "einputdlg" */ './dialogs/EInputDlg'),
      'e-select-dlg': () => import( /* webpackChunkName: "eselectdlg" */ './dialogs/ESelectDlg'),
      'e-number-dlg': () => import( /* webpackChunkName: "enumberdlg" */ './dialogs/EInputDlg'),
      'e-multiswitch-dlg': () => import( /* webpackChunkName: "emultiswitchdlg" */ './dialogs/EMultiSwitch'),
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
      ask: function() {
        return this.$store.state.ask;
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
    },
    methods: {
      onAnswer: function (res) {
        let r = res;
        if(this.ask.kind === 'text') {
          r = {result: res.value || null};
        }
        this.$store.commit('cmdReply', r);
      },
    }
  };
</script>