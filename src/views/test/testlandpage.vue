<template>
    <Header />
    <div class="page-container">
        <section id="first">
            <div class="body">
                <img alt="logo" class="shake-slow logo" src="https://zd.kjchmc.cn/kjch.88b172ed.png">
                
                <p></p>
                <div class="buttons">
                    <a role="button" class="btn btn-primary" href="https://file.kjchmc.cn/Minecraft/school/忠德资料/"
                        target="_blank">下载地图&材质包</a><a role="button" class="btn btn-secondary"
                        href="http://mc.kjchmc.cn:8123/">查看服务器卫星地图</a>
                </div>
                <div class="buttons" style="margin-top: 10px;">
                    <a role="button" class="btn1 btn1-primary" href="./About/index.html"
                        style="background-color: #49b1f5; box-shadow: 0 -4px rgb(0 0 0 / 30%) inset, 0 4px rgb(255 255 255 / 50%) inset, -4px 0 rgb(255 255 255 / 50%) inset, 4px 0 rgb(0 0 0 / 30%) inset;">关于本项目</a>
                </div>
            </div>
        </section>

        <section id="section2">
            <div class="container">
                <div class="section2-content">
                    <div class="left">
                        <div class="title">UI/UX DESIGN</div>
                        <div class="summary">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed</div>
                        <div class="button-wrapper">
                            <button class="button">CLICK HERE</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    }
}
</script>


<style scoped>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";

body {
    margin: 0;
    font-variant: tabular-nums;
    font-feature-settings: "tnum";
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}

.page-container {
    height: 100vh;
    overflow-y: scroll;
}

#first {
    min-height: 88vh;
    display: flex;
    justify-content: flex-start;
    /* background-size: cover; */
    background-size: 80%;
    /* background-attachment: fixed; */
    /* 背景图片不会随着页面的滚动而滚动 */
    background-attachment: scroll;
    background-image: url(https://zd.kjchmc.cn/bg.17662a4a.png);
    background-repeat: no-repeat;
    background-position: right bottom;
    /* 将背景图片放置右下角 */
    /* background-position: center; */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.86);
    color: #fff;
    padding-top: 56px;
    align-items: center;
}

#first h1 {
    font-family: minecraft;
    font-size: 4rem;
    margin: 0;
}

#first .body {
    margin-left: 10vw;
    width: 75%;
    /* 调整section1内容的宽度 */
}

#first .logo {
    height: 13rem;
    /* width: 25%; */
    /* 调整logo图片的宽度 */
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 56px);
    padding-left: 35px;
}

.section2-content {
    position: relative;
    z-index: 1;
}

.left {
    text-align: left;
    padding: 20px;
}

.section2-content::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://sapi.kjchmc.cn/uploads/testcover_c71569d8bd.png');
    background-size: cover;
    background-position: bottom right;
    opacity: 0.5;
}

/* @media screen and (min-width: 768px) {
    .container {
        justify-content: flex-start;
        height: auto;
        padding-left: 10vw;
    }

    .section2-content::before {
        width: 65vw;
        height: 80vh;
    }
} */
</style>
  