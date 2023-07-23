<template>
    <div>
        <Header />
        <div class="mainBody">
            <div class="CollectionDetails-header">
                <div class="bg" :style="{ backgroundImage: `url(${coverImageUrl})` }">
                    <div id="collection-info">
                        <h1 class="collection-title">{{ title }}</h1>
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
            <a>test</a>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useRoute } from "vue-router";
import Header from "../views/header.vue";

const { item } = defineProps(["item"]);
const constList = ref({});
const list = ref({});
const searchKey = ref("");

const route = useRoute();
const cid = computed(() => route.params.cid);

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
        `https://sapi.kjchmc.cn/api/collections/${cid.value}?populate=cover&populate=emojis.singleEmoji`
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
@import "../assets/css/scrollbar.css";
/* 引入 FontAwasome V6.4.0 图标 */
@import url("https://use.fontawesome.com/releases/v6.4.0/css/all.css");

body {
    /* background-color: #fff4e3; */
    /* background-color: rgb(153, 212, 207);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%23314661' fill-opacity='0.4'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E"); */
}

.mainBody {
    height: 100vh;
    overflow-y: scroll;
}

.CollectionDetails-header {
    position: relative;
    height: initial;
}

.bg {
    height: 400px;
    position: relative;
    width: 100%;
    /* background-color: #49b1f5; */
    background-image: url("https://sapi.kjchmc.cn/uploads/ba0046ab6e2e01d6f56c888bf91f5a22_7706821241784344516_58e9f8d77f.png");
    background-position: center center;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    -o-transition: all 0.5s;
    -ms-transition: all 0.5s;
    transition: all 0.5s;
}

.bg:before {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
    content: '';
}

#collection-info {
    position: absolute;
    bottom: 50%;
    /* 通过设置底部距离为50%，实现垂直居中 */
    left: 50%;
    /* 通过设置左侧距离为50%，实现水平居中 */
    transform: translate(-50%, 50%);
    /* 使用transform属性微调位置 */
    text-align: center;
}

#collection-info .collection-title {
    color: #FFFFFF;
    font-weight: normal;
    font-size: 2.5em;
    line-height: 1.5;
    -webkit-line-clamp: 3;
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
    /* width: 100%; */
    background-color: rgb(255 255 255 / 45%);
    border-radius: 5px;
}

.Emoji-card {
    /* max-width: calc(100vh - 56px); */
    margin-top: 20px;
    width: 180px;
    height: 180px;
    background-color: #FFFFFF;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
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
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    object-fit: contain;
}

.Emoji-name {
    margin-top: 5%;
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