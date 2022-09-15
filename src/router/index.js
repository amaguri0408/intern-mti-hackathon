import Vue from 'vue'
import VueRouter from 'vue-router'
import Mypage from '../views/Mypage.vue'
import Login from '../views/Login.vue'
import Ranking from '../views/Ranking.vue'
import Group from '../views/Group.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mypage',
    component: Mypage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/group',
    name: 'Group',
    component: Group
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking
  }
]

const router = new VueRouter({
  routes
})

export default router
