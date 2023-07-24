<template>
  <Header />
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
        v-if="title !== ''"
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
        v-if="list.length === 0"
      />
      <!-- 图片列表 -->
      <div class="list_box" v-for="item in list" :key="item.id">
        <!-- 图片 -->
        <el-image
          class="list_img"
          :src="getImageUrl(item)"
          :alt="item.attributes.name"
          :preview-src-list="[getImageUrl(item)]"
        />
        <!-- 标题 -->
        <span class="list_span">{{ item.attributes.name }}</span>
        <!-- 查看更多按钮 -->
        <el-button type="primary" @click="showMore(item)">
          查看详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const constList = ref([]);
const list = ref([]);
const searchKey = ref("");
const title = ref("");

onMounted(() => {
  // 初始化数据
  axios
    .get("https://sapi.kjchmc.cn/api/collections?populate=cover&populate=emojis")
    .then((response) => {
      constList.value = response.data.data;
      list.value = constList.value;
    });
});

const searchList = () => {
  if (title.value === "") {
    // 搜索所有数据
    list.value = constList.value.filter((item) =>
      item.attributes.name.includes(searchKey.value)
    );
  } else {
    // 按标题搜索数据
    for (var key in constList.value) {
      if (constList.value[key].attributes.name === title.value) {
        list.value = constList.value[key].emojis.data;
      }
    }
    list.value = list.value.filter((item) =>
      item.attributes.name.includes(searchKey.value)
    );
  }
};

const showMore = (row) => {
  // 进入子类目，调用数组
  axios
    .get(`https://sapi.kjchmc.cn/api/emojis?populate=singleEmoji`)
    .then((response) => {
      const emojis = response.data.data;
      const filteredEmojis = emojis.filter((emoji) =>
        row.attributes.emojis.data.some((e) => e.id === emoji.id)
      );
      list.value = filteredEmojis;
      title.value = row.attributes.name;
    });
};

const goBack = () => {
  // 返回上级
  searchKey.value = "";
  title.value = "";
  list.value = constList.value;
};

// 全局变量(.env) IMG_CDN_URL=https://sapi.kjchmc.cn
// 修改为 ${process.env.IMG_CDN_URL}${url}
const getImageUrl = (item) => {
  if (item.attributes.singleEmoji && item.attributes.singleEmoji.data && item.attributes.singleEmoji.data.attributes) {
    const { url } = item.attributes.singleEmoji.data.attributes.formats.thumbnail;
    return `https://sapi.kjchmc.cn${url}`;
  } else if (item.attributes.cover && item.attributes.cover.data && item.attributes.cover.data.attributes) {
    const { url } = item.attributes.cover.data.attributes;
    return `https://sapi.kjchmc.cn${url}`;
  }
  return "";
};
</script>

<script>
import Header from '@/components/Header.vue'

export default {
  components: {
    Header,
  },
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
  background-color: #FFF4E3;
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
  background-color: #FFFFFF;
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