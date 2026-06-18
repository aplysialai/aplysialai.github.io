import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/material/:id',
    name: 'MaterialDetail',
    component: () => import('../views/MaterialDetail.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router