<template>
    <div id="app">
        <Header />
        <div class="CollectionDetails-header">
            <div class="bg">
                <div class="bg-title">
                    <h1>test Title</h1>
                </div>
                <div class="bg-container">
                    <div id="collection-info" class="title-section">
                        <!-- 搜索框 -->
                        <div class="search-form-div">
                            <form class="search-form" action="https://example.com" method="get">
                                <div class="search-form-wrap">
                                    <!-- 控制开关下拉列表 -->
                                    <div class="selects" @click="toggleSelects" :class="{ 'show': selectsVisible }">
                                        <!-- 将分类数据写入传参 -->
                                        <input type="hidden" name="source" :value="select" />
                                        <h3 class="select-title" style="cursor: pointer" @click.stop="toggleSelects">
                                            <strong>{{ selectedLabel }}</strong>
                                            <i class="fas fa-chevron-down" style="cursor: pointer"></i>
                                        </h3>
                                        <!-- 下拉选项列表 -->
                                        <ul class="selects-ul" :class="{ 'show': selectsVisible }">
                                            <li v-for="item in options" :key="item.value"
                                                @click.stop="handleSelect(item.value)"
                                                :class="{ 'current': select === item.value }" :data-source="item.value">
                                                {{ item.label }}
                                            </li>
                                        </ul>


                                    </div>

                                    <div class="txt">
                                        <!-- 输入框内容, 记录并传参?s=xxx -->
                                        <input type="text" autocomplete="off" class="s placeholder txt_empty" name="s"
                                            :value="input" @input="input = $event.target.value"
                                            :placeholder="'按Enter回车搜索'" data-init="done" />
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
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import $ from 'jquery';
import { Search } from '@element-plus/icons-vue';

const input = ref('');
const select = ref('all');
const selectsVisible = ref(false);

// 定义选项数据的数组
const options = [
    { value: 'all', label: '全部' },
    { value: 'post1', label: '分类1' },
    { value: 'post2', label: '分类2' },
    { value: 'post3', label: '分类3' },
];

// 添加计算属性 selectedLabel
const selectedLabel = computed(() => {
    const option = options.find((opt) => opt.value === select.value);
    return option ? option.label : '全部';
});

function toggleSelects() {
    selectsVisible.value = !selectsVisible.value;
}

function handleSelect(item) {
    // 处理选项选择逻辑
    select.value = item;
    // 选项被选择后，隐藏选项列表
    selectsVisible.value = false;
}

function hideSelects() {
    selectsVisible.value = false;
}

// 监听点击事件，用于在点击列表外部时关闭下拉选项列表
onMounted(() => {
    const handleClickOutside = (event) => {
        const target = event.target;
        const selectsElement = document.querySelector('.selects');

        // 判断点击的区域是否在下拉选项列表之外，并隐藏列表
        if (selectsVisible.value && !selectsElement.contains(target)) {
            hideSelects();
        }
    };

    document.addEventListener('click', handleClickOutside);

    // 组件卸载时移除监听
    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
});
</script>


<script>
export default {
    components: {
        Header,
    },
};
</script>



<style lang='scss' scoped>
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

.CollectionDetails-header {
    position: relative;
    height: 35%;
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
    color: #FFFFFF;
}

.bg-title h1 {
    font-size: 3.2em;
    line-height: 0;
    font-family: 'ZhuZiAWanCN', sans-serif;
    /* 使用自定义字体，如果字体加载失败，回退到系统默认字体 */
}


/* 新增样式：设置堆叠顺序，让.title-section和.CollectionDetails-body在前面 */
.title-section,
.CollectionDetails-body {
    position: relative;
    /* 设置较高的z-index值 */
    z-index: 1;
}


#collection-info.title-section {
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

#collection-info .collection-title {
    color: #FFFFFF;
    font-weight: normal;
    font-size: 300%;
    line-height: 0.5;
    -webkit-line-clamp: 3;
}

