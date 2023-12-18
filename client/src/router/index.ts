import { createRouter, createWebHistory } from "vue-router";
import Auth from '../components/Auth.vue'
import Page2 from '../components/Page2.vue'

const routes = [
 {
        path:'/page2',
        name:'/page2',
        component: Page2
    }, {
        path:'/',
        name:'/auth',
        component: Auth
    },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router;