import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/content',
      name: 'content',
      component: () => import('../views/DisplayContent.vue')
    },
    {
      path: '/',
      name: 'catalog',
      component: () => import('../views/DisplayCatalog.vue')
    },
  ]
})

export default router
