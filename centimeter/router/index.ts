import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      children: [
        {
          path: '',
          redirect: '/auth/login'
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../components/LoginPage.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('../components/SignUpPage.vue')
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../components/LoginPage.vue')
        }
      ]
    }
  ],
})

export default router
