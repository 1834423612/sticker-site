import { createApp } from 'vue'
import pinia from '@/store/store'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { registerSW } from 'virtual:pwa-register'
import ReloadToast from '@/components/reload.vue'; // 导入 reload.vue 组件

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)


// 注册 Service Worker
const updateSW = registerSW({
  // 当 Service Worker 安装或者有新版本时触发的回调
  onNeedRefresh() {
    // 显示刷新提示
    showReloadToast();
    // console.log("Service Worker need update page!!! 有新内容可用，请点击“重新加载”按钮进行更新。")
  },
});

// 监听 Service Worker 的更新事件
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // 在 Service Worker 更新时，弹出提示让用户刷新页面以更新内容
  // 这里可以添加类似 toast 提示，或者显示一个提示框
  // 用户点击后刷新页面即可获取新的内容
  // 例如：window.location.reload();
  showReloadToast();
});


const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(pinia)
app.mount('#app')


// 定义显示刷新提示的方法
function showReloadToast() {
  // 创建一个 div 元素用于挂载 reload.vue 组件
  const reloadToastContainer = document.createElement('div');
  document.body.appendChild(reloadToastContainer);

  // 在新创建的 div 元素中挂载 reload.vue 组件
  const reloadToastApp = createApp(ReloadToast);
  reloadToastApp.mount(reloadToastContainer);
}