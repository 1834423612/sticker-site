<template>
  <Header />
  <div id="app">
    <div class="search-header">
      <div class="bg">
        <!-- <div class="bg-title">
          <h1>test Title</h1>
        </div> -->
        <div class="bg-container">
          <div class="title-section">
            <!-- 搜索框 -->
            <div class="search-form-div">
              <form class="search-form">
                <!-- action="https://example.com"                method="get" -->
                <div class="search-form-wrap">
                  <!-- 控制开关下拉列表 -->
                  <div
                    class="selects"
                    @click="toggleSelects"
                    :class="{ show: selectsVisible }"
                  >
                    <input
                      type="hidden"
                      name="source"
                      :value="selectedOption.value"
                    />
                    <h3
                      class="select-title"
                      style="cursor: pointer"
                      @click.stop="toggleSelects"
                    >
                      <strong>{{ selectedLabel }}</strong>
                      <i
                        class="fas fa-chevron-down"
                        style="cursor: pointer"
                      ></i>
                    </h3>
                    <!-- 下拉选项列表 -->
                    <ul class="selects-ul" :class="{ show: selectsVisible }">
                      <li
                        v-for="item in options"
                        :key="item.value"
                        @click.stop="handleSelect(item)"
                        :class="{
                          current: selectedOption.value === item.value,
                        }"
                      >
                        {{ item.label }}
                      </li>
                    </ul>
                  </div>

                  <div class="txt">
                    <!-- 输入框内容, 记录并传参?s=xxx     @input="input = $event.target.value"-->
                    <input
                      type="text"
                      autocomplete="off"
                      class="s placeholder txt_empty"
                      name="s"
                      v-model="searchVal"
                      @keydown.enter="item_search(searchVal)"
                      :placeholder="'按Enter回车搜索'"
                      data-init="done"
                    />
                    <span class="ico-ji"></span>
                  </div>
                  <div class="btns">
                    <!-- 搜索按钮 -->
                    <button type="submit" class="search-btn">
                      <i class="fas fa-search"></i>
                      <span>搜索</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="search-content">
        <div class="search-title">
          <strong>搜索结果</strong>
        </div>
        <div class="container">
          <search-result></search-result>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import SearchResult from "@/views/SearchResult.vue";
import { ref, onBeforeMount, onMounted, onUnmounted, computed, watchEffect, watch } from "vue";
import $ from "jquery";
import { Search } from "@element-plus/icons-vue";

import { useAppStore } from "@/store/useAppStore";
const appStore = useAppStore();

// const input = ref("");
const searchVal = ref(""); //输入搜索关键字  默认搜索整个API内容
const select = ref("all");
const selectsVisible = ref(false);

// 从localStorage中读取保存的搜索分区选项值
const selectedOption = ref(localStorage.getItem("selectedOption") || "official");

// 设置初始值，在组件首次渲染前从localStorage中读取保存的选项值
onBeforeMount(() => {
  const savedOption = localStorage.getItem("selectedOption");
  if (savedOption && options.some((item) => item.value === savedOption)) {
    selectedOption.value = savedOption;
  }
});

// 监听选项值变化，保存到localStorage中
watch(selectedOption, (newValue) => {
  localStorage.setItem("selectedOption", newValue);
});

// 添加计算属性 selectedLabel
const selectedLabel = computed(() => {
  const option = options.find((opt) => opt.value === selectedOption.value);
  return option ? option.label : "官方";
});

// 定义选项数据的数组
const options = [
  { value: "official", label: "官方" },
  { value: "post1", label: "合集" },
  { value: "post2", label: "分类2" },
  { value: "post3", label: "分类3" },
];

function toggleSelects() {
  selectsVisible.value = !selectsVisible.value;
}

function handleSelect(item) {
  // 处理选项选择逻辑
  selectedOption.value = item.value;
  // 选项被选择后，隐藏选项列表
  selectsVisible.value = false;

  // 手动调用一次watchEffect，确保localStorage中的值被及时更新
  watchEffect(() => {
    localStorage.setItem("selectedOption", selectedOption.value);
  });
}


function hideSelects() {
  selectsVisible.value = false;
}

