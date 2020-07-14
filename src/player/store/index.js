import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../../feature/r_ipc';
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
    proj: null,
    winid: 1,
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
    setProj: function (state, proj) {
      if (proj && state.proj && proj.id === state.proj.id) {
        return;
      }
      state.proj = proj;
      ipc.bind_proj(state.winid, proj ? proj.id : null);
      state.edit_doc = null;
    },
    setWinId: function (state, id) {
      state.winid = id;
    },
  },
  actions: {},
  modules: {},
  getters: {
    check_result: state => {
      if (state.check_result && state.proj && state.check_result.proj_id === state.proj.id) {
        return state.check_result.results;
      }
      return null;
    },
  }
})

ipcRenderer.on('run-case', (_, info) => {
  console.log('run', info);
});

export default _store