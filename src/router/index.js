import Vue from 'vue'
import VueRouter from 'vue-router'
// import ScpcList from '@/pages/scpc/List'
import ScpcDetail from '@/pages/scpc/Detail'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // {
    //   path: '/ScpcList',
    //   name: 'ScpcList',
    //   component: ScpcList,
    //   meta: {requireAuth: false}
    // },
    {
      path: '/ScpcDetail',
      name: 'ScpcDetail',
      component: ScpcDetail,
      meta: {requireAuth: false}
    },
    {path: '*', redirect: '/ScpcDetail'}
  ]
})
export default router
