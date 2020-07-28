import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path:'/home',
    name:'Home',
    component:()=> import ('../views/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=> import ('../views/WelCome')
      },
      {
        path:'/users',
        component:()=> import ('../views/User/User.vue')
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
