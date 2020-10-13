import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../views/EEmpty.vue'
import ELuaEditor from '../views/ELuaEditor'
import ETcgEditor from '../views/ETcgEditor'
import EEditor from '../views/Editor/EEditor'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: EEmpty
  }, {
    path: '/srctree',
    name: 'SrcTree',
    component: EEmpty,
  }, {
    path: '/editor',
    name: 'Editor',
    component: EEditor,
  }, {
    path: '/project',
    name: 'Project',
    component: EEmpty,
  }, {
    path: '/newproj',
    name: 'NewProj',
    component: () => import( /* webpackChunkName: "e_newproj" */ '../views/EProjCreate'),
  }, {
    path: '/listproj',
    name: 'ListProj',
    component: () => import( /* webpackChunkName: "e_listproj" */ '../views/ProjList/EProjList'),
  }, {
    path: '/listpublic',
    name: 'ListPublic',
    component: EEmpty,
  }, {
    path: '/device',
    name: 'Device',
    component: () => import( /* webpackChunkName: "e_editor_device" */ '../views/EDeviceEditor'),
  }, {
    path: '/topology',
    name: 'Topology',
    component: () => import( /* webpackChunkName: "e_editor_topology" */ '../views/ETopologyEditor'),
  }, {
    path: '/protocol',
    name: 'Protocol',
    component: () => import( /* webpackChunkName: "e_editor_protocol" */ '../views/EProtocolEditor'),
  },  {
    path: '/test/protocol',
    name: 'ProtocolTest',
    component: () => import( /* webpackChunkName: "e_test_protocol" */ '../views/EProtocolTestor'),
  }, {
    path: '/tool/dataformat',
    name: 'tool_dataformat',
    component: () => import( /* webpackChunkName: "e_tool_dataformat" */ '../views/EToolDataFormat'),
  }, {
    path: '/tool/icons',
    name: 'tool_icons',
    component: () => import( /* webpackChunkName: "e_tool_icons" */ '../views/EToolIcons'),
  }, {
    path: '/tool/state_code',
    name: 'tool_state_code',
    component: () => import( /* webpackChunkName: "e_tool_statecode" */ '../views/EToolStateCode'),
  }, {
    path: '/panel',
    name: 'Panel',
    component: () => import( /* webpackChunkName: "e_editor_panel" */ '../views/EPanelEditor'),
  }, {
    path: '/lua',
    name: 'Lua',
    component: ELuaEditor,
  }, {
    path: '/tcg',
    name: 'Tcg',
    component: ETcgEditor, //() => import( /* webpackChunkName: "e_editor_tcg" */ '../views/TcgEditor'),
  }, {
    path: '/xtra',
    name: 'Xtra',
    component: () => import( /* webpackChunkName: "e_editor_xtra" */ '../views/EXtraLuaEditor'),
  }, {
    path: '/setting',
    name: 'Setting',
    component: () => import( /* webpackChunkName: "e_editor_setting" */ '../views/EProjSetting'),
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router