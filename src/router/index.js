import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
// import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Explore from '../views/Explore.vue'
import My from '../views/My.vue'
import Statistic from '../views/Statistic.vue'

const routes = [
  { path: '/:pathMatch(.*)*', redirect: '/explore' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/account', component: Account },
  { path: '/explore', component: Explore },
  { path: '/my', component: My },
  { path: '/stat', component: Statistic },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  let username = sessionStorage.getItem('username')
  if (!username && to.path != '/login' && to.path != '/register') {
    next('/login')
  } else if (username && (to.path == '/login' || to.path == '/register')) {
    next('/')
  } else {
    next()
  }
})

export default router
