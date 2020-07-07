import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../components/EEmpty.vue'
import ELuaEditor from '../views/ELuaEditor'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: EEmpty
  }, {
    path: '/testcase',
    name: 'TestCase',
    component: EEmpty,
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
    component: () => import( /* webpackChunkName: "e_listproj" */ '../views/EProjList'),
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
  }, {
    path: '/panel',
    name: 'Panel',
    component: () => import( /* webpackChunkName: "e_editor_panel" */ '../views/EPanelEditor'),
  }, {
    path: '/lua',
    name: 'Lua',
    component: ELuaEditor,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router