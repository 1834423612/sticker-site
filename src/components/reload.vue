<template>
    <!-- 显示提示信息的容器 -->
    <div
      class="pwa-toast fixed right-4 bottom-4 p-3 border border-gray-200 rounded bg-white z-index-10 shadow-md"
      v-if="offlineReady || needRefresh"
      role="alert"
    >
      <!-- 提示信息 -->
      <p class="message mb-2">
        <span v-if="offlineReady">应用程序已准备就绪，可以离线工作。</span>
        <span v-else-if="isRefreshing">正在刷新...</span>
        <span v-else>有新内容可用，请点击“重新加载”按钮进行更新。</span>
      </p>
      <!-- 刷新按钮 -->
      <button
        class="border border-gray-200 rounded py-1 px-2"
        v-if="needRefresh"
        type="button"
        :disabled="isRefreshing"
        @click="doRefresh"
      >
        <!-- 加载动画 -->
        <div class="spinner" v-if="isRefreshing"></div>
        <template v-else>重新加载</template>
      </button>
      <!-- 关闭按钮 -->
      <button class="border border-gray-200 rounded py-1 px-2 ml-2" type="button" @click="close">关闭</button>
    </div>
  </template>
  
  <script setup>
  import { useRegisterSW } from 'virtual:pwa-register/vue'
  import { ref } from "vue";
  
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(r) {
      // 每小时自动检查一次，是否有新版本
      r && setInterval(async () => {
        await r.update();
      }, 60 * 60 * 1000);
    },
  });
  
  const isRefreshing = ref(false);
  
  function doRefresh() {
    isRefreshing.value = true;
    updateServiceWorker();
  }
  
  const close = () => {
    offlineReady.value = false;
    needRefresh.value = false;
  };
  </script>
  