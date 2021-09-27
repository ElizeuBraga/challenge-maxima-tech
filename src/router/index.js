import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Conta from '@/views/Conta'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('user')
        next()
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('user')
        next()
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      redirect: '/login'
    },
    {
      path: '/register',
      name: 'Novo usuario',
      component: Register,
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('user')
        next()
      }
    },
    {
      path: '/conta',
      name: 'Conta',
      component: Conta,
      props: true,
      beforeEnter: (to, from, next) => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
          window.location = '/login'
          return
        }

        next()
      }
    }
  ]
})

export default router
