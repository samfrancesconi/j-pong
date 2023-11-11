import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue');
const Game = () => import('../views/Game.vue');
const FourCards = () => import('../views/FourCards.vue');
const BeerPong = () => import('../views/BeerPong.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/four-cards',
      component: FourCards,
    },
    {
      path: '/beer-pong',
      component: BeerPong
    }, 
    {
      path: '/:id',
      component: Game,
    }, 
  ]
})

export default router
