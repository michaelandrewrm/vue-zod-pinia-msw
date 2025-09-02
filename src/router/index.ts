import { createRouter, createWebHistory } from 'vue-router';
import UserListView from '@/views/UserListView.vue';
import UserDetailView from '@/views/UserDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/users',
    },
    {
      path: '/users',
      name: 'UserList',
      component: UserListView,
    },
    {
      path: '/users/:id',
      name: 'UserDetail',
      component: UserDetailView,
      props: true,
    },
  ],
});

export default router;
