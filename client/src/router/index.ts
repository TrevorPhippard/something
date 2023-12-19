import { createRouter, createWebHistory } from "vue-router";
import Auth from '../components/Auth.vue'
import Chat from '../components/Chat.vue'
import Register from '../components/Register.vue'


const routes = [
 {
        path:'/chat',
        name:'/chat',
        component: Chat
    }, {
        path:'/',
        name:'/auth',
        component: Auth
    },{
        path:'/register',
        name:'/register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router;