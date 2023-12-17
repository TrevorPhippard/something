import { createRouter, createWebHistory } from "vue-router";
import Page1 from '../components/Page1.vue'
import Page2 from '../components/Page2.vue'

const routes = [
    {
        path:'/page1',
        name:'/page1',
        component: Page1
    },{
        path:'/page2',
        name:'/page2',
        component: Page2
    },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router;