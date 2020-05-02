import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import(/* webpackChunkName: "main" */ '@/views/Main')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About')
  },
  {
    path: '/server',
    name: 'Server',
    component: () => import(/* webpackChunkName: "server" */ '@/views/Server')
  },
  {
    path: '/system',
    name: 'System',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System')
  },
  {
    path: '/odbc',
    name: 'ODBC',
    component: () => import(/* webpackChunkName: "odbc" */ '@/views/ODBC')
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes
});

export default router;
