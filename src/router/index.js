import Vue from 'vue'
import VueRouter from "vue-router";
import FrontPage from "../views/FrontPage";
import MoviePage from "../views/MoviePage";
import MovieInfo from '@/views/MovieInfo.vue';
import NotFound from '@/views/NotFound.vue';
import UserPage from '@/views/UserPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegPage from '@/views/RegPage.vue';
import SearchPage from '@/views/SearchPage.vue';
import MoviePlay from '@/views/MoviePlay.vue';
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [{
            name: 'FrontPage',
            path: '/frontpage',
            component: FrontPage
        }, {
            path: '/',
            redirect: '/frontpage'
        },
        {
            name: 'MoviePage',
            path: '/moviepage/:tag?',
            component: MoviePage
        },
        {
            name: 'MovieInfo',
            path: '/movieinfo/:id',
            component: MovieInfo
        },
        {
            name: 'UserPage',
            path: '/userpage',
            component: UserPage
        },
        {
            path: '*',
            component: NotFound
        },
        {
            name: 'LoginPage',
            path: '/loginpage',
            component: LoginPage
        },
        {
            path: '/login',
            redirect: '/loginpage'
        },
        {
            name: 'RegPage',
            path: '/regpage',
            component: RegPage
        },
        {
            name:'SearchPage',
            path:'/searchpage/:query?',
            component:SearchPage
        },
        {
            name:'MoviePlay',
            path:'/movieplay/:id',
            component:MoviePlay
        }
    ]
})

export default router