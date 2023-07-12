<template>
  <div class="homePage">
    <h1>test测试标题</h1>
    <div class="search_box">
      <!-- 搜索框 -->
      <el-input
        v-model="searchKey"
        placeholder="Search title..."
        style="width: 50%"
        clearable
        @change="searchList"
      ></el-input>
      <!-- 返回按钮 -->
      <el-button
        class="back"
        type="primary"
        text
        v-if="title != ''"
        @click="goBack"
      >
        返回
      </el-button>
    </div>
    <div class="list_group">
      <!-- 没有数据时显示空状态 -->
      <el-empty
        style="margin: 0 auto"
        description="暂无数据"
        v-if="JSON.stringify(list) == '{}' || list.length == 0"
      />
      <!-- 图片列表 -->
      <div class="list_box" v-for="item in list" :key="item">
        <!-- 图片 -->
        <el-image
          class="list_img"
          v-for="link in item.raw || item.link"
          :src="link"
          :key="link"
          :preview-src-list="[link]"
        />
        <!-- 标题 -->
        <span class="list_span">{{ item.title || item.name }}</span>
        <!-- 查看更多按钮 -->
        <el-button type="primary" @click="showMore(item)" v-if="item.raw">
          查看更多
        </el-button>
        <!-- 下载按钮 -->
        <el-button type="primary" @click="download(item)" v-else>
          下载到本地
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";

const constList = ref([]);
const list = ref([]);
const searchKey = ref("");
const title = ref("");

onMounted(() => {
  // 初始化数据
  fetch("https://test.us.kjchmc.cn/test.json")
    .then((response) => response.json())
    .then((json) => {
      constList.value = Object.values(json).map((item) => {
        if (Array.isArray(item.raw)) {
          return item;
        } else {
          return {
            ...item,
            raw: [item.raw],
          };
        }
      });
      list.value = constList.value;
    });
});

const searchList = () => {
  if (title.value == "") {
    // 搜索所有数据
    list.value = constList.value;
    if (searchKey.value != "" && searchKey.value != null) {
      const result = {};
      for (var key in list.value) {
        if (
          list.value[key].title &&
          list.value[key].title.indexOf(searchKey.value) != -1
        ) {
          result[key] = list.value[key];
        }
        if (
          list.value[key].name &&
          list.value[key].name.indexOf(searchKey.value) != -1
        ) {
          result[key] = list.value[key];
        }
      }
      list.value = result;
      console.log(list.value);
    }
  } else {
    // 按标题搜索数据
    for (var key in constList.value) {
      if (constList.value[key].title == title.value) {
        list.value = constList.value[key].post;
      }
    }
    list.value = list.value.filter(
      (k) => k.name.indexOf(searchKey.value) != -1
    );
  }
};

const showMore = (row) => {
  // 显示更多数据
  searchKey.value = "";
  title.value = row.title;
  list.value = row.post;
};

const goBack = () => {
  // 返回上级
  searchKey.value = "";
  title.value = "";
  list.value = constList.value;
};

const download = (row) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.setAttribute("target", "_blank");
  a.setAttribute("download", row.name);
  a.href = row.link;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return;

  /*跨域下载图片*/

  /* 
    服务器Nginx配置文件添加 允许跨域:
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
  */
  var image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = row.name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = row.link;
};
</script>
<style scoped>
/* 标题样式 */
h1 {
  font-size: 3.2em;
  line-height: 1.1;
  color: #213547;
}

/* 主页容器样式 */
.homePage {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 搜索框样式 */
.search_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 640px;
  position: relative;
  margin-top: 2%;
}

/* 列表容器样式 */
.list_group {
  width: 90%;
  max-width: 640px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-bottom: 20px;
}

/* 返回按钮样式 */
.back {
  position: absolute;
  right: 0;
}

/* 图片列表容器样式 */
.list_box {
  width: calc(30% - 20px);
  height: 240px;
  margin-top: 20px;
  box-shadow: 0px 0px 6px 1px #d2cdcd;
  border-radius: 4px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

/* 图片列表项样式 */
.list_box:not(:nth-child(3n)) {
  margin-right: 5%;
}

/* 图片样式 */
.list_img {
  width: calc(100% - 20px);
  height: 60%;
}

/* 标题样式 */
.list_span {
  font-size: 16px;
  color: #14a1f4;
}

@media (max-width: 550px) {
  /* 响应式样式 */
  .list_box {
    width: calc(47% - 20px);
  }
  .list_box:not(:nth-child(2n)) {
    margin-right: 5% !important;
  }
  .list_box:not(:nth-child(3n)) {
    margin-right: unset;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 10px;
  background-color: rgb(191 191 191 / 22%);
}

::-webkit-scrollbar-track {
  opacity: 0;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #28aeff94;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

::-webkit-scrollbar-corner {
  background: #179a16;
}
</style>