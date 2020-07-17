import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../components/EEmpty.vue'
import ELogOut from '../components/ELogOut'
import EPanelOut from '../components/EPanelOut'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: EEmpty
  }, {
    path: '/outs',
    name: 'Outs',
    component: ELogOut
  }, {
    path: '/panel',
    name: 'Panel',
    component: EPanelOut
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router