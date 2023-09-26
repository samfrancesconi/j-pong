import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue');
const Game = () => import('../views/Game.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/:id',
      component: Game,
    }
  ]
})

export default router
