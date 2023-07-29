<template>
  <!-- 展示区 -->
  <div class="main">
    <div v-for="(item, index) in appStore.itemList" :key="item.id + item.name">
      <div class="itemFra">
        <!-- <img  :src="item.icon" /> -->
        <el-image :key="index" :src="item.icon" lazy></el-image>
        <span class="item_name">{{ item.name }}</span>
        <div class="btn-fun">
          <el-button type="text" size="mini" @click="copyLink(item.icon)"
            >复制链接</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click="urlToBase64AndDownload(item.icon, item.name)"
            >下载</el-button
          >
        </div>

        <span style="font-size: 14px; margin-bottom: 3px">{{ index + 1 }}</span>
        <!-- <span>{{dayjs.unix(item.updated_at).format("YYYY-MM-DD")}}</span> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAppStore } from "@/store/useAppStore";
const appStore = useAppStore();

//将图片转化为base64再进行下载
function urlToBase64AndDownload(url, name) {
  //实例化一个img对象
  const img = new Image();
  //设置img的图片路径
  img.src = url;
  //设置跨域解决
  img.setAttribute("crossOrigin", "Anonymous");
  //img加载完后处理
  img.onload = function () {
    //创建一个canvas对象
    const canvas = document.createElement("canvas");
    //把图片的宽度设为canves的宽度
    canvas.width = img.width;
    //把图片的高度设为canves的高度
    canvas.height = img.height;
    //创建一个2d画布
    const ctx = canvas.getContext("2d");
    // 将img中的内容画到画布上
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // 将画布内容转换为base64
    let base64 = canvas.toDataURL();
    // 创建a链接
    const a = document.createElement("a");
    a.href = base64;
    a.download = name;
    // 触发a链接点击事件，浏览器开始下载文件
    a.click();
  };
}

//用于复制链接
function copyLink(link) {
  const input = document.createElement("input");
  input.style.cssText = "opacity: 0;display: none;";
  input.type = "text";
  input.value = link; // 修改文本框的内容
  document.body.appendChild(input);
  input.select(); // 选中文本
  document.execCommand("copy"); // 执行浏览器复制命令
}
</script>

<style lang="scss" scoped>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";

#app {
  overflow: scroll;
  overflow-x: hidden;
  background-color: #fff4e3;
}

.main {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 20px;
  margin-top: 20px;

  .itemFra {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: aliceblue;
    border-radius: 5px;
  }

  .itemFra:hover {
    border: red 3px solid;
    margin: -3px;
  }

  .itemFra img {
    width: 100px;
    height: 100px;
    margin-top: 5px;
  }

  .item_name {
    font-size: 15px;
    margin-top: 5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .btn-fun {
    display: flex;
  }
}

::-webkit-scrollbar {
  width: 5px;
}
</style>