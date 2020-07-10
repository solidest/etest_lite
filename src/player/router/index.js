import Vue from 'vue'
import VueRouter from 'vue-router'
import EEmpty from '../components/EEmpty.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: EEmpty
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router