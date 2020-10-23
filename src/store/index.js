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
    edit_doc: null,
    sele_doc: null,
    sele_count: 0,
    redo_count: 0,
    undo_count: 0,
    proj: null,
    copyed: null,
    check_result: {
      version: 0,
      proj_id: 0
    },
    play_info: null,
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
    setEditDoc: function (state, info) {
      // console.log('open doc', info.doc.id);
      state.edit_doc = info;
    },
    setSeleDoc: function (state, info) {
      state.sele_doc = info;
    },
    setSeleCount: function (state, count) {
      state.sele_count = count;
    },
    setCopyed: function (state, copyed) {
      state.copyed = copyed;
    },
    setRedoUndo: function (state, info) {
      state.redo_count = info.redo_count;
      state.undo_count = info.undo_count;
    },
    clearEditor: function (state) {
      state.sele_count = 0;
      state.undo_count = 0;
      state.redo_count = 0;
    },
    deletedDoc: function (state, id) {
      if (state.edit_doc && state.edit_doc.doc.id === id) {
        state.edit_doc = null;
      }
    },
    setCheckResult: function (state, info) {
      state.check_result = info;
    },
    setPlayInfo: function (state, info) {
      state.play_info = info;
    },
  },
  actions: {},
  getters: {
    check_result: state => {
      if (state.check_result && state.proj && state.check_result.proj_id === state.proj.id) {
        return state.check_result.results;
      }
      return null;
    },
  }
})

ipcRenderer.on('copyed', (_, format) => {
  _store.commit('setCopyed', format);
});

api.clipboard_read().then(res => _store.commit('setCopyed', res ? res.format : null));

export default _store