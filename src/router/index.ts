import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: require('../views/Home.vue').default
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