.bg-container {
    width: 60%;
    // height: 100%;
    margin-bottom: 4%;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
}

.collection-details {
    margin-left: 15px;
}

.collection-icon {
    /* 新增样式：调整collection-icon距离页面右侧10px */
    margin-right: 10px;
}

.collection-icon img {
    width: 120px;
    height: auto;
}

.search-bar {
    text-align: left;
    width: 50%;
    border-radius: 10px;
    overflow: hidden;
}

/* 使用 Flex 布局将内容在一行内显示 */
.search-input-prepend {
    display: flex;
    align-items: center;
}

/* 调整样式使得 select 和按钮之间有一些间距 */
.el-select {
    margin-right: 10px;
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
    padding: 0 100px 0 120px
}

.search-form-div .search-form-wrap .selects {
    position: absolute;
    left: 22px;
    top: 18px;
    padding-right: 20px
}

.search-form-div .search-form-wrap .selects:after {
    content: "";
    display: block;
    width: 0;
    height: 10px;
    border-right: 1px solid #dedede;
    position: absolute;
    top: 50%;
    margin-top: -5px;
    right: 0
}

.search-form-div .search-form-wrap .selects.show .selects-ul {
    height: 140px;
    visibility: visible;
    opacity: 1;
    top: 80%
}

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
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;
}

.search-form-div .search-form-wrap .selects .select-title {
    font-size: 14px;
    color: #8f8f8f;
    font-weight: 400;
    line-height: 1.5;
    margin: 0;
    cursor: pointer
}

.search-form-div .search-form-wrap .selects .select-title strong {
    font-weight: 400
}

.search-form-div .search-form-wrap .selects .select-title i {
    font-size: 9px;
    margin-left: 5px;
    display: inline-block;
    line-height: 20px;
    vertical-align: bottom
}

.search-form-div .search-form-wrap .selects .select-title i:before {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg)
}

.search-form-div .search-form-wrap .selects .select-title:hover {
    color: #3385ff
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
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s
}

.search-form-div .search-form-wrap .selects .selects-ul li {
    display: block;
    white-space: nowrap;
    line-height: 35px;
    cursor: pointer
}

.search-form-div .search-form-wrap .selects .selects-ul li.current,
.search-form-div .search-form-wrap .selects .selects-ul li:hover {
    color: #3385ff
}

.search-form-div .search-form-wrap .txt {
    position: relative
}

.search-form-div .search-form-wrap .txt .s {
    display: block;
    width: 100%;
    height: 54px;
    padding: 17px 0;
    line-height: 20px;
    font-size: 14px;
    color: #8f8f8f;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0);
    position: relative;
    z-index: 2
}

.search-form-div .search-form-wrap .txt .s:focus {
    color: #3c3c3c
}

.search-form-div .search-form-wrap .txt .ico-ji {
    position: absolute;
    left: 50%;
    bottom: 0;
    z-index: 1;
    visibility: hidden;
    opacity: 0;
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s
}

.search-form-div .search-form-wrap .btns {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3
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
    border-radius: 0 6px 6px 0
}

.search-form-div .search-form-wrap .btns .search-btn span {
    display: none
}

.search-form-div .search-form-wrap .btns .search-btn:hover {
    color: #3385ff
}

.search-content {
    background: #fff
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
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;
}




.el-breadcrumb {
    font-size: 14px;
    line-height: 1;
    padding-bottom: 10px;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}


/* 在屏幕宽度小于768px时，每行显示2个卡片 */
@media (max-width: 768px) {
    .Emoji-card {
        flex-basis: calc(50% - 20px);
    }

    .Emoji-card:not(:nth-child(1n)) {
        margin-right: 5%;
    }
}

/* 在屏幕宽度小于576px时，每行显示1个卡片 */
@media (max-width: 576px) {
    .Emoji-card {
        flex-basis: calc(100% - 20px);
    }

    .Emoji-card:not(:nth-child(n)) {
        margin-right: 5%;
    }
}
</style>