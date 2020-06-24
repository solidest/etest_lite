import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../feature/r_ipc';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    last_tip: {
      tip: false,
      tip_msg: '',
      tip_type: 'info'
    },
    edit_doc: null,
    sele_doc: null,
    proj: null,
    winid: 1,
  },
  mutations: {
    setMsgInfo: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'info'
      state.last_tip.tip = true
    },
    setUser: function (state, user) {
      state.user = user;
      state.lock = false;
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
    setProj: function(state, proj) {
      if(proj && state.proj && proj.id===state.proj.id) {
        return;
      }
      state.proj = proj;
      ipc.bind_proj(state.winid, proj ? proj.id : null);
      state.edit_doc = null;
    },
    setWinId: function(state, id) {
      state.winid = id;
    },
    setEditDoc: function(state, info) {
      console.log('open doc', info.doc.id);
      state.edit_doc = info;
    },
    setSeleDoc: function(state, info) {
      state.sele_doc = info;
    },
    deletedDoc: function(state, id) {
      if(state.edit_doc && state.edit_doc.doc.id === id) {
        state.edit_doc = null;
        console.log('close doc', id)
      }
    }
  },
  actions: {},
  modules: {},

})