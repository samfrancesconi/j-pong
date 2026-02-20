import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue');
const BeerPong = () => import('../views/BeerPong.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/beer-pong',
      component: BeerPong
    }, 
  ]
})

export default router
