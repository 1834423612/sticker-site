<template>
    <Header />
    <div class="mainBody">
        <!-- 首页 -->
        <div class="front-page"></div>

        <!-- 内容 -->
        <div class="app">
            <!-- 随机表情包 -->
            <main>
                <div class="section-header">
                    <h2 class="section-title">随机表情包</h2>
                    <button class="change-emojis-btn" @click="changeEmojis">换一批</button>
                </div>
                <div class="emoji-list" ref="emojiListRef">
                    <div v-for="emoji in displayedEmojis" :key="emoji.id" class="emoji-card"
                        @click="goToEmojiDetails(emoji)">
                        <img :src="getFullImageUrl(emoji.attributes.singleEmoji.data.attributes.url)" alt="表情包"
                            class="emoji-image" />
                    </div>
                </div>
            </main>

            <!-- 推荐合集 -->
            <main>
                <div class="collection-header">
                    <h2 class="collection-title">推荐合集</h2>
                    <span class="view-more-btn" @click="viewMore">查看更多</span>
                </div>
                <div class="collection-list" ref="collectionListRef">
                    <div v-for="collection in displayedCollections" :key="collection.id" class="collection-card"
                        @click="goToCollectionDetails(collection)">
                        <img :src="getFullImageUrl(collection.attributes.cover.data.attributes.url)" alt="合集封面"
                            class="collection-cover" ref="collectionCover" />
                        <!-- 彩色标签 - 使用 v-if 判断是否隐藏 -->
                        <div v-if="collection.attributes.tag" class="tags">
                            <i class="fas fa-hashtag"></i>
                            <span class="tag-text">{{ collection.attributes.tag }}</span>
                        </div>
                        <h3 class="collection-name">{{ collection.attributes.name }}</h3>
                        <div class="collection-describe">
                            <span>{{ collection.attributes.description }}</span>
                        </div>
                        <!-- 卡片底栏 -->
                        <div class="bottom-items">
                            <!-- 用户头像和用户名 -->
                            <div class="user-info">
                                <img src="https://sapi.kjchmc.cn/uploads/thumbnail_a98919993681d_4fb779faeb.jpg" alt="用户头像"
                                    class="user-avatar" />
                                <span class="user-name">用户名123</span>
                            </div>
                            <!-- 显示图片总数 -->
                            <div class="total-images">
                                <i class="fas fa-images"></i>
                                <span class="image-count">15张</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- 其他内容 -->
            <main>
                <div class="round-header">
                    <h2 class="round-title">推荐合集</h2>
                    <span class="round-view-more-btn" @click="viewMore">查看更多</span>
                </div>
                <div class="round-list" ref="collectionListRef">
                    <div v-for="collection in displayedCollections" :key="collection.id" class="round-card"
                        @click="goToCollectionDetails(collection)">
                        <img :src="getFullImageUrl(collection.attributes.cover.data.attributes.url)" alt="合集封面"
                            class="round-cover">
                        <h3 class="round-name">{{ collection.attributes.name }}</h3>
                    </div>
                </div>
            </main>
        </div>
        <Footer />
    </div>
    
</template>
  
<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            searchText: '',
            emojis: [],
            displayedEmojis: [],
            collections: [],
            displayedCollections: [],
            cardContainerWidth: 0,
        };
    },
    async mounted() {
        await this.fetchEmojis();
        await this.fetchCollections();
        this.changeEmojis();
        this.calculateCardContainerWidth();
        this.adjustCollectionCoverSize();
    },
    methods: {
        async fetchEmojis() {
            try {
                const response = await fetch('https://sapi.kjchmc.cn/api/emojis?populate=singleEmoji');
                const data = await response.json();
                this.emojis = data.data;
            } catch (error) {
                console.error('Failed to fetch emojis:', error);
            }
        },
        async fetchCollections() {
            try {
                const response = await fetch('https://sapi.kjchmc.cn/api/collections?populate=cover&populate=emojis');
                const data = await response.json();
                this.collections = data.data;
            } catch (error) {
                console.error('Failed to fetch collections:', error);
            }
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        getRandomEmojis() {
            const shuffledEmojis = this.shuffleArray(this.emojis);
            return shuffledEmojis.slice(0, 7);
        },
        changeEmojis() {
            this.displayedEmojis = this.getRandomEmojis();
            if (this.displayedCollections.length === 0) {
                this.displayedCollections = this.getRandomCollections();
            }
        },
        getRandomCollections() {
            const shuffledCollections = this.shuffleArray(this.collections);
            return shuffledCollections.slice(0, 6);
        },
        goToEmojiDetails(emoji) {
            this.$router.push({ name: 'newIn', params: { id: emoji.id } });
        },
        getFullImageUrl(url) {
            return `https://sapi.kjchmc.cn${url}`;
        },
        calculateCardContainerWidth() {
            const emojiList = this.$refs.emojiListRef;
            if (emojiList) {
                this.cardContainerWidth = emojiList.offsetWidth;
            }
        },
        goToCollectionDetails(collection) {
            // 使用this.$router.push将用户导航至合集详情页面
            this.$router.push({ name: 'CollectionDetails', params: { CID: collection.attributes.CID } });
        },
        viewMore() {
            this.$router.push({ name: 'CollectionDetails', params: { collections: this.collections } });
        },
        adjustCollectionCoverSize() {
            const collectionCover = this.$refs.collectionCover;
            if (collectionCover) {
                this.getImgNaturalDimensions(collectionCover, (img, dimensions) => {
                    const resImg = this.scale(this.cardContainerWidth, 999999, dimensions.w, dimensions.h);
                    img.style.width = resImg.w + 'px';
                    img.style.height = resImg.h + 'px';
                });
            }
        },
        getImgNaturalDimensions(oImg, callback) {
            if (!oImg.naturalWidth) {
                dimensions.w = oImg.naturalWidth;
                dimensions.h = oImg.naturalHeight;
                callback(oImg, { w: dimensions.w, h: dimensions.h });
            } else {
                const nImg = new Image();
                nImg.onload = function () {
                    dimensions.w = nImg.width;
                    dimensions.h = nImg.height;
                    callback(oImg, { w: dimensions.w, h: dimensions.h });
                };
                nImg.src = oImg.src;
            }
        },
        scale(maxW, maxH, orgW, orgH) {
            if (orgW < maxW && orgH < maxH) {
                return { w: orgW, h: orgH };
            } else if (orgW > maxW && orgH > maxH) {
                const sw = orgW / maxW;
                const sh = orgH / maxH;
                return sw > sh ? { w: maxW, h: maxH / sw } : { w: maxW / sh, h: maxH };
            } else if (orgW > maxW) {
                const sw = orgW / maxW;
                return { w: maxW, h: orgH / sw };
            } else {
                const sh = orgH / maxH;
                return { w: orgW / sh, h: maxH };
            }
        },
        computed: {
            displayedCollectionsWithTags() {
                // 使用filter方法过滤出"tag"不为null的合集数据
                return this.displayedCollections.filter(collection => collection.attributes.tag !== null);
            },
        }
    }
};
</script>
  
