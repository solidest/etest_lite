import Vue from 'vue'
import Vuex from 'vuex'

const {
  ipcRenderer
} = window.require('electron')

Vue.use(Vuex)

const _store = new Vuex.Store({
  state: {
    last_tip: {
      tip: false,
      tip_msg: '',
      tip_type: 'info'
    },
    proj: {
      name: ''
    },
    play_ids: {},
    panel: null,
    winid: null,
    ask: null,
  },
  mutations: {
    setMsgInfo: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'info'
      state.last_tip.tip = true
    },
    setMsgSuccess: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'success'
      state.last_tip.tip = true
    },
    setMsgError: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'error'
      state.last_tip.tip = true
    },
    clearMsg: function (state) {
      state.last_tip.tip_msg = '$'
      state.last_tip.tip = false
    },
    setPlayInfo: function (state, info) {
      state.proj.name = `${info.proj_name} :: ${info.case_name}`
      state.play_ids = {
        proj_id: info.proj_id,
        case_id: info.case_id,
      }
      state.panel = info.panel;
    },
    setWinId: function (state, id) {
      state.winid = id;
    },
    setAsk: function(state, info) {
      state.ask = info;
    },
    cmdReply: function(state, answer) {
      state.ask = null;
      ipcRenderer.send('run-reply', answer);
    },

  },
  actions: {},
  modules: {},
})

ipcRenderer.on('run-ask', (_, info) => {
  console.log('on ask', info)
  _store.commit('setAsk', info);
})

ipcRenderer.on('debug', (_, kind, info, proj_id, case_id) => {
  if(kind === 'play') {
    _store.commit('setPlayInfo', info);
  } else if(kind === 'error' && info) {
    _store.commit('setMsgError', info);
  } else {
    console.log('debug', kind, info, proj_id, case_id);
  }
});

export default _store