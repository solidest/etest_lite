import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../feature/ipc_render';

import ProjList from './modules/ProjList';
import Editor from './modules/Editor';
import api from '../api/client/';

const {
  ipcRenderer
} = window.require('electron')

Vue.use(Vuex)

const _store = new Vuex.Store({
  modules: {
    ProjList,
    Editor,
  },
  state: {
    last_tip: {
      tip: false,
      tip_msg: '',
      tip_type: 'info'
    },
    proj: null,
    copyed: null,
    win_mode: 'normal'
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
      ipc.bind_proj(proj ? proj.id : null);
      state.edit_doc = null;
    },
    setCopyed: function (state, copyed) {
      state.copyed = copyed;
    },
    setWinMode: function (state, mode) {
      state.win_mode = mode;
    },
  },
  actions: {},
})

ipcRenderer.on('copyed', (_, format) => {
  _store.commit('setCopyed', format);
});

api.clipboard_read().then(res => _store.commit('setCopyed', res ? res.format : null));

export default _store