import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../views/Game.vue'
import Login from '../views/Login.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/game',
        name: 'game',
        component: Game
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (store.getters.loggedIn && to.name == 'login') {
        next('game')
    } else if (! store.getters.loggedIn && to.name != 'login') {
        next('login')
    }
    else {
        next()
    }
})

export default router