import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/orders/:id',
      name: 'OrderDetail',
      props: true,
      component: () => import('@/views/OrderDetail.vue'),
    },
    {
      path: '/wallets',
      name: 'Wallets',
      component: () => import('@/views/Wallets.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
    },
    {
      path: '/trends',
      name: 'Trends',
      component: () => import('@/views/Trends.vue'),
    },
  ],
});

export default router;
