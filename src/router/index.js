import { createRouter, createWebHashHistory } from 'vue-router';

import LoadingPage from "../views/test/loading.vue";
import homePage from "../views/test/homePage.vue";
import AllhomePage from "../views/allhomePage.vue";
import newPage from "../views/test/new.vue";
import newIn from "../views/new-in.vue";
import testIndex from '../views/index.vue';
import TestLandPage from '../views/test/testlandpage.vue';
import CollectionDetails from '../views/CollectionDetails.vue';
// import CollectionInfo from '../views/CollectionInfo.vue';
import AllSearch from '../views/AllSearch.vue';
import Search from '../views/search.vue';


const routes = [
  {
    path: '/',
    component: AllhomePage,
  },
  {
    path: '/test',
    name: 'homePage',
    component: homePage,
  },
  {
    path: '/all-search',
    name: 'allSearch',
    component: AllSearch,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/LoadingPage',
    name: 'LoadingPage',
    component: LoadingPage,
  },
  {
    path: '/new',
    component: newPage,
  },
  {
    path: '/newIn/:id',
    name: 'newIn',
    component: newIn,
  },
  {
    path: '/testindex',
    component: testIndex,
    meta: { keepAlive: true }, // 使用meta字段添加keepAlive标记
  },
  {
    path: '/collection/:CID',
    name: 'CollectionDetails',
    component: CollectionDetails,
  },
  {
    path: '/testlandpage',
    component: TestLandPage,
  }
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

// 加载Loading页面
// router.beforeEach((to, from, next) => {
//   if (to.name === 'LoadingPage') {
//     next();
//   } else {
//     setTimeout(() => {
//       next();
//     }, 2000); // Adjust the delay time as needed
//   }
// });

export default router;
