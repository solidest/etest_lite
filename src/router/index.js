import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../views/EEmpty.vue'
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
    path: '/listproj',
    name: 'ListProj',
    component: () => import( /* webpackChunkName: "e_listproj" */ '../views/ProjList/EProjList'),
  }, {
    path: '/listreused',
    name: 'ListReused',
    component: () => import( /* webpackChunkName: "e_listreused" */ '../views/ReusedList/EReusedList'),
  }, {
    path: '/toolsbox',
    name: 'ToolsBox',
    component: () => import( /* webpackChunkName: "e_toolsbox" */ '../views/ToolsBox/EToolsBox'),
  }, {
    path: '/paneldesigner',
    name: 'PanelDesigner',
    component: () => import( /* webpackChunkName: "e_paneldesigner" */ '../views/PanelDesigner/EEmpty'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router