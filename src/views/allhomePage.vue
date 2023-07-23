<template>
  <div class="homePage">
    <div class="search_box">
      <el-input
        v-model="searchKey"
        placeholder="Search title..."
        style="width: 50%"
        clearable
        @change="searchList"
      ></el-input>
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
    <div class="list_gruop">
      <el-empty
        style="margin: 0 auto"
        description="暂无数据"
        v-if="JSON.stringify(list) == '{}' || list.length == 0"
      />
      <div class="list_box" v-for="item in list" :key="item">
        <el-image
          class="list_img"
          :src="'https://sapi.kjchmc.cn' + (title == '' ? item.attributes.cover.data.attributes.url : item.attributes.singleEmoji.data.attributes.url)"
          :preview-src-list="['https://sapi.kjchmc.cn' + (title == '' ? item.attributes.cover.data.attributes.url : item.attributes.singleEmoji.data.attributes.url)]"
        />
        <span class="list_span">{{ item.attributes.name }}</span>
        <el-button type="primary" @click="showMore(item)" v-if="item.attributes.emojis">
          查看更多
        </el-button>
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

const constList = ref({}); //存储原始数据
const list = ref({});
const searchKey = ref("");
const title = ref("");

onMounted(() => {
  fetch("https://sapi.kjchmc.cn/api/collections?populate=cover&populate=emojis.singleEmoji")
    .then((response) => response.json())
    .then((json) => {
      constList.value = json.data;
      list.value = json.data;
    });
});

const searchList = () => {
  if (title.value == "") {
    list.value = constList.value;
    if (searchKey.value != "" && searchKey.value != null) {
      const result = {};
      for (var key in list.value) {
        if (
          list.value[key].attributes.name &&
          list.value[key].attributes.name.indexOf(searchKey.value) != -1
        ) {
          result[key] = list.value[key];
        }
        if (
          list.value[key].attributes.name &&
          list.value[key].attributes.name.indexOf(searchKey.value) != -1
        ) {
          result[key] = list.value[key];
        }
      }
      list.value = result;
    }
  } else {
    for (var key in constList.value) {
      if (constList.value[key].attributes.name == title.value) {
        list.value = constList.value[key].attributes.emojis.data;
      }
    }
    list.value = list.value.filter(
      (k) => k.attributes.name.indexOf(searchKey.value) != -1
    );
  }
};
const showMore = (row) => {
  searchKey.value = "";
  title.value = row.attributes.name;
  list.value = row.attributes.emojis.data;
};
const goBack = () => {
  searchKey.value = "";
  title.value = "";
  list.value = constList.value;
};
const download = (row) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.setAttribute("target", "_blank");
  a.setAttribute("download", row.attributes.name);
  a.href = 'https://sapi.kjchmc.cn' + (title.value == '' ? row.attributes.cover.data.attributes.url : row.attributes.singleEmoji.data.attributes.url);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return;
  /*跨域下载图片*/
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
    a.download = row.attributes.name || "photo"; // 设置图片名称
    a.href = 'https://sapi.kjchmc.cn' + (title.value == '' ? row.attributes.cover.data.attributes.url : row.attributes.singleEmoji.data.attributes.url); // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = row.link;
};
</script>

<style scoped>
.homePage {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 640px;
  position: relative;
  margin-top: 5%;
}
.list_gruop {
  width: 90%;
  max-width: 640px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
}
.back {
  position: absolute;
  right: 0;
}
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
.list_box:not(:nth-child(3n)) {
  margin-right: 5%;
}
.list_img {
  width: calc(100% - 20px);
  height: 60%;
}
.list_span {
  font-size: 16px;
  color: #14a1f4;
}
@media (max-width: 550px) {
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
</style>