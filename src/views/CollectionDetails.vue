<template>
    <div>
        <Header />
        <div class="mainBody">
            <!-- Header部分 -->
            <div class="CollectionDetails-header">
                <div class="bg">
                    <div class="bg-container">
                        <!-- 面包屑 -->
                        <el-breadcrumb :separator-icon="ArrowRight">
                            <el-breadcrumb-item :to="{ path: '/testindex' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>全部合集</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
                        </el-breadcrumb>


                        <div id="collection-info" class="title-section">
                            <div class="collection-icon">
                                <img src="https://sapi.kjchmc.cn/uploads/photo_2023_07_15_18_45_22_d10331920d.jpg" />
                            </div>

                            <div class="collection-details">
                                <h1 class="collection-title">{{ title }}</h1>
                                <!-- 用户头像和用户名 -->
                                <div class="user-info">
                                    <img src="https://sapi.kjchmc.cn/uploads/thumbnail_a98919993681d_4fb779faeb.jpg"
                                        alt="用户头像" class="user-avatar" />
                                    <span class="user-name">用户名123</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="CollectionDetails-body">
                <div class="card-wrapper" id="Emoji">
                    <div class="card-container" id="Emoji">
                        <div class="Emoji-card" v-if="emojis && emojis.length > 0" v-for="(emoji, index) in emojis"
                            :key="emoji.id">
                            <img class="Emoji-img" :src="getEmojiImageUrl(emoji.attributes.singleEmoji.data)"
                                :preview-src-list="[getEmojiImageUrl(emoji.attributes.singleEmoji.data)]" />
                            <span class="Emoji-name">{{ emoji.attributes.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <a>test</a> -->
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from '@element-plus/icons-vue'
import Header from '@/components/Header.vue';

const { item } = defineProps(["item"]);
const constList = ref({});
const list = ref({});
const searchKey = ref("");

const route = useRoute();
const CID = computed(() => route.params.CID);

// 修改onMounted生命周期钩子
onMounted(async () => {
    try {
        await fetchData();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

const fetchData = async () => {
    const response = await fetch(
        `https://sapi.kjchmc.cn/api/collections/${CID.value}?populate=cover&populate=emojis.singleEmoji`
    );
    const json = await response.json();
    constList.value = json.data;
    list.value = json.data;
};

const getImageUrl = (emoji) => {
    return "https://sapi.kjchmc.cn" + emoji.attributes.singleEmoji.data.attributes.url;
};

const getEmojiImageUrl = (emoji) => {
    return "https://sapi.kjchmc.cn" + emoji.attributes.url;
};

// 确保emojis能够正确获取到
const emojis = computed(() => {
    if (list.value.attributes && list.value.attributes.emojis && list.value.attributes.emojis.data) {
        return list.value.attributes.emojis.data;
    } else {
        return [];
    }
});

const coverImageUrl = computed(() => {
    if (list.value.attributes && list.value.attributes.cover) {
        return "https://sapi.kjchmc.cn" + list.value.attributes.cover.data.attributes.url;
    } else {
        return "";
    }
});

const title = computed(() => list.value.attributes ? list.value.attributes.name : "");

// 修改searchList、showMore和goBack函数
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
        list.value = list.value.filter((k) => k.attributes.name.indexOf(searchKey.value) != -1);
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
  
<style>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";
/* 引入 FontAwasome V6.4.0 图标 */
@import url("https://use.fontawesome.com/releases/v6.4.0/css/all.css");

body {
    background-color: #fff4e3;
    /* background-color: rgb(153, 212, 207); */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23bda47d' fill-opacity='0.4'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
}

.mainBody {
    height: 100vh;
    overflow-y: scroll;
}

.CollectionDetails-header {
    position: relative;
    height: 40%;
}

.bg {
    display: flex;
    align-items: flex-start;
    height: 100%;
    width: 100%;
    position: relative;
    background-image: linear-gradient(0deg, #e8f6ff 0%, #4db8ff 100%);
}

.bg::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 40%;
    background: -webkit-gradient(linear, left bottom, left top, from(#f3f5f7), to(rgba(0, 0, 0, 0)));
    background: -webkit-linear-gradient(bottom, #f3f5f7, rgba(0, 0, 0, 0));
    background: -o-linear-gradient(bottom, #f3f5f7, rgba(0, 0, 0, 0));
    background: linear-gradient(0deg, #fff4e3, rgba(0, 0, 0, 0))
}

/* .bg:before {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    content: '';
} */


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
    margin-top: 10px;
    padding: 20px;
    border-radius: 10px;
    /* 设置大卡片长宽 */
    height: 50%;
    width: 85.5%;
    background-color: cornflowerblue;
}

#collection-info .collection-title {
    color: #FFFFFF;
    font-weight: normal;
    font-size: 300%;
    line-height: 1.5;
    -webkit-line-clamp: 3;
}

.bg-container {
    width: 100%;
    height: 100%;
    margin-top: 4rem;
    margin-left: 10%;
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






.user-info {
    display: flex;
    align-items: center;
    margin-top: auto;
    flex-direction: row;
}

.user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
}

.user-name {
    font-size: 14px;
    margin-left: 3px;
}

.el-breadcrumb {
    font-size: 14px;
    line-height: 1;
    padding-bottom: 10px;
}

.CollectionDetails-body {
    position: relative;
    height: initial;
    margin: 3rem 0 5rem 0;
}

#Emoji.card-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    /* min-width: calc(100vh - 56px); */
    padding: 0px 10%;
    /* background-color: azure; */
}

#Emoji.card-container {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem 1rem 1.8rem 1rem;
    width: 100%;
    background-color: rgb(255 255 255 / 45%);
    border-radius: 5px;
}

.Emoji-card {
    /* max-width: calc(100vh - 56px); */
    margin-top: 20px;
    padding: 10px;
    width: 180px;
    height: 180px;
    background-color: #FFFFFF;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    flex-wrap: nowrap;
    box-sizing: border-box;
    /* 将边框包含在卡片的内部 */
}

.Emoji-card:hover {
    outline: 2px solid var(--el-color-primary-light-3);
    /* 添加边框效果 #79bbff */
}

.Emoji-card:not(:nth-child(4n)),
.Emoji-card:first-child {
    margin-left: 20px;
}

.Emoji-card:not(:nth-child(4n)),
.Emoji-card:last-child {
    margin-right: 20px;
}

/* 卡片前3个增加样式 */
/* .Emoji-card:not(:nth-child(4n)) {
    margin-right: 5%;
} */

/* 修改图片样式 */
.Emoji-img {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    object-fit: contain;
}

/* .Emoji-name {
    margin-top: 5%;
} */


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