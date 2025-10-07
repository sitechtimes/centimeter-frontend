import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
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
          path: 'login',
          name: 'login',
          component: () => import('../components/LoginPage.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('../components/SignUpPage.vue')
        },
/*         {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../components/LoginPage.vue')
        } */
      ]
    }
  ],
})

export default router