// 获取cookie
function getCookie(name) {
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 设置cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 搜索
function item_search(val) {
  let keyWord = val.toLowerCase();
  let arr = [];
  let arr_item = [];
  for (var i = 0; i < appStore.apiData.length; i++) {
    arr_item = appStore.apiData[i].list.filter((item) =>
      item.name.toLowerCase().includes(keyWord)
    );
    for (var j = 0; j < arr_item.length; j++) {
      arr.push(arr_item[j]);
    }
  }
  appStore.itemList = arr;
}

// 监听点击事件，用于在点击列表外部时关闭下拉选项列表
onMounted(() => {
  // 从Cookie中读取保存的选项
  const savedOption = getCookie("selectedOption");
  // 如果cookie中有选项设置，则使用它
  if (savedOption && options.some((item) => item.value === savedOption)) {
    selectedOption.value = savedOption;
  } else {
    // 否则，默认使用官方选项
    selectedOption.value = "official";
  }

  const handleClickOutside = (event) => {
    const target = event.target;
    const selectsElement = document.querySelector(".selects");

    // 判断点击的区域是否在下拉选项列表之外，并隐藏列表
    if (selectsVisible.value && !selectsElement.contains(target)) {
      hideSelects();
    }
  };

  document.addEventListener("click", handleClickOutside);

  // 组件卸载时移除监听
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<script>
export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style lang="scss" scoped>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";
/* 引入自定义字体 ZhuZiAWan */
@import "@/components/css/fonts.scss";

#app {
  background-color: #fff4e3;
  height: 100vh;
  overflow-y: scroll;
  background-color: #fff4e3;
}

// h1 {
//     font-size: 3.2em;
//     line-height: 0;
// }

.search-header {
  position: relative;
  height: 200px;
}

.bg {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  background: #3b82ff;
  flex-direction: column;
  // 设置卡片容器居中样式
  justify-content: center;
  // background: #3b82ff url(https://images.uiiiuiii.com/wp-content/uploads/2020/02/uiii-07.png) no-repeat 100% 100%;
}

.bg-title {
  padding: 20px;
  color: #ffffff;
  font-weight: bold;
  /* 使用自定义字体，如果字体加载失败，回退到系统默认字体 */
  font-family: "ZhuZiAWanCN", sans-serif;
}

.title-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  border-radius: 10px;
  /* 设置大卡片长宽 */
  // height: 50%;
  // width: 70%;
  // background-color: cornflowerblue;
  background-color: rgb(255 255 255 / 20%);
}

.bg-container {
  width: 60%;
  // height: 100%;
  margin-bottom: 4%;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
}

.search-form-div {
  // padding: 0 150px;
  width: 100%;
}

.search-form-div .search-form-wrap {
  height: 54px;
  background: #fff;
  -webkit-border-radius: 6px;
  border-radius: 6px;
  overflow: visible;
  position: relative;
  padding: 0 100px 0 120px;
}

.search-form-div .search-form-wrap .selects {
  position: absolute;
  left: 22px;
  top: 18px;
  padding-right: 20px;
}

// 分类菜单右侧隔离竖杠
.search-form-div .search-form-wrap .selects:after {
  content: "";
  display: block;
  width: 0;
  height: 10px;
  border-right: 1px solid #dedede;
  position: absolute;
  top: 50%;
  margin-top: -5px;
  right: 0;
}

.search-form-div .search-form-wrap .selects.show .selects-ul {
  height: 140px;
  visibility: visible;
  opacity: 1;
  top: 80%;
  z-index: 1;
}

// 分类菜单下拉后样式
.search-form-div .search-form-wrap .selects .selects-ul {
  position: absolute;
  left: -22px;
  background: #fff;
  padding: 10px 26px;
  text-align: center;
  -webkit-border-radius: 0 0 6px 6px;
  border-radius: 0 0 6px 6px;
  color: #8f8f8f;
  height: 1px;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
}

// 分类列表样式
.search-form-div .search-form-wrap .selects .select-title {
  font-size: 14px;
  color: #8f8f8f;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  cursor: pointer;
}

.search-form-div .search-form-wrap .selects .select-title strong {
  font-weight: 400;
}

.search-form-div .search-form-wrap .selects .select-title i {
  font-size: 9px;
  margin-left: 5px;
  display: inline-block;
  line-height: 20px;
  vertical-align: bottom;
}

.search-form-div .search-form-wrap .selects .select-title i:before {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.search-form-div .search-form-wrap .selects .select-title:hover {
  color: #3385ff;
}

.search-form-div .search-form-wrap .selects .selects-ul {
  position: absolute;
  left: -22px;
  top: 90%;
  background: #fff;
  padding: 10px 30px;
  text-align: center;
  -webkit-border-radius: 0 0 6px 6px;
  border-radius: 0 0 6px 6px;
  color: #8f8f8f;
  height: 1px;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
}

.search-form-div .search-form-wrap .selects .selects-ul li {
  display: block;
  white-space: nowrap;
  line-height: 35px;
  cursor: pointer;
}

// 下拉菜单被选择文字高亮提示
.search-form-div .search-form-wrap .selects .selects-ul li.current,
.search-form-div .search-form-wrap .selects .selects-ul li:hover {
  color: #3385ff;
}

.search-form-div .search-form-wrap .txt {
  position: relative;
}

.search-form-div .search-form-wrap .txt .s {
  display: block;
  width: 100%;
  height: 54px;
  padding: 17px 0;
  line-height: 20px;
  font-size: 14px;
  color: rgb(143 143 143 / 50%);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0);
  position: relative;
  z-index: 2;
}

.search-form-div .search-form-wrap .txt .s:focus {
  color: #3c3c3c;
}

.search-form-div .search-form-wrap .txt .ico-ji {
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 1;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
}

.search-form-div .search-form-wrap .btns {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
}

.search-form-div .search-form-wrap .btns .search-btn {
  height: 54px;
  padding: 0 20px;
  display: block;
  border: none;
  background: rgba(0, 0, 0, 0);
  cursor: pointer;
  font-size: 18px;
  color: #6d6e73;
  -webkit-border-radius: 0 6px 6px 0;
  border-radius: 0 6px 6px 0;
}

.search-form-div .search-form-wrap .btns .search-btn span {
  display: none;
}

.search-form-div .search-form-wrap .btns .search-btn:hover {
  color: #3385ff;
}

.search-content {
  background: #fff;
}

input {
  margin: 0;
  padding: 0;
  border: 0;
  outline-style: none;
  vertical-align: middle;
}

.show {
  visibility: visible;
  opacity: 1;
}

.hide,
.show {
  -webkit-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
}

.search-content {
  position: relative;
  background: none;
  height: 600px;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  //   padding: 0 8%;
  padding: 0 30px;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
}

.search-title {
  display: flex;
  flex-direction: column;
  width: auto;
  height: fit-content;
  font-size: 20px;
  padding: 3rem 0;
}
</style>
