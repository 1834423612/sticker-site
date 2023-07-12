import { createRouter, createWebHashHistory } from 'vue-router';

import homePage from "../views/homePage.vue";
import newPage from "../views/new.vue";
import newIn from "../views/new-in.vue";

const router = createRouter({
  routes: [
    {
      path: '/',
      component: homePage
    },
    {
      path: '/new',
      component: newPage
    },
    {
      path: '/newIn/:id',
      name: 'newIn',
      component: newIn
    }
  ],
  history: createWebHashHistory(),
});

export default router;