<style lang="scss" scoped>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";
/* 引入 FontAwasome V6.4.0 图标 */
@import url("https://use.fontawesome.com/releases/v6.4.0/css/all.css");

.mainBody {
    height: 100vh;
    overflow-y: scroll;
    background-color: #fff4e3;
}

main {
    margin-bottom: 1.5rem;
}

.app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.section-title {
    font-size: 24px;
    color: #555;
    margin-bottom: 10px;
}

.emoji-list {
    display: flex;
    justify-content: flex-start;
    margin-top: 1.19rem;
    margin-left: 0.06rem;
    max-width: fit-content;
}

.emoji-card {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    border-radius: 15px;
    background-color: #ffffff;
    width: 100px;
    height: 100px;
}

.emoji-image {
    width: 5.63rem;
    height: 5.63rem;
}

.change-emojis-btn {
    padding: 10px;
    font-size: 14px;
    /* border-radius: 4px; */
    background-color: #4285f4;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
    margin-right: 1rem;
}


/* 合集样式 */
.collection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.collection-title {
    font-size: 24px;
    color: #555;
    margin-bottom: 10px;
}

.collection-list {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    margin-left: 0.06rem;
    flex-wrap: wrap;
    /* max-width: fit-content; */
    /* overflow-x: auto; */
    /* 如果需要支持横向滚动，可以添加这一行 */
}

.collection-card {
    position: relative;
    /* 添加这一行，使得bottom-items的绝对定位相对于collection-card生效 */
    margin-right: 1rem;
    /* text-align: center; */
    cursor: pointer;
    /* flex: 0 0 15rem; */
    /* 设置卡片宽度为 200px，可以根据需要调整 */
    /* max-width: 200px; */
    /* 设置最大宽度，以防止卡片过宽 */
    display: flex;
    /* align-items: flex-start; */
    flex-direction: column;
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 15px;
    flex: 0 0 calc(29.33% - 1rem);
    margin-bottom: 1rem;
}

.collection-cover {
    /* width: 100px; */
    height: 8.5rem;
    border-radius: 10px;
    /* 图片圆角 */
}

.collection-name {
    margin-top: 1rem;
    margin-left: 2%;
    font-size: 18px;
    color: #555;
    margin-block-end: 0.8rem;
}

.collection-describe {
    background-color: #fafafa;
    padding: 0.8rem;
    color: #8a8a8a;
    font-size: x-small;
}

.view-more-btn {
    /* padding: 10px; */
    font-size: 15px;
    /* border-radius: 4px; */
    /* background-color: #4285f4; */
    color: #4285f4;
    border: none;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 20px;
}

/* 彩色标签样式 */
.tags {
    display: flex;
    align-items: center;
    color: #ff6000;
    /*#4285f4*/
    font-size: 16px;
    margin-top: 5%;
    margin-left: 2%;
    /* margin-bottom: 10px; */
}

.tag-text {
    margin-left: 3px;
    /* color: #4285f4; */
}

.bottom-items {
    /* position: absolute;
    bottom: 0;
    left: 0; */
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    /* padding: 10px 15px; */
}

/* 用户头像和用户名样式 */
.user-info {
    display: flex;
    align-items: center;
    margin-top: auto;
    /* 调整垂直位置到collection-card的底部 */
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

/* 显示图片总数样式 */
.total-images {
    /* position: absolute;
    bottom: 1.3rem;
    right: 3rem; */
    display: flex;
    align-items: center;
    color: #4285f4;
    font-size: 14px;
}

.image-count {
    margin-left: 5px;
}


/* 圆形 合集样式 */
.round-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.round-title {
    font-size: 24px;
    color: #555;
    margin-bottom: 10px;
}

.round-list {
    display: flex;
    justify-content: flex-start;
    margin-top: 1.19rem;
    margin-left: 0.06rem;
    max-width: fit-content;
}

.round-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 0.94rem;
    text-align: center;
    cursor: pointer;
}

.round-cover {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.round-name {
    margin-top: 0.5rem;
    font-size: 14px;
    color: #555;
}

.round-view-more-btn {
    /* padding: 10px; */
    font-size: 15px;
    /* border-radius: 4px; */
    /* background-color: #4285f4; */
    color: #4285f4;
    border: none;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 20px;
}
</style>
  