<template>
  <!-- <header>
      <div class="affix-container">
        <div class="logo">Logo</div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </header> -->

  <header>
    <div class="affix-container">
      <a href="/"><img alt="logo" class="logo" src="https://zd.kjchmc.cn/table.6f7aaf4d.png"></a>
      <span class="title">Title</span>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <!-- <el-button @click="changeLanguage('zh-CN')">中文</el-button>
      <el-button @click="changeLanguage('en')">English</el-button>
      <el-button @click="changeLanguage('ja')">日本語</el-button> -->
  </header>
</template>
  
  <style scoped>
  /* 固定式顶栏布局 */
  .affix-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 55px;
    /* border-radius: 4px; */
    background-color: #454D5C;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);*/ /* 添加阴影效果 */
    padding: 0 50px; /* 内容距离页面边距距离 */
    box-shadow: 0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12);
  }
  
  .logo {
    height: 56px;
    image-rendering: pixelated;
  }

  .title {
    color: #FFFFFF;
    font-size: 1.3rem;
    font-weight: bold;
    margin-right: 20px; /* 将 logo 右边距离设置为 20px */
    margin-left: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: flex-end; /* 将 li 右对齐 */
    flex-grow: 1; /* 让 ul 占满剩余空间 */
  }
  
  li {
    margin-right: 10px;
  }
  
  a {
    color: #FFFFFF;
    text-decoration: none;
  }
  </style>
  