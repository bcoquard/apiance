import Vue from 'vue'
import Router from 'vue-router'

import AuthRequired from '@/utils/AuthRequired'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "app-start" */ './views/app/loggedin'),
      redirect: '/app/home',
      beforeEnter: AuthRequired,
      children: [
        {
          path: '/app/apis/:id',
          props: true,
          name: 'apis',
          component: () => import(/* webpackChunkName: "Apis" */ './views/app/loggedin/Apis.vue')
        },
        {
          path: '/app/home',
          name: 'home',
          component: () => import(/* webpackChunkName: "About" */ './views/app/loggedin/Home.vue')
        },
        {
          path: '/app/about',
          name: 'about',
          component: () => import(/* webpackChunkName: "About" */ './views/app/About.vue')
        }
      ]
    }, {
      path: '/admin',
      component: () => import(/* webpackChunkName: "Admin" */ './views/app/loggedin/admin'),
      redirect: '/admin/home',
      beforeEnter: AuthRequired,
      children: [
        {
          path: '/admin/home',
          name: 'admin-home',
          component: () => import(/* webpackChunkName: "Apis" */ './views/app/loggedin/admin/Admin.vue')
        },
        {
          path: '/admin/swaggers',
          name: 'admin-swaggers',
          component: () => import(/* webpackChunkName: "Apis" */ './views/app/loggedin/admin/Swaggers.vue')
        },
        {
          path: '/admin/utils',
          name: 'admin-swaggerutils',
          component: () => import(/* webpackChunkName: "Apis" */ './views/app/loggedin/admin/Admin.vue')
        }

      ]
    }, {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "Login" */ './views/app/Login.vue')
    },
    { path: '/error', component: () => import(/* webpackChunkName: "error" */ './views/app/Error.vue') },
    { path: '*', component: () => import(/* webpackChunkName: "error" */ './views/app/Error.vue') }
  ]
})
