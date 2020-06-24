import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../components/EEmpty.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: EEmpty
  },
  {
    path: '/testcase',
    name: 'TestCase',
    component: EEmpty,
  },
  {
    path: '/project',
    name: 'Project',
    component: EEmpty,
  },
  {
    path: '/newproj',
    name: 'NewProj',
    component: () => import( /* webpackChunkName: "e_newproj" */ '../views/EProjCreate'),
  },
  {
    path: '/listproj',
    name: 'ListProj',
    component: () => import( /* webpackChunkName: "e_listproj" */ '../views/EProjList'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
