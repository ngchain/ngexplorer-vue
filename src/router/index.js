import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/block/:hashOrHeight',
    name: 'Block',
    component: () => import(/* webpackChunkName: "block" */ '../views/Block.vue')
  },
  {
    path: '/tx/:txHash',
    name: 'Tx',
    component: () => import(/* webpackChunkName: "block" */ '../views/Tx.vue')
  },
  {
    path: '/account/:num',
    name: 'account',
    component: () => import(/* webpackChunkName: "block" */ '../views/Account.vue')
  },
  {
    path: '/address/:addr',
    name: 'Address',
    component: () => import(/* webpackChunkName: "block" */ '../views/Address.vue')
  }

]

const router = new VueRouter({
  mode: 'hash', // use 'hash' for github pages, 'history' for VPS
  base: process.env.BASE_URL,
  routes
})

export default router
